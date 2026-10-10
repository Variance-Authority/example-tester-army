import { join } from 'node:path';

// One fixed directory, because e2e has no hook that runs before workers fork.
export const STAGE = join(process.cwd(), '.e2e', 'variance-stage');
