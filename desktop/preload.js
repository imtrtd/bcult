'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('itd', {
  minimize: () => ipcRenderer.send('window:minimize'),
  toggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  close: () => ipcRenderer.send('window:close'),
  toggleFullscreen: () => ipcRenderer.send('window:toggle-fullscreen'),
  leaveFullscreen: () => ipcRenderer.send('window:leave-fullscreen'),
  queryState: () => ipcRenderer.invoke('window:query-state'),
  onState: (cb) => {
    const handler = (_event, state) => cb(state);
    ipcRenderer.on('window:state', handler);
    return () => ipcRenderer.off('window:state', handler);
  },
  platform: process.platform,
  versions: {
    app: process.env.npm_package_version || null,
    electron: process.versions.electron,
    chrome: process.versions.chrome
  }
});
