const DEFAULT_PORT = 3000;
const DEFAULT_APP_NAME = 'Starter API';

export function loadConfig(env = process.env) {
  const port = Number.parseInt(env.PORT ?? `${DEFAULT_PORT}`, 10);

  return {
    port: Number.isNaN(port) ? DEFAULT_PORT : port,
    appName: env.APP_NAME?.trim() || DEFAULT_APP_NAME,
  };
}
