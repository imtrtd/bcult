'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const on = (channel, cb) => {
  const handler = (_event, payload) => cb(payload);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.off(channel, handler);
};

contextBridge.exposeInMainWorld('itd', {
  /* window */
  minimize: () => ipcRenderer.send('window:minimize'),
  toggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  close: () => ipcRenderer.send('window:close'),
  toggleFullscreen: () => ipcRenderer.send('window:toggle-fullscreen'),
  leaveFullscreen: () => ipcRenderer.send('window:leave-fullscreen'),
  togglePin: () => ipcRenderer.invoke('window:toggle-pin'),
  queryState: () => ipcRenderer.invoke('window:query-state'),
  onState: (cb) => on('window:state', cb),

  /* app */
  snapshot: () => ipcRenderer.invoke('app:snapshot'),
  onSnapshotResult: (cb) => on('app:snapshot-result', cb),
  openExternal: (url) => ipcRenderer.send('app:open-external', url),
  info: () => ipcRenderer.invoke('app:info'),
  settingsGet: () => ipcRenderer.invoke('app:settings-get'),
  settingsSet: (value) => ipcRenderer.invoke('app:settings-set', value),

  platform: process.platform
});
