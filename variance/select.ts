// The spec files `variance select` says this change cannot reach.
//
// e2e loads this config in the main process and again in every worker, so the
// answer is asked once and carried to the workers in the environment they
// inherit. `VARIANCE_AUTHORITY_SINCE=` (empty) runs everything.
import { execFileSync } from 'node:child_process';

const CARRIED = 'VARIANCE_AUTHORITY_E2E_SKIP';

export function skipped(): readonly string[] {
  const carried = process.env[CARRIED];
  if (carried !== undefined) return JSON.parse(carried) as string[];
  const skip =
    process.env.VARIANCE_AUTHORITY_SINCE === ''
      ? []
      : (JSON.parse(
          execFileSync('node_modules/.bin/variance', ['select', '--format', 'json'], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'inherit'],
          }),
        ).skip as string[]);
  process.env[CARRIED] = JSON.stringify(skip);
  return skip;
}
