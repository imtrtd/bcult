'use strict';

const { app, BrowserWindow, Menu, ipcMain, shell, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const APP_ID = 'com.imtrtd.neonspiral';
const BG = '#010106';
const isDev = process.argv.includes('--dev');

let win = null;

/* ---------------------------------------------------------------- window state */

const stateFile = () => path.join(app.getPath('userData'), 'window-state.json');

const DEFAULT_STATE = { width: 1440, height: 900, maximized: false, fullscreen: false };

function readState() {
  try {
    const raw = JSON.parse(fs.readFileSync(stateFile(), 'utf8'));
    const state = { ...DEFAULT_STATE, ...raw };
    if (!Number.isFinite(state.width) || state.width < 900) state.width = DEFAULT_STATE.width;
    if (!Number.isFinite(state.height) || state.height < 600) state.height = DEFAULT_STATE.height;
    if (!Number.isFinite(state.x) || !Number.isFinite(state.y)) { delete state.x; delete state.y; }
    return state;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function writeState() {
  if (!win || win.isDestroyed()) return;
  const bounds = win.isMaximized() || win.isFullScreen() ? win.getNormalBounds() : win.getBounds();
  const state = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    maximized: win.isMaximized(),
    fullscreen: win.isFullScreen()
  };
  try {
    fs.mkdirSync(path.dirname(stateFile()), { recursive: true });
    fs.writeFileSync(stateFile(), JSON.stringify(state, null, 2));
  } catch {
    /* window position is a convenience — never let it break the app */
  }
}

/* ---------------------------------------------------------------- window */

function createWindow() {
  const state = readState();

  win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 900,
    minHeight: 620,
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

  const notifyChrome = () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('window:state', {
        maximized: win.isMaximized(),
        fullscreen: win.isFullScreen()
      });
    }
  };
  for (const evt of ['maximize', 'unmaximize', 'enter-full-screen', 'leave-full-screen']) {
    win.on(evt, notifyChrome);
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

  // Everything external opens in the real browser; the app window itself stays on the spiral.
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

/* ---------------------------------------------------------------- menu / shortcuts */

function buildMenu() {
  const zoom = (delta) => {
    if (!win) return;
    const next = Math.min(2.5, Math.max(-1.5, win.webContents.getZoomLevel() + delta));
    win.webContents.setZoomLevel(next);
  };

  const template = [
    {
      label: 'App',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => win && win.reload() },
        {
          label: 'Toggle Full Screen',
          accelerator: 'F11',
          click: () => win && win.setFullScreen(!win.isFullScreen())
        },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', click: () => zoom(0.5) },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', visible: false, click: () => zoom(0.5) },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => zoom(-0.5) },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => win && win.webContents.setZoomLevel(0)
        },
        {
          label: 'Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => win && win.webContents.toggleDevTools()
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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
    ipcMain.handle('window:query-state', () =>
      win ? { maximized: win.isMaximized(), fullscreen: win.isFullScreen() } : { maximized: false, fullscreen: false }
    );

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
