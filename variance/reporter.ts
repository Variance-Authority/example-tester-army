// Records each run's coverage, keyed by spec file, for `variance select`.
import { rmSync } from 'node:fs';
import type { Reporter } from 'e2e';
import {
  closeStage,
  foldStage,
  joinObservations,
  preconditionOf,
  recordExecution,
  type ObservedCase,
  type ObservedSubject,
} from '@variance-authority/sense/journal';
import { STAGE } from './stage.ts';

export function varianceReporter(): Reporter {
  return {
    name: 'variance',
    onEvent(event) {
      // The main process starts the run; workers never call a reporter.
      if (event.type === 'run-started') rmSync(STAGE, { recursive: true, force: true });
    },
    async onRunFinished({ report, projectRoot }) {
      // Which test each attempt ran, and whether every test in its file passed.
      const resultOf = new Map<string, (typeof report.run.results)[number]>();
      const durationOf = new Map<string, number>();
      const passed = new Map<string, boolean>();
      for (const result of report.run.results) {
        if (result.attempts.length === 0) continue;
        passed.set(result.file, (passed.get(result.file) ?? true) && result.status === 'passed');
        for (const attempt of result.attempts) {
          resultOf.set(attempt.id, result);
          durationOf.set(attempt.id, attempt.durationMs);
        }
      }

      const staged = await foldStage(STAGE);
      const owned: ObservedSubject[] = [];
      // Each test too, so `variance covering` can say which test entered a line.
      const cases: ObservedCase[] = [];
      for (const subject of staged.subjects) {
        const attemptId = subject.owner.slice('attempt:'.length);
        const result = resultOf.get(attemptId);
        if (result === undefined) continue;
        const file = result.file;
        cases.push({
          file,
          name: result.titlePath.join(' > '),
          id: attemptId,
          stopped: result.status !== 'passed',
          duration: durationOf.get(attemptId),
          journal: subject.journal,
        });
        const spec = await preconditionOf(projectRoot, file);
        owned.push({
          owner: file,
          journal: subject.journal,
          complete: passed.get(file) === true,
          preconditions: spec === undefined ? [] : [spec],
        });
      }

      const record = await recordExecution({
        root: projectRoot,
        subjects: joinObservations([owned]),
        preconditions: ['e2e.config.ts', 'variance/test.ts', 'vite.config.ts'],
        cases,
      });
      await closeStage(STAGE);
      return [
        {
          label: 'variance',
          text: record.recorded ? `recorded ${record.subjects} spec files, ${record.cases ?? 0} tests` : `nothing recorded: ${record.because}`,
        },
      ];
    },
  };
}
