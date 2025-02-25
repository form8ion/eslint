import {promises as fs} from 'node:fs';
import {EOL} from 'node:os';

import any from '@travi/any';
import {describe, it, expect, vi} from 'vitest';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import writeIgnoreFile from './writer.js';
import ignoreFileExists from './predicate.js';
import liftIgnore from './lifter.js';

vi.mock('node:fs');
vi.mock('./writer.js');
vi.mock('./predicate.js');

describe('ignore file lifter', () => {
  const projectRoot = any.string();
  const buildDirectory = any.string();
  const directoriesToIgnore = any.listOf(any.string);
  const pathToIgnoreFile = `${projectRoot}/.eslintignore`;

  it(
    'should not make updates to the ignore file if no build directory or directories to ignore are provided',
    async () => {
      const results = await liftIgnore({projectRoot});

      expect(results).toEqual({});
      expect(ignoreFileExists).not.toHaveBeenCalled();
    }
  );

  it('should add the provided build directory to the ignore file', async () => {
    when(ignoreFileExists).calledWith({projectRoot}).thenResolve(false);

    const results = await liftIgnore({projectRoot, buildDirectory});

    expect(results).toEqual({});
    expect(writeIgnoreFile).toHaveBeenCalledWith({projectRoot, ignores: [`/${buildDirectory}/`]});
  });

  it('should not lose the existing contents of the ignore file when adding the build directory', async () => {
    const existingIgnores = any.listOf(any.word);
    when(ignoreFileExists).calledWith({projectRoot}).thenResolve(true);
    when(fs.readFile).calledWith(pathToIgnoreFile, 'utf-8').thenResolve(existingIgnores.join(EOL));

    const results = await liftIgnore({projectRoot, buildDirectory});

    expect(results).toEqual({});
    expect(writeIgnoreFile).toHaveBeenCalledWith({projectRoot, ignores: [...existingIgnores, `/${buildDirectory}/`]});
  });

  it('should ignore provided directories', async () => {
    when(ignoreFileExists).calledWith({projectRoot}).thenResolve(false);

    const results = await liftIgnore({projectRoot, ignore: {directories: directoriesToIgnore}});

    expect(results).toEqual({});
    expect(writeIgnoreFile).toHaveBeenCalledWith({projectRoot, ignores: directoriesToIgnore});
  });

  it('should ignore provided directories and `buildDirectory`', async () => {
    when(ignoreFileExists).calledWith({projectRoot}).thenResolve(false);

    const results = await liftIgnore({projectRoot, ignore: {directories: directoriesToIgnore}, buildDirectory});

    expect(results).toEqual({});
    expect(writeIgnoreFile).toHaveBeenCalledWith({
      projectRoot,
      ignores: [`/${buildDirectory}/`, ...directoriesToIgnore]
    });
  });

  it('should not lose the existing contents when adding ignored directories', async () => {
    const existingIgnores = any.listOf(any.word);
    when(ignoreFileExists).calledWith({projectRoot}).thenResolve(true);
    when(fs.readFile).calledWith(pathToIgnoreFile, 'utf-8').thenResolve(existingIgnores.join(EOL));

    const results = await liftIgnore({projectRoot, ignore: {directories: directoriesToIgnore}});

    expect(results).toEqual({});
    expect(writeIgnoreFile).toHaveBeenCalledWith({projectRoot, ignores: [...existingIgnores, ...directoriesToIgnore]});
  });
});
