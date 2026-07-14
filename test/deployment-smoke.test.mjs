import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

test('admin frontend keeps the production entry point and /admin base path', () => {
  assert.equal(existsSync(resolve(projectRoot, 'src/main.jsx')), true)

  const viteConfig = readFileSync(resolve(projectRoot, 'vite.config.js'), 'utf8')
  assert.match(viteConfig, /base:\s*['"]\/admin\//)
})
