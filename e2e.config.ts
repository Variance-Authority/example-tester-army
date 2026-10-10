import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { varianceReporter } from './variance/reporter.ts';

// A local model through Ollama's OpenAI-compatible endpoint. Any model that
// calls tools works; E2E_MODEL picks another one you have pulled.
const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434/v1',
});

export default {
  reporters: ['list', varianceReporter()],
  agents: {
    default: {
      model: ollama.chatModel(process.env.E2E_MODEL ?? 'qwen3:30b-a3b'),
      system: 'You are a thorough QA agent. Verify every outcome.',
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
