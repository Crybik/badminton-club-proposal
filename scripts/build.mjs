import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { renderPage } from '../src/view.js';
import { commercial, content } from '../src/content.js';
import assert from 'node:assert/strict';

assert.equal(commercial.upfront + commercial.balance, commercial.price);
assert.deepEqual(Object.keys(content.en), Object.keys(content.ar), 'Both languages must expose the same sections');
assert.equal(content.en.features.length, content.ar.features.length);
await mkdir('dist/assets', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src', 'dist/assets', { recursive: true });
const template = await readFile('index.html', 'utf8');
await writeFile('dist/index.html', template.replace('<!-- APP -->', renderPage('en', 'players')), 'utf8');
let commit = process.env.RAILWAY_GIT_COMMIT_SHA;
if (!commit) { try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { commit = 'local'; } }
await writeFile('dist/release.json', JSON.stringify({ version: '2.0.0', commit, builtAt: new Date().toISOString() }), 'utf8');
console.log(`Build complete: ${commercial.price} JD, ${content.en.features.length} scope cards, EN/AR, commit ${commit}`);
