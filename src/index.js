import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { loadConfig } from './config.js';

const { port, appName } = loadConfig();

export function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', appName }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${appName} is running on port ${port}`);
  });
}

const isEntryPoint = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isEntryPoint) {
  const server = createServer();
  server.listen(port, () => {
    console.log(`${appName} listening on http://localhost:${port}`);
  });
}
