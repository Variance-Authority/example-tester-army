import { test } from '../variance/test.ts';
import { expect } from 'e2e';

test('counts up by one', async ({ app, screen }) => {
  await app.open('/counter');

  await screen.getByRole('button', 'Add one').click();
  await screen.getByRole('button', 'Add one').click();

  await expect(screen.getByRole('status')).toHaveText('Count: 2');
});

test('resets to zero', async ({ app, screen }) => {
  await app.open('/counter');

  await screen.getByRole('button', 'Add one').click();
  await screen.getByRole('button', 'Reset').click();

  await expect(screen.getByRole('status')).toHaveText('Count: 0');
});
