const {
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  readJson,
} = require('@nx/devkit')
const path = require('node:path')

module.exports = async function libraryGenerator(tree, options) {
  const projectRoot = `packages/${options.name}`
  const nxJson = readJson(tree, 'nx.json')
  const npmScope = nxJson.npmScope

  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(projectRoot),
    description: options.description || '',
    npmScope,
    template: '',
  }

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    projectRoot,
    templateOptions
  )

  updateVitestConfig(tree, options.name, npmScope)

  if (!options.skipCoverage) {
    updateCiWorkflow(tree, options.name)
  }

  await formatFiles(tree)

  return () => {
    console.log(`\n✅ Library "${options.name}" created successfully!`)
    console.log(`\n📁 Location: ${projectRoot}`)
    console.log('\n📋 Next steps:')
    console.log(`   1. Add your exports to ${projectRoot}/src/index.ts`)
    console.log(`   2. Write tests in ${projectRoot}/test/`)
    console.log(`   3. Run: pnpm nx build ${options.name}`)
    if (!options.skipCoverage) {
      console.log(`\n🧪 CI coverage report step added for "${options.name}"`)
    }
  }
}

function updateVitestConfig(tree, name, npmScope) {
  const vitestConfigPath = 'vitest.config.ts'
  const content = tree.read(vitestConfigPath, 'utf-8')

  if (!content) {
    console.warn('Could not read vitest.config.ts')
    return
  }

  const newWorkspaceEntry = `  {
    test: {
      ...sharedTestOptions,
      name: '${name}',
      root: './packages/${name}',
      include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist'],
      typecheck: {
        enabled: true,
        tsconfig: './packages/${name}/tsconfig.json',
      },
      coverage: {
        ...sharedCoverage,
        reportsDirectory: './coverage',
      },
    },
    resolve: {
      alias: {
        '@${npmScope}/${name}': new URL('./packages/${name}/src', import.meta.url).pathname,
      },
    },
  },`

  const closingBracketIndex = content.lastIndexOf('])')
  if (closingBracketIndex === -1) {
    console.warn('Could not find closing bracket in vitest.config.ts')
    return
  }

  const updatedContent =
    content.slice(0, closingBracketIndex) +
    newWorkspaceEntry +
    '\n' +
    content.slice(closingBracketIndex)

  tree.write(vitestConfigPath, updatedContent)
}

function updateCiWorkflow(tree, name) {
  const ciWorkflowPath = '.github/workflows/ci.yml'
  const content = tree.read(ciWorkflowPath, 'utf-8')

  if (!content) {
    console.warn('Could not read .github/workflows/ci.yml')
    return
  }

  const coverageStep = `
      - name: Report Coverage (${name})
        if: always()
        uses: davelosert/vitest-coverage-report-action@v2
        with:
          json-summary-path: packages/${name}/coverage/coverage-summary.json
          name: ${name}`

  const updatedContent = content.trimEnd() + '\n' + coverageStep + '\n'

  tree.write(ciWorkflowPath, updatedContent)
}

