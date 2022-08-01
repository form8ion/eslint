import {EOL} from 'os';
import {promises as fs} from 'fs';
import * as core from '@form8ion/core';

import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';

import liftIgnore from './lifter';

suite('lift ignore', () => {
  let sandbox;
  const projectRoot = any.string();
  const buildDirectory = any.string();
  const directoriesToIgnore = any.listOf(any.string);
  const pathToIgnoreFile = `${projectRoot}/.eslintignore`;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test(
    'that no updates are made to the ignore file if no build directory or directories to ignore are provided',
    async () => {
      const results = await liftIgnore({projectRoot});

      assert.deepEqual(results, {});
      assert.notCalled(core.fileExists);
    }
  );

  test('that the provided build directory is added to the ignore file', async () => {
    core.fileExists.resolves(false);
    const results = await liftIgnore({projectRoot, buildDirectory});

    assert.deepEqual(results, {});
    assert.calledWith(fs.writeFile, pathToIgnoreFile, `/${buildDirectory}/`);
  });

  test('that the existing contents of the ignore file are not lost when adding the build directory', async () => {
    const existingIgnores = any.listOf(any.word);
    core.fileExists.withArgs(pathToIgnoreFile).resolves(true);
    fs.readFile.withArgs(pathToIgnoreFile, 'utf-8').resolves(existingIgnores.join(EOL));

    const results = await liftIgnore({projectRoot, buildDirectory});

    assert.deepEqual(results, {});
    assert.calledWith(fs.writeFile, pathToIgnoreFile, [...existingIgnores, `/${buildDirectory}/`].join(EOL));
  });

  test('that provided directories are ignored', async () => {
    core.fileExists.resolves(false);

    const results = await liftIgnore({projectRoot, ignore: {directories: directoriesToIgnore}});

    assert.deepEqual(results, {});
    assert.calledWith(fs.writeFile, pathToIgnoreFile, directoriesToIgnore.join(EOL));
  });

  test('that provided directories and `buildDirectory` are ignored', async () => {
    core.fileExists.resolves(false);

    const results = await liftIgnore({projectRoot, ignore: {directories: directoriesToIgnore}, buildDirectory});

    assert.deepEqual(results, {});
    assert.calledWith(fs.writeFile, pathToIgnoreFile, [`/${buildDirectory}/`, ...directoriesToIgnore].join(EOL));
  });

  test('that the existing contents the ignore file are not lost when adding ignored directories', async () => {
    const existingIgnores = any.listOf(any.word);
    core.fileExists.withArgs(pathToIgnoreFile).resolves(true);
    fs.readFile.withArgs(pathToIgnoreFile, 'utf-8').resolves(existingIgnores.join(EOL));

    const results = await liftIgnore({projectRoot, ignore: {directories: directoriesToIgnore}});

    assert.deepEqual(results, {});
    assert.calledWith(fs.writeFile, pathToIgnoreFile, [...existingIgnores, ...directoriesToIgnore].join(EOL));
  });

  test('that the provided ignores are not added if already contained in the ignore file', async () => {
    const existingIgnores = any.listOf(any.word);
    core.fileExists.withArgs(pathToIgnoreFile).resolves(true);
    fs.readFile
      .withArgs(pathToIgnoreFile, 'utf-8')
      .resolves([`/${buildDirectory}/`, ...directoriesToIgnore, ...existingIgnores].join(EOL));

    const results = await liftIgnore({projectRoot, buildDirectory, ignore: {directories: directoriesToIgnore}});

    assert.deepEqual(results, {});
    assert.calledWith(
      fs.writeFile,
      pathToIgnoreFile,
      [`/${buildDirectory}/`, ...directoriesToIgnore, ...existingIgnores].join(EOL)
    );
  });
});
