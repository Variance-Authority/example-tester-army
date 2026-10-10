import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { varianceReporter } from './variance/reporter.ts';
import { skipped } from './variance/select.ts';

// A local model through Ollama's OpenAI-compatible endpoint. Any model that
// calls tools works; E2E_MODEL picks another one you have pulled.
const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434/v1',
});

export default {
  tests: ['tests/**/*.e2e.ts', ...skipped().map((file) => `!${file}`)],
  // `markdown` writes `.e2e/summary.md`; every test keeps a `trace.md` and a
  // video under `.e2e/results/`, so a passing run can be watched afterwards.
  reporters: ['list', 'markdown', varianceReporter()],
  trace: 'on',
  video: 'on',
  // A local model answers slower than a hosted one, and slower again when
  // every worker asks it at once.
  timeout: 300_000,
  agents: {
    default: {
      model: ollama.chatModel(process.env.E2E_MODEL ?? 'qwen3:30b-a3b'),
      system: 'You are a thorough QA agent. Verify every outcome.',
      judgmentTimeout: 120_000,
    },
  },
  targets: [
    {
      engine: web(),
      app: {
        url: 'http://localhost:5173',
        command: { executable: 'npm', args: ['run', 'dev'], reuseExisting: true },
      },
    },
  ],
} satisfies E2EConfig;
