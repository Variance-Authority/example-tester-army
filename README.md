# Tester Army e2e with coverage-based test selection

This is [tester-army/e2e](https://github.com/tester-army/e2e)'s `with-vite`
example, run on a local model through Ollama and narrowed by Variance
Authority. Each run records which lines of the app every spec file entered.
The next run executes only the spec files whose recorded lines changed.

An edit to the counter's click handler, on a cold agent cache:

| | Spec files | Tests | Model calls | Tokens | Wall time |
| --- | ---: | ---: | ---: | ---: | ---: |
| Whole suite | 6 | 12 | 17 | 62.6k | 5m 16s |
| Selected | 2 | 3 | 3 | 10.1k | 44s |

The selected run kept `counter.e2e.ts` and `counter.agent.e2e.ts`. An edit to
the notes' `remove` handler keeps only `notes.agent.e2e.ts`, since no
deterministic test removes a note. A comment-only edit skips everything,
because the code the browser runs is unchanged.

## Run it

```bash
ollama pull qwen3:30b-a3b
npm install
npm run test:e2e
```

The first run records. Edit something under `src/features/` and run again.
`E2E_MODEL` picks another Ollama model, and `VARIANCE_AUTHORITY_SINCE=` (empty)
runs the whole suite.

## How it is wired

- `vite.config.ts` adds `testSelectionProbes()`, so the dev server serves
  instrumented source.
- `variance/test.ts` extends e2e's `test` with a fixture that drains the
  page's coverage after each attempt, under that attempt's id.
- `variance/reporter.ts` maps each attempt to its spec file from the run's
  report and records one entry per file. A file with a failed test is recorded
  incomplete, and an incomplete file always runs.
- `variance/select.ts` asks `variance select` once, in the main process. The
  config turns each skipped file into a `!` exclude in `tests`.

`e2e.config.ts`, `vite.config.ts` and `variance/test.ts` are preconditions of
every spec file, so an edit to one of them runs the whole suite.

`variance/test.ts` reads the running attempt from e2e's internal
`Symbol.for('e2e.attempt.v1')`, the only place a fixture can learn which test it
belongs to. That is why `e2e` and `@e2e-dev/web` are pinned exactly.

## License

Apache-2.0, as the e2e example it starts from. See `NOTICE`.
