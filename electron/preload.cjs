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
