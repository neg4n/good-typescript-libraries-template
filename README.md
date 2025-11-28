# Good TypeScript Library Template

An opinionated production-ready TypeScript **monorepo** template with automated builds, testing, and releases powered by Nx.

And believe me. **It is good.**

<img width="380" src="https://github.com/user-attachments/assets/e3ecf54c-13c4-4baa-a253-d2861d4bf4e9" />

## Features

- 🧭 **Nx-managed Monorepo** – multiple libraries under `packages/*` with shared tooling
- 📦 **Dual Package Support** – Rollup outputs CommonJS and ESM builds per package
- 🛡️ **Type Safety** – Extremely strict TypeScript configuration (shared `tsconfig.base.json`)
- 🔐 **Always up-to-date deps** – [Renovate](https://github.com/renovatebot/renovate) bot for CVE-aware automatic dependency updates
- ✅ **Build Validation** – Uses `@arethetypeswrong/cli` to check package exports
- 🧪 **Automated Testing** – Vitest workspace with per-package projects and coverage reporting
- 🎨 **Code Quality** – Biome linting/formatting with pre-commit hooks
- 🚀 **Automated Releases** – Nx Release (conventional commits, per-package tags & changelogs)
- ⚙️ **CI/CD Pipeline** – GitHub Actions for testing, versioning, and publishing
- 🔧 **One-Click Setup** – Automated repository configuration with `init.sh` script
    - 🏛️ **Repository rulesets** - Branch protection with linear history and PR reviews
    - 🚷 **Feature cleanup** - Disable wikis, projects, squash/merge commits
    - 🔄 **Merge restrictions** - Rebase-only workflow at repository and ruleset levels
    - 👑 **Admin bypass** - Repository administrators can bypass protection rules
    - 🔍 **Actions verification** - Ensure GitHub Actions are enabled
    - 🗝️ **Secrets validation** - Check and guide setup of required secrets

## Tech Stack

- **Nx** - Orchestrates tasks, caching, and releases across packages
- **TypeScript** - Strict configuration for type safety
- **Rollup** - Builds both CommonJS and ESM formats per package
- **Biome** - Fast linting and formatting
- **Vitest** - Testing with coverage reports (workspace config)
- **Husky** - Pre-commit hooks for code quality
- **Nx Release** - Automated versioning/changelog + npm publishing
- **pnpm** - Fast package management with Corepack
- **GitHub Actions** - CI/CD pipeline (validation, versioning, publishing)

## Repository layout
```
packages/
  core/
    src/            # library source
    test/           # vitest tests
    rollup.config.js
    project.json    # Nx targets
```
Shared config: `tsconfig.base.json`, `vitest.config.ts`, `biome.json`, `nx.json`, `pnpm-workspace.yaml`.

## Setup

### 1. Use the template

Run this in your terminal _[GitHub CLI](https://cli.github.com) required_

```bash
gh repo create my-typescript-libraries --clone --template neg4n/good-typescript-libraries-template --private && cd my-typescript-libraries
```

> [!NOTE]
> Replace `my-typescript-libraries` with your new library name, you can also change the visibility of the newly created repo by passing `--public` instead of `--private`! Read more about possible options in [GitHub CLI documentation](https://cli.github.com/manual/gh_repo_create)

#### Setup via GitHub web interface

If for some reason you can't run the mentioned commands in your terminal, click the "Use this template ▾" button below (or in the top right corner of the repository page)

<a href="https://github.com/new?template_name=good-typescript-libraries-template&template_owner=neg4n">
<img src="https://github.com/user-attachments/assets/784be0dd-530f-4135-b042-ab59dc9124a6" width="200" />
</a>

### 2. Minimal Setup

Run the initialization script to automatically configure your repository:

```bash
# One-command setup
./init.sh
```

This script will:
- 🔒 **Create repository rulesets** for branch protection (linear history, PR reviews)
- 🚫 **Disable unnecessary features** (wikis, projects, squash/merge commits)
- ⚙️ **Configure merge settings** (rebase-only workflow at repository and ruleset levels)
- 👤 **Grant admin bypass** permissions for repository administrators
- 🔧 **Verify GitHub Actions** and validate repository configuration
- 🔑 **Check required secrets** and provide setup instructions

### 3. Required Secrets

The script will guide you to set up these secrets if missing:

**NPM_TOKEN** (for publishing):
```bash
# Generate NPM token with OTP for enhanced security
pnpm token create --otp=<YOUR_OTP> --registry=https://registry.npmjs.org/

# Set the token as repository secret
gh secret set NPM_TOKEN --body "your-npm-token-here"
```

**ACTIONS_BRANCH_PROTECTION_BYPASS** (for automated pushes from versioning workflow):
```bash
# Create Personal Access Token with 'repo' permissions
# Visit: https://github.com/settings/personal-access-tokens/new

# Set the PAT as repository secret
gh secret set ACTIONS_BRANCH_PROTECTION_BYPASS --body "your-pat-token-here"
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm lint` | Biome lint across all packages |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm test` | Run Vitest across the workspace |
| `pnpm test:coverage` | Vitest with coverage |
| `pnpm typecheck` | TypeScript `--noEmit` across packages |
| `pnpm build` | Rollup builds for every package |
| `pnpm attw` | Run AreTheTypesWrong for all packages |
| `pnpm release:dry` | Nx Release dry run |
| `pnpm release:version` | Bump versions & changelogs, create tags |
| `pnpm release:publish` | Publish tagged packages to npm |

Per-package targets are also available, e.g. `pnpm nx run core:build`.

## Adding a new package
```bash
pnpm exec nx g @nx/js:lib new-lib \
  --directory=packages/new-lib \
  --publishable --importPath=@good-typescript-libraries/new-lib \
  --bundler=rollup
```

> [!NOTE]
> The `importPath` should be equivalent to your scope name.

Then export from `packages/new-lib/src/index.ts` and add tests under `packages/new-lib/test`.

## Changing the npm scope
The default scope is `@good-typescript-libraries`. To rename it (e.g. to `@my-libraries`), update these places:
1. **nx.json** – set `"npmScope": "my-libraries"`.
2. **tsconfig.base.json** – change the path alias to `"@my-libraries/*": ["packages/*/src/index.ts"]`.
3. **Package names/import paths** – in each `packages/*/package.json` update `"name"` and `importPath` (if present) to the new scope; adjust any imports in code/tests (e.g. `import {...} from '@my-libraries/core'`).
4. **Vitest aliases** – in `vitest.config.ts` update the alias map to the new scope.
5. **Docs & examples** – replace `@my-libraries/` occurrences in README/CONTRIBUTING and commands.
After those edits, run `pnpm install`, then `pnpm lint && pnpm test && pnpm build` to ensure everything resolves correctly.

## Release model (Nx Release)
- Conventional commits determine bumps; packages release **independently**.
- Version workflow (push to `main`) runs `nx release version --yes` to update versions/changelogs and create tags (`{projectName}@{version}`).
- Publish workflow (tag push) runs `nx release publish --projects <name>` with npm provenance.
- Required secret: `NPM_TOKEN`; optional `ACTIONS_BRANCH_PROTECTION_BYPASS` if your repo blocks CI pushes.

## CI/CD (GitHub Actions)
- `CI` (push/PR): lint → typecheck → tests + coverage → build on Node 20 & 22.
- `Release Version` (push to `main`): reruns checks, bumps versions/changelogs, creates tags, pushes back.
- `Release Publish` (tag): rebuilds tagged package(s) and publishes to npm with provenance.

## Renovate

`renovate.json5` already turns onboarding off, so Renovate will start opening update PRs as soon as the GitHub App is installed. Enable it like this:

1. Visit https://github.com/apps/renovate and click **Install**.
2. Choose your personal account or organization, then pick **All repos** or **Only select repos** (include this one).
3. Approve the requested permissions to finish installation. Renovate will run shortly after and open PRs based on `renovate.json5`.

Notes:
- Want to stop it? Uninstall the app or set `"enabled": false` in `renovate.json5`.
- Need custom rules (schedules, groups, automerge)? Extend `renovate.json5` - no extra onboarding PR is required.

## FAQ

#### How do I modify the merging methods?

`good-typescript-libraries-template` sets **rebase-only** at both repository and main branch levels. Here's how to modify this:

##### **Current Setup**
- **Repository**: Rebase merging only (squash/merge disabled)
- **Main branch ruleset**: Requires rebase merging

##### **To Change Merge Methods**

**For repository-wide changes:**
- **Settings > General > Pull Requests** - toggle merge methods

**For branch-specific changes:**
- **Settings > Rules** - edit the main branch ruleset's "Require merge type"

##### **Precedence Rules**
1. Repository settings define what's **available**
2. Rulesets add **restrictions** on top  
3. **Most restrictive wins** - if repository disallows a method but ruleset requires it, merging is **blocked**

##### **Common Modifications**
- **Allow all methods**: Enable squash/merge in repo settings + remove "Require merge type" from ruleset
- **Squash-only**: Change repo settings to squash-only OR keep current repo settings + change ruleset to require squash
- **Different rules per branch**: Create additional rulesets for other branch patterns

> [!TIP]
> Since `good-typescript-libraries-template` is rebase-only, you must enable other methods in repository settings before rulesets can use them.

#### How to solve pnpm lockfile error on my CI/CD?

If you're seeing this error in your CI/CD (GitHub Actions) pipeline:

```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
```

##### **Why This Happens**
This template uses `--frozen-lockfile` to ensure consistent installations in CI/CD. The error occurs when your `package.json` has been modified but the `pnpm-lock.yaml` hasn't been updated to match.

##### **Solution**
Run the following command locally:
```bash
pnpm install
```

Then commit the updated lockfile:
```bash
git add pnpm-lock.yaml
git commit -m "chore: update pnpm lockfile"
```

#### Why Linear History?

Linear history provides several benefits for library releases:

- **Clean commit history** - Easy to track changes and debug issues
- **Simplified releases** - Nx Release and conventional commits work best with linear commits
- **Clear changelog** - Each commit represents a complete change
- **Better debugging** - `git bisect` works more effectively
- **Consistent workflow** - Forces proper PR review process
