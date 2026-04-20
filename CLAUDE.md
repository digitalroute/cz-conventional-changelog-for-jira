# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A [commitizen](https://github.com/commitizen/cz-cli) adapter published as `@digitalroute/cz-conventional-changelog-for-jira`. Consumers install it and point `config.commitizen.path` at the compiled output (`dist/index.js`); when they run `git cz`, commitizen loads this adapter and calls its `prompter` function. The prompter asks for conventional-commit fields + a JIRA issue, formats the commit message, and hands it back to commitizen.

**Written in TypeScript 6, compiled to CommonJS.** Sources live in `src/`, compiled output in `dist/`. Only `dist/` ships to npm.

## Commands

- `npm run compile` — runs `tsc`, emits `dist/*.js` + `dist/*.d.ts`
- `npm test` — runs `mocha --require tsx/cjs 'src/**/*.test.ts'` (no compile step for tests; `tsx` loads `.ts` on the fly)
- `npm test -- --grep "<pattern>"` — run a single test or a subset by name
- `npm run format` — runs `prettier --write "src/**/*.ts"`
- `npm run commit` — dogfoods this adapter via `git-cz` (needs `npm run compile` first because `config.commitizen.path` points at `dist/`)
- `npx publint` — lints the published package metadata

## Architecture

Four layers, top-down (all in `src/`):

1. **`index.ts`** is the commitizen entry point. It calls `commitizen.configLoader.load()` to read config from the consumer's `package.json`, layers `CZ_*` env vars on top via `getEnvOrConfig()`, then optionally augments `maxHeaderWidth` from `@commitlint/load` (inside a swallowing try/catch — missing commitlint is not an error; the call uses `.default` because the package is ESM-only). The resolved options are passed to `engine()` and exported via `export =`.

2. **`engine.ts`** builds and returns a `{ prompter }` object. The `prompter(cz, commit, testMode)` function:
   - Receives `cz` from commitizen — this IS commitizen's inquirer v8 instance, typed as `typeof import('inquirer')`.
   - Registers the custom `LimitedInputPrompt` via `cz.registerPrompt('limitedInput', ...)`.
   - Calls `cz.prompt([...questions])`, formats the answers, displays a boxen preview, and asks for confirmation before calling `commit(fullCommit)`.
   - When `testMode === true`, skips the boxen preview and confirmation and calls `commit` directly. Every test uses this path.
   - Auto-detects a JIRA issue from the current git branch name via `execSync('git branch --show-current')` + regex. Runs at module load time of each prompter invocation.
   - Uses CJS-ish syntax (`export =`) to keep `module.exports = engine(options)` compatibility for commitizen.

3. **`LimitedInputPrompt.ts`** extends `inquirer/lib/prompts/input` — an **internal** inquirer v8 path (typed by `@types/inquirer` v8). Implements a live character counter for the subject line. See the JSDoc at the top for why inquirer is pinned at v8.

4. **`configurable.ts`** is an alternative entry point for consumers who want to override defaults from their own JS file. See README "Dynamic Configuration".

`defaults.ts`, `types.ts`, and `options.ts` are pure data / type declarations. The public `Options`, `Answers`, and `JiraLocation` types live in `options.ts`.

## Hand-rolled type declarations

Two external surfaces lack upstream types:

- **`src/types/commitizen.d.ts`** — `@types/commitizen` doesn't exist. We declare the minimal `configLoader.load()` interface. The `cz` parameter uses `typeof import('inquirer')` since commitizen v4 passes its inquirer instance.
- **`@types/inquirer` v8 covers `inquirer/lib/prompts/input`** — no additional declaration needed.

## Constraints worth knowing before making changes

- **Pure CommonJS output**. `package.json` declares `"type": "commonjs"` and `tsconfig.json` uses `module: nodenext`, `target: esnext`, `isolatedModules: true`, `strict: true`. Node >= 22 minimum.

- **ESM-only runtime deps** (chalk v5, boxen v8, `@commitlint/load` v20) are consumed via Node 22's `require(esm)`. In TS we write `import chalk from 'chalk'`; the compiled CJS emits a `require('chalk')` call, and for default-export ESM packages we read `.default` explicitly at the call site (see `src/index.ts` for `@commitlint/load`).

- **Inquirer is pinned at v8** and must stay there. Two blockers: (a) `LimitedInputPrompt.ts` extends an internal v8 class that was removed in v9+; (b) commitizen v4 depends on inquirer v8 and passes its instance as `cz`. No commitizen v5 exists.

- **The `cz` parameter is commitizen's inquirer, not ours.** `cz.registerPrompt()` and `cz.prompt()` are v8 APIs and come from commitizen, not from any local import.

- **JIRA location/decorators** (`pre-type`, `pre-description`, `post-description`, `post-body`, `jiraPrepend`, `jiraAppend`) are handled by `getJiraIssueLocation()` and `decorateJiraIssue()` in `engine.ts`. The `post-body` case is special: the JIRA gets appended after the body in the outer `.then(async answers => ...)` callback, not inside `getJiraIssueLocation`.

## Test style

`src/engine.test.ts` is the single test file. Tests don't invoke the real inquirer — instead they call a local helper `commitMessage(answers, options)` that constructs a mock `cz` and drives the prompter with `testMode=true`, capturing the output string that `commit(...)` would receive. The interactive flow (boxen preview, `doCommit` confirmation, `LimitedInputPrompt` behaviour) is **never** exercised by tests.

`mock-require` is used to mock `@commitlint/load`, `cosmiconfig`, `commitizen`, `./engine`, and `./index` for the `commitlint config header-max-length` block. `afterEach` clears `require.cache` entries and calls `mock.stopAll()`. The commitlint tests exploit the fact that calling `(require('@commitlint/load'))()` as if it were callable (it isn't in v20) throws, triggering the catch block where `options` is already populated by the `./engine` mock.

Tests run via `tsx/cjs` which transpiles TS at require time — no separate compile step for testing.

## CI / release

`.github/workflows/release.yml` runs on pushes to `master` and `beta`. It installs with `npm ci`, runs `npm run compile`, then `npm test`, then `npx semantic-release`. There is no separate PR/CI workflow — the test suite only runs on the release path. Semantic-release configuration lives entirely in defaults (no `.releaserc` or `release` key in `package.json`). `prepublishOnly` runs the compile again as a safety net.

## Environment variable convention

All runtime overrides follow the `CZ_*` prefix pattern. `getEnvOrConfig(env, configVar, defaultValue)` in `index.ts` resolves precedence: env var > package.json config > default. For booleans, env values are strings and parsed as `env === 'true'`.
