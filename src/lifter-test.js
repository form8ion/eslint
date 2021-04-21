import lift from './lifter';

suite('lifter', () => {
  test('that the existing config is lifted', async () => {
    await lift();
  });
});
