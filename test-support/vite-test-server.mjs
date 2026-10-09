import { createServer } from "vite";

/**
 * Starts a Vite server only to transform source modules for node:test.
 *
 * The file watcher and websocket are disabled: tests never need HMR, and an inotify watcher exhausts the
 * system watch limit on busy machines (ENOSPC). The server is closed if loading fails; otherwise the
 * caller closes it from the `after` hook through `close()`.
 */
export const startViteModuleLoader = async (modulePaths) => {
  const server = await createServer({
    appType: "custom",
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false, watch: null, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
  });

  try {
    const modules = {};
    for (const [name, path] of Object.entries(modulePaths)) {
      modules[name] = await server.ssrLoadModule(path);
    }
    return { modules, close: () => server.close() };
  } catch (error) {
    await server.close();
    throw error;
  }
};

export const installLocalStorageStub = () => {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};
