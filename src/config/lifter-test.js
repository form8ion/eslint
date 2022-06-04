import {promises as fs} from 'fs';
import yaml from 'js-yaml';
import * as core from '@form8ion/core';

import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';

import * as scopeExtractor from '../scope-extractor';
import * as configWriter from './writer';
import liftEslint from './lifter';

suite('config lifter', () => {
  let sandbox;
  const scope = any.word();
  const projectRoot = any.string();
  const existingYaml = any.string();
  const duplicateConfig = any.word();
  const existingConfigWithSingleExistingConfig = {...any.simpleObject(), extends: any.word()};
  const existingConfigWithMultipleExistingConfigs = {
    ...any.simpleObject(),
    extends: [...any.listOf(any.word), `${scope}/${duplicateConfig}`]
  };
  const existingConfigWithOverrides = {
    ...any.simpleObject(),
    extends: any.listOf(any.word),
    overrides: any.listOf(() => ({extends: any.word(), files: any.string()}))
  };

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(yaml, 'load');
    sandbox.stub(core, 'fileExists');
    sandbox.stub(configWriter, 'default');
    sandbox.stub(scopeExtractor, 'default');

    fs.readFile.withArgs(`${projectRoot}/.eslintrc.yml`, 'utf-8').resolves(existingYaml);
  });

  teardown(() => sandbox.restore());

  test('that no additional extension is applied when no additional configs are provided', async () => {
    assert.deepEqual(await liftEslint({projectRoot}), {});
    assert.notCalled(fs.readFile);
    assert.notCalled(configWriter.default);
    assert.notCalled(yaml.load);
    assert.notCalled(scopeExtractor.default);
  });

  test('that no additional extension is applied when an empty list of additional configs is provided', async () => {
    assert.deepEqual(await liftEslint({configs: [], projectRoot}), {});
    assert.notCalled(fs.readFile);
    assert.notCalled(configWriter.default);
    assert.notCalled(yaml.load);
    assert.notCalled(scopeExtractor.default);
  });

  test('that a single exiting config is extended by additional simple configs & dependencies are listed', async () => {
    const configs = any.listOf(any.word);
    yaml.load.withArgs(existingYaml).returns(existingConfigWithSingleExistingConfig);
    scopeExtractor.default.withArgs(existingConfigWithSingleExistingConfig).returns(scope);

    const {devDependencies} = await liftEslint({configs, projectRoot});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config}`));
    assert.calledWith(
      configWriter.default,
      {
        path: projectRoot,
        config: {
          ...existingConfigWithSingleExistingConfig,
          extends: [existingConfigWithSingleExistingConfig.extends, ...configs.map(config => `${scope}/${config}`)]
        }
      }
    );
  });

  test('that multiple existing configs are extended by simple configs & dependencies are listed', async () => {
    const configsWithoutDuplicate = any.listOf(any.word);
    const configs = [...configsWithoutDuplicate, duplicateConfig];
    yaml.load.withArgs(existingYaml).returns(existingConfigWithMultipleExistingConfigs);
    scopeExtractor.default.withArgs(existingConfigWithMultipleExistingConfigs).returns(scope);

    const {devDependencies} = await liftEslint({configs, projectRoot});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config}`));
    assert.calledWith(
      configWriter.default,
      {
        path: projectRoot,
        config: {
          ...existingConfigWithMultipleExistingConfigs,
          extends: [
            ...existingConfigWithMultipleExistingConfigs.extends,
            ...configsWithoutDuplicate.map(config => `${scope}/${config}`)
          ]
        }
      }
    );
  });

  test('that multiple existing configs are extended by complex configs & dependencies are listed', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));
    yaml.load.withArgs(existingYaml).returns(existingConfigWithMultipleExistingConfigs);
    scopeExtractor.default.withArgs(existingConfigWithMultipleExistingConfigs).returns(scope);

    const {devDependencies} = await liftEslint({configs, projectRoot});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config.name}`));
    assert.calledWith(
      configWriter.default,
      {
        path: projectRoot,
        config: {
          ...existingConfigWithMultipleExistingConfigs,
          extends: [
            ...existingConfigWithMultipleExistingConfigs.extends,
            ...configs.map(config => `${scope}/${config.name}`)
          ]
        }
      }
    );
  });

  test('that `overrides` are added to the config when configs with file patterns defined are provided', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word(), files: any.string()}));
    yaml.load.withArgs(existingYaml).returns(existingConfigWithSingleExistingConfig);
    scopeExtractor.default.withArgs(existingConfigWithSingleExistingConfig).returns(scope);

    const {devDependencies} = await liftEslint({configs, projectRoot});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config.name}`));
    assert.calledWith(
      configWriter.default,
      {
        path: projectRoot,
        config: {
          ...existingConfigWithSingleExistingConfig,
          extends: existingConfigWithSingleExistingConfig.extends,
          overrides: configs.map(config => ({extends: `${scope}/${config.name}`, files: config.files}))
        }
      }
    );
  });

  test('that `overrides` are added to the existing overrides in the config', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word(), files: any.string()}));
    yaml.load.withArgs(existingYaml).returns(existingConfigWithOverrides);
    scopeExtractor.default.withArgs(existingConfigWithOverrides).returns(scope);

    const {devDependencies} = await liftEslint({configs, projectRoot});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config.name}`));
    assert.calledWith(
      configWriter.default,
      {
        path: projectRoot,
        config: {
          ...existingConfigWithOverrides,
          extends: existingConfigWithOverrides.extends,
          overrides: [
            ...existingConfigWithOverrides.overrides,
            ...configs.map(config => ({extends: `${scope}/${config.name}`, files: config.files}))
          ]
        }
      }
    );
  });
});
