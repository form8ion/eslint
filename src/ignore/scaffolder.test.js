import {promises as fs} from 'node:fs';

import any from '@travi/any';
import {it, describe, expect, vi} from 'vitest';

import scaffold from './scaffolder.js';

vi.mock('node:fs');

describe('ignore file scaffolder', () => {
  const projectRoot = any.string();

  it('should list the provided directories in a new ignore file', async () => {
    const ignoredDirectories = any.listOf(any.string);

    await scaffold({projectRoot, ignore: {directories: ignoredDirectories}});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/.eslintignore`, ignoredDirectories.join('\n'));
  });

  it('should not result in an error when directories are not provided', async () => {
    await scaffold({projectRoot, ignore: {}});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/.eslintignore`, '');
  });

  it('should not result in an error when no ignores are provided', async () => {
    await scaffold({projectRoot});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/.eslintignore`, '');
  });
});
