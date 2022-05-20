import {promises as fsPromises} from 'fs';
import * as core from '@form8ion/core';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import scaffold from './scaffolder';

suite('scaffolder', () => {
  let sandbox;
  const packageName = any.word();
  const scope = `@${any.string()}`;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fsPromises, 'writeFile');
    sandbox.stub(core, 'writeConfigFile');
  });

  teardown(() => sandbox.restore());

  test('that the dependency is installed if the config is defined', async () => {
    const result = await scaffold({scope});

    assert.deepEqual(result.devDependencies, [`${scope}/eslint-config`]);
  });

  test('that the scripts are defined', async () => {
    assert.deepEqual(
      (await scaffold({config: {packageName}})).scripts,
      {
        'lint:js': 'eslint . --cache',
        'lint:js:fix': 'run-s lint:js -- --fix'
      }
    );
  });

  test('that the cache file is ignored from version control', async () => {
    const result = await scaffold({config: {packageName}});

    assert.deepEqual(result.vcsIgnore.files, ['.eslintcache']);
  });

  suite('config', () => {
    const projectRoot = any.string();

    test('that the base config is added to the root of the project if the config scope is provided', async () => {
      await scaffold({projectRoot, scope});

      assert.calledWith(
        core.writeConfigFile,
        {path: projectRoot, name: '.eslintrc', format: core.fileTypes.YAML, config: {root: true, extends: scope}}
      );
    });

    suite('eslint-ignore', () => {
      test('that the provided directories are excluded from linting', async () => {
        const ignoredDirectories = any.listOf(any.string);

        await scaffold({projectRoot, config: {packageName, scope}, ignore: {directories: ignoredDirectories}});

        assert.calledWith(fsPromises.writeFile, `${projectRoot}/.eslintignore`, ignoredDirectories.join('\n'));
      });
    });
  });
});
