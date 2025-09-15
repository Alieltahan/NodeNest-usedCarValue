import { existsSync, unlinkSync } from 'fs';

beforeAll(() => {
  if (existsSync('test.db.sqlite')) {
    unlinkSync('test.db.sqlite');
  }
});
