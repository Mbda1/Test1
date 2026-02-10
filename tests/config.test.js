import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/config.js';

test('loadConfig returns defaults when env vars are missing', () => {
  const config = loadConfig({});
  assert.equal(config.port, 3000);
  assert.equal(config.appName, 'Starter API');
});

test('loadConfig uses valid environment values', () => {
  const config = loadConfig({ PORT: '5050', APP_NAME: 'My Service' });
  assert.equal(config.port, 5050);
  assert.equal(config.appName, 'My Service');
});

test('loadConfig falls back to default port when invalid', () => {
  const config = loadConfig({ PORT: 'not-a-number' });
  assert.equal(config.port, 3000);
});
