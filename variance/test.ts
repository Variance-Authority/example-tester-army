// The `test` every spec imports: e2e's web test, with one fixture that takes
// the page's coverage out after each attempt.
import { test as base } from '@e2e-dev/web';
import { EXECUTION_GLOBAL, stageExecution } from '@variance-authority/sense/journal';
import { STAGE } from './stage.ts';

// The attempt e2e is running in this worker. Not exported by e2e: it is the
// slot `expect.poll` reads, and the only place a fixture can learn which
// attempt it belongs to.
const attempt = Symbol.for('e2e.attempt.v1');

export const test = base.extend<{ coverage: void }>({
  coverage: async ({ browser }, use) => {
    await use();
    const attemptId = (globalThis as Record<symbol, { attemptId?: string } | undefined>)[attempt]?.attemptId;
    if (attemptId === undefined) return;
    const journal = await browser.evaluate(
      `(() => { const c = globalThis[${JSON.stringify(EXECUTION_GLOBAL)}]; return c === undefined ? null : c.drain(); })()`,
    );
    if (journal === null) return;
    // Owned by the attempt here; the reporter knows which file that attempt ran.
    await stageExecution(STAGE, { subjects: [{ owner: `attempt:${attemptId}`, journal: journal as never }] });
  },
});
