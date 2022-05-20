import * as core from '@form8ion/core';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as configLifter from './config-lifter';
import lift from './lifter';

suite('lifter', () => {
  let sandbox;
  const configs = any.listOf(any.word);
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
    sandbox.stub(configLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the existing config is lifted', async () => {
    const results = any.simpleObject();
    core.fileExists.withArgs(`${projectRoot}/.eslintrc.yml`).resolves(true);
    configLifter.default.withArgs({configs, projectRoot}).resolves(results);

    assert.deepEqual(await lift({configs, projectRoot}), results);
  });

  test('that no changes made when no config exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.eslintrc.yml`).resolves(false);

    assert.deepEqual(await lift({configs, projectRoot}), {});
  });
});
