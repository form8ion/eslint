import {promises as fs} from 'fs';
import yaml from 'js-yaml';
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

    sandbox.stub(fs, 'readFile');
    sandbox.stub(yaml, 'load');
    sandbox.stub(core, 'fileExists');
    sandbox.stub(configLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the existing config is lifted', async () => {
    const results = any.simpleObject();
    const scope = any.word();
    const existingConfig = any.string();
    const pathToConfig = `${projectRoot}/.eslintrc.yml`;
    core.fileExists.withArgs(pathToConfig).resolves(true);
    fs.readFile.withArgs(pathToConfig, 'utf-8').resolves(existingConfig);
    yaml.load.withArgs(existingConfig).returns({extends: scope});
    configLifter.default.withArgs({configs, scope}).resolves(results);

    assert.deepEqual(await lift({configs, projectRoot}), results);
  });

  test('that no changes made when no config exists', async () => {
    const pathToConfig = `${projectRoot}/.eslintrc.yml`;
    core.fileExists.withArgs(pathToConfig).resolves(false);

    assert.deepEqual(await lift({configs, projectRoot}), {});
  });
});
