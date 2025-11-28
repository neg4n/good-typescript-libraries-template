# Contributing

Thanks for helping improve this monorepo! The project is driven by Nx, so most tasks are run through Nx targets that fan out across `packages/*`.

## Workflow
1. `pnpm install` to set up dev deps and Husky.
2. Create a feature branch off `main`.
3. Use **conventional commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`; add `!` or `BREAKING CHANGE:` for majors). Nx Release uses them for version bumps.
4. Run the suite locally before pushing:
   - `pnpm lint`
   - `pnpm test:coverage`
   - `pnpm typecheck`
   - `pnpm build`
5. Open a PR. CI runs lint/typecheck/tests/build on Node 20 & 22.
6. Rebase onto `main` before merge to keep linear history.
7. Merges to `main` trigger the version workflow; tags trigger publish.

## Nx targets (per package)
- `pnpm nx run core:lint` – Biome for a package
- `pnpm nx run core:test` – Vitest for a package (`-- --project core` works too)
- `pnpm nx run core:typecheck` – `tsc --noEmit`
- `pnpm nx run core:build` – Rollup bundle + d.ts
- `pnpm nx run core:attw` – AreTheTypesWrong pack check
- Changelogs live next to each package and are updated automatically by the `Release Version` workflow.

## Adding packages
1. Scaffold with `pnpm exec nx g @nx/js:lib <name> --directory=packages/<name> --publishable --importPath=@good-typescript-libraries/<name> --bundler=rollup`.
2. Export API from `src/index.ts` and add tests under `test/`.
3. Confirm targets in `packages/<name>/project.json` (lint/test/build/typecheck/attw) mirror `core`.

## CI expectations
- PRs must keep lint/typecheck/tests/build green.
- Coverage reports are published from Vitest JSON summary (`coverage/core/coverage-summary.json`).
- Releases: `Release Version` workflow bumps versions + changelog, pushes tags; `Release Publish` publishes tagged packages to npm with provenance.

## Husky & lint-staged
`pnpm install` installs hooks. Pre-commit runs `lint-staged` on staged files under `packages/**` using Biome in write mode.
