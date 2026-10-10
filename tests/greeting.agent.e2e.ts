import { test } from '../variance/test.ts';
import { expect } from 'e2e';

test('the agent gets a greeting', async ({ app, agent, screen }) => {
  await app.open('/');

  // The agent works out which field and button to use.
  await agent.act('get the app to greet {name}', { params: { name: 'Grace' } });

  // Pair each agent step with a check that does not depend on the model.
  await expect(screen.getByRole('status')).toHaveText('Hello, Grace!');
  await agent.assert('the app greets Grace by name');
});

test('the agent finds the empty-name error', async ({ app, agent, screen }) => {
  await app.open('/');

  await agent.act('press Greet without typing a name');

  await expect(screen.getByRole('alert')).toHaveText('Enter a name first.');
  await agent.assert('the app asks for a name');
});
