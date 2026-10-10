import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('starts with no notes', async ({ app, screen }) => {
  await app.open('/notes');

  await expect(screen.getByText('No notes yet.')).toBeVisible();
});

test('adds a note', async ({ app, screen }) => {
  await app.open('/notes');

  await screen.getByLabel('Note').fill('water plants');
  await screen.getByRole('button', 'Add note').click();

  await expect(screen.getByRole('list', 'Notes')).toContainText('water plants');
});
