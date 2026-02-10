import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from '../src/index.js';

test('GET /health returns status payload', async () => {
  const server = createServer();
  server.listen(0);
  await once(server, 'listening');

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/health`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.status, 'ok');

  server.close();
});
