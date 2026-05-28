type XgenBridge = {
  selectOutputDirectory: () => Promise<string | null>;
  showItemInFolder: (filePath: string) => Promise<boolean>;
  openPath: (filePath: string) => Promise<{ error: string | null }>;
};

declare global {
  interface Window {
    xgen?: XgenBridge;
  }
}

export {};
