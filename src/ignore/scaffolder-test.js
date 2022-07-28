import {promises as fs} from 'fs';

import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';

import scaffold from './scaffolder';

suite('ignore file scaffolder', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that the provided directories are listed in a new ignore file', async () => {
    const ignoredDirectories = any.listOf(any.string);

    await scaffold({projectRoot, ignore: {directories: ignoredDirectories}});

    assert.calledWith(fs.writeFile, `${projectRoot}/.eslintignore`, ignoredDirectories.join('\n'));
  });

  test('that directories not being provided as ignores does not result in an error', async () => {
    await scaffold({projectRoot, ignore: {}});

    assert.calledWith(fs.writeFile, `${projectRoot}/.eslintignore`, '');
  });

  test('that ignores not being provided does not result in an error', async () => {
    await scaffold({projectRoot});

    assert.calledWith(fs.writeFile, `${projectRoot}/.eslintignore`, '');
  });
});
