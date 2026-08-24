'use strict';

const { app, BrowserWindow, Menu, ipcMain, shell, dialog, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { exec } = require('node:child_process');

const APP_ID = 'com.imtrtd.neonspiral';
const BG = '#04040a';
const isDev = process.argv.includes('--dev');

let win = null;

/* ---------------------------------------------------------------- json store */

function jsonFile(name) {
  return path.join(app.getPath('userData'), name);
}

function readJson(name, fallback) {
  try {
    return { ...fallback, ...JSON.parse(fs.readFileSync(jsonFile(name), 'utf8')) };
  } catch {
    return { ...fallback };
  }
}

function writeJson(name, value) {
  try {
    fs.mkdirSync(app.getPath('userData'), { recursive: true });
    fs.writeFileSync(jsonFile(name), JSON.stringify(value, null, 2));
    return true;
  } catch {
    return false;                                   // preferences are a convenience, never fatal
  }
}

/* ---------------------------------------------------------------- window state */

const DEFAULT_STATE = { width: 1440, height: 900, maximized: false, fullscreen: false };

function readState() {
  const state = readJson('window-state.json', DEFAULT_STATE);
  if (!Number.isFinite(state.width) || state.width < 900) state.width = DEFAULT_STATE.width;
  if (!Number.isFinite(state.height) || state.height < 620) state.height = DEFAULT_STATE.height;
  if (!Number.isFinite(state.x) || !Number.isFinite(state.y)) { delete state.x; delete state.y; }
  return state;
}

function writeState() {
  if (!win || win.isDestroyed()) return;
  const bounds = win.isMaximized() || win.isFullScreen() ? win.getNormalBounds() : win.getBounds();
  writeJson('window-state.json', {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    maximized: win.isMaximized(),
    fullscreen: win.isFullScreen()
  });
}

/* ---------------------------------------------------------------- window */

function createWindow() {
  const state = readState();

  win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 880,
    minHeight: 600,
    show: false,
    frame: false,
    backgroundColor: BG,
    title: 'I/TD Neon Spiral',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      backgroundThrottling: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.once('ready-to-show', () => {
    if (state.fullscreen) win.setFullScreen(true);
    else if (state.maximized) win.maximize();
    win.show();
    if (isDev) win.webContents.openDevTools({ mode: 'detach' });
  });

  const push = () => {
    if (win && !win.isDestroyed()) win.webContents.send('window:state', windowState());
  };
  for (const evt of ['maximize', 'unmaximize', 'enter-full-screen', 'leave-full-screen', 'focus', 'blur']) {
    win.on(evt, push);
  }

  let saveTimer = null;
  const scheduleSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(writeState, 400);
  };
  win.on('resize', scheduleSave);
  win.on('move', scheduleSave);
  win.on('close', () => { clearTimeout(saveTimer); writeState(); });
  win.on('closed', () => { win = null; });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    }
  });
}

function windowState() {
  if (!win || win.isDestroyed()) return { maximized: false, fullscreen: false, pinned: false, focused: false };
  return {
    maximized: win.isMaximized(),
    fullscreen: win.isFullScreen(),
    pinned: win.isAlwaysOnTop(),
    focused: win.isFocused()
  };
}

/* ---------------------------------------------------------------- launcher */

/** Wraps a bare name ("chrome", "msedge") so the OS resolves it the way a
 * user's own shell would — Windows via the App Paths registry key that
 * browser and chat-app installers register, so no hard-coded install
 * directory is needed. */
function shellCommand(value) {
  const safe = String(value).replace(/"/g, '""');
  if (process.platform === 'win32') return `start "" "${safe}"`;
  if (process.platform === 'darwin') return `open -a "${safe}"`;
  return `${safe} &`;
}

function runShell(command) {
  return new Promise((resolve) => {
    exec(command, { windowsHide: true, timeout: 8000 }, (error) => {
      resolve(error ? { ok: false, error: String(error.message || error) } : { ok: true });
    });
  });
}

/** shell.openPath / shell.openExternal have no built-in timeout and can hang
 * indefinitely when nothing on the system claims the path or protocol —
 * bound every launch attempt so a bad target reads as "failed", not "stuck". */
function withDeadline(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve('__itd_timeout__'), ms))
  ]);
}

async function launchTarget(spec) {
  if (!spec || typeof spec !== 'object' || typeof spec.value !== 'string') {
    return { ok: false, error: 'empty target' };
  }
  // every type but 'explorer' needs a real value — explorer falls back to
  // the home folder, so an empty string there is a deliberate default, not
  // a mistake
  if (spec.type !== 'explorer' && !spec.value.trim()) {
    return { ok: false, error: 'empty target' };
  }
  const value = spec.value.trim();
  try {
    switch (spec.type) {
      case 'protocol':
      case 'url': {
        if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) return { ok: false, error: 'not a URI' };
        const r = await withDeadline(shell.openExternal(value), 6000);
        return r === '__itd_timeout__' ? { ok: false, error: 'timeout' } : { ok: true };
      }

      case 'path': {
        const err = await withDeadline(shell.openPath(value), 6000);
        if (err === '__itd_timeout__') return { ok: false, error: 'timeout' };
        return err ? { ok: false, error: err } : { ok: true };
      }

      case 'command':
        return runShell(shellCommand(value));

      case 'explorer': {
        const target = value || app.getPath('home');
        const err = await withDeadline(shell.openPath(target), 6000);
        if (err === '__itd_timeout__') return { ok: false, error: 'timeout' };
        return err ? { ok: false, error: err } : { ok: true };
      }

      default:
        return { ok: false, error: 'unknown launch type' };
    }
  } catch (error) {
    return { ok: false, error: String(error && error.message) };
  }
}

async function pickAppPath() {
  if (!win) return { ok: false };
  const filters = process.platform === 'win32'
    ? [{ name: 'Программы и ярлыки', extensions: ['exe', 'lnk'] }, { name: 'Все файлы', extensions: ['*'] }]
    : [{ name: 'Все файлы', extensions: ['*'] }];
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: 'Выберите приложение',
    properties: ['openFile'],
    filters
  });
  if (canceled || !filePaths.length) return { ok: false };
  const chosen = filePaths[0];
  const base = path.basename(chosen).replace(/\.(exe|lnk|app)$/i, '');
  return { ok: true, path: chosen, name: base };
}

/* ---------------------------------------------------------------- snapshot */

async function snapshot() {
  if (!win || win.isDestroyed()) return { ok: false };
  const image = await win.capturePage();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const suggested = path.join(app.getPath('pictures'), `itd-spiral-${stamp}.png`);
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Сохранить кадр',
    defaultPath: suggested,
    filters: [{ name: 'PNG', extensions: ['png'] }]
  });
  if (canceled || !filePath) return { ok: false };
  try {
    fs.writeFileSync(filePath, image.toPNG());
    return { ok: true, path: filePath };
  } catch (error) {
    return { ok: false, error: String(error && error.message) };
  }
}

/* ---------------------------------------------------------------- menu */

function buildMenu() {
  const zoom = (delta) => {
    if (!win) return;
    win.webContents.setZoomLevel(Math.min(2.5, Math.max(-1.5, win.webContents.getZoomLevel() + delta)));
  };

  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: 'App',
    submenu: [
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => win && win.reload() },
      { label: 'Toggle Full Screen', accelerator: 'F11', click: () => win && win.setFullScreen(!win.isFullScreen()) },
      { label: 'Save Snapshot', accelerator: 'CmdOrCtrl+S', click: () => snapshotAndReport() },
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', click: () => zoom(0.5) },
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', visible: false, click: () => zoom(0.5) },
      { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => zoom(-0.5) },
      { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => win && win.webContents.setZoomLevel(0) },
      { label: 'Developer Tools', accelerator: 'CmdOrCtrl+Shift+I', click: () => win && win.webContents.toggleDevTools() },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
    ]
  }]));
}

async function snapshotAndReport() {
  const result = await snapshot();
  if (win && !win.isDestroyed()) win.webContents.send('app:snapshot-result', result);
}

/* ---------------------------------------------------------------- lifecycle */

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });

  app.setAppUserModelId(APP_ID);
  nativeTheme.themeSource = 'dark';

  app.whenReady().then(() => {
    ipcMain.on('window:minimize', () => win && win.minimize());
    ipcMain.on('window:toggle-maximize', () => {
      if (!win) return;
      if (win.isFullScreen()) win.setFullScreen(false);
      else if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    });
    ipcMain.on('window:close', () => win && win.close());
    ipcMain.on('window:toggle-fullscreen', () => win && win.setFullScreen(!win.isFullScreen()));
    ipcMain.on('window:leave-fullscreen', () => win && win.isFullScreen() && win.setFullScreen(false));
    ipcMain.handle('window:query-state', () => windowState());
    ipcMain.handle('window:toggle-pin', () => {
      if (!win) return false;
      const next = !win.isAlwaysOnTop();
      win.setAlwaysOnTop(next, 'screen-saver');
      return next;
    });

    ipcMain.handle('app:snapshot', () => snapshot());
    ipcMain.handle('app:settings-get', () => readJson('settings.json', {}));
    ipcMain.handle('app:settings-set', (_e, value) => writeJson('settings.json', value && typeof value === 'object' ? value : {}));
    ipcMain.handle('app:info', () => ({
      version: app.getVersion(),
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      platform: process.platform,
      arch: process.arch,
      userData: app.getPath('userData')
    }));
    ipcMain.on('app:open-external', (_e, url) => {
      if (typeof url === 'string' && /^https?:\/\//i.test(url)) shell.openExternal(url);
    });
    ipcMain.handle('app:launch', (_e, spec) => launchTarget(spec));
    ipcMain.handle('app:pick-path', () => pickAppPath());

    buildMenu();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
