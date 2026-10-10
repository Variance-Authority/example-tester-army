import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('the agent keeps a note', async ({ app, agent, screen }) => {
  await app.open('/notes');

  await agent.act('add a note that says {text}', { params: { text: 'buy milk' } });

  await expect(screen.getByRole('list', 'Notes')).toContainText('buy milk');
  await agent.assert('the notes list shows buy milk');
});

test('the agent removes a note', async ({ app, agent, screen }) => {
  await app.open('/notes');

  await agent.act('add a note that says {text}, then remove it', { params: { text: 'call mum' } });

  await expect(screen.getByText('No notes yet.')).toBeVisible();
  await agent.assert('there are no notes left');
});
