// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("xgen", {
  selectOutputDirectory: () => ipcRenderer.invoke("xgen:select-output-directory"),
  showItemInFolder: (filePath) => ipcRenderer.invoke("xgen:show-item-in-folder", filePath),
  openPath: (filePath) => ipcRenderer.invoke("xgen:open-path", filePath),
});

window.addEventListener("error", (event) => {
  console.error(
    "[xgen-preload] window error",
    event.message,
    event.filename,
    event.lineno,
    event.colno,
    event.error?.stack,
  );
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("[xgen-preload] unhandled rejection", event.reason?.stack || event.reason);
});
