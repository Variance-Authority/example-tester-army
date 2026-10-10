// Records each run's coverage, keyed by spec file, for `variance select`.
import { rmSync } from 'node:fs';
import type { Reporter } from 'e2e';
import {
  closeStage,
  foldStage,
  joinObservations,
  preconditionOf,
  recordExecution,
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
      // Which file each attempt ran, and whether every test in that file passed.
      const fileOf = new Map<string, string>();
      const passed = new Map<string, boolean>();
      for (const result of report.run.results) {
        if (result.attempts.length === 0) continue;
        passed.set(result.file, (passed.get(result.file) ?? true) && result.status === 'passed');
        for (const attempt of result.attempts) fileOf.set(attempt.id, result.file);
      }

      const staged = await foldStage(STAGE);
      const owned: ObservedSubject[] = [];
      for (const subject of staged.subjects) {
        const file = fileOf.get(subject.owner.slice('attempt:'.length));
        if (file === undefined) continue;
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
      });
      await closeStage(STAGE);
      return [
        {
          label: 'variance',
          text: record.recorded ? `recorded ${record.subjects} spec files` : `nothing recorded: ${record.because}`,
        },
      ];
    },
  };
}
