/**
 * Resolves a path relative to the current file (via `import.meta.url`) rather than `process.cwd()`.
 *
 * This makes scripts/configs work the same whether you run them from the package directory
 * or from the repository root (e.g. when Nx changes the working directory).
 */
function nxAwarePath(relativePath, importMetaUrl) {
  return new URL(relativePath, importMetaUrl).pathname
}

module.exports = { nxAwarePath }
