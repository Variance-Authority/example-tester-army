import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('the agent counts to the limit', async ({ app, agent, screen }) => {
  await app.open('/counter');

  await agent.act('add one until the counter stops going up');

  await expect(screen.getByRole('status')).toHaveText('Reached 5.');
  await agent.assert('the counter says it reached 5');
});
