import {promises as fs} from 'fs';
import yaml from 'js-yaml';
import * as core from '@form8ion/core';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import liftEslint from './config-lifter';
import * as scopeExtractor from './scope-extractor';

suite('config lifter', () => {
  let sandbox;
  const scope = any.word();
  const pathToConfig = any.string();
  const existingYaml = any.string();
  const existingConfigWithSingleExistingConfig = {...any.simpleObject(), extends: any.word()};
  const existingConfigWithMultipleExistingConfigs = {...any.simpleObject(), extends: any.listOf(any.word)};

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(yaml, 'load');
    sandbox.stub(core, 'fileExists');
    sandbox.stub(scopeExtractor, 'default');
  });

  teardown(() => sandbox.restore());

  test('that no additional extension is applied when no additional configs are provided', async () => {
    assert.deepEqual(await liftEslint({pathToConfig}), {});
    assert.notCalled(fs.readFile);
    assert.notCalled(fs.writeFile);
    assert.notCalled(yaml.load);
    assert.notCalled(scopeExtractor.default);
  });

  test('that no additional extension is applied when an empty list of additional configs is provided', async () => {
    assert.deepEqual(await liftEslint({configs: [], pathToConfig}), {});
    assert.notCalled(fs.readFile);
    assert.notCalled(fs.writeFile);
    assert.notCalled(yaml.load);
    assert.notCalled(scopeExtractor.default);
  });

  test('that a single exiting config is extended by additional simple configs & dependencies are listed', async () => {
    const configs = any.listOf(any.word);
    fs.readFile.withArgs(pathToConfig, 'utf-8').resolves(existingYaml);
    yaml.load.withArgs(existingYaml).returns(existingConfigWithSingleExistingConfig);
    scopeExtractor.default.withArgs(existingConfigWithSingleExistingConfig).returns(scope);

    const {devDependencies} = await liftEslint({configs, pathToConfig});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config}`));
    assert.calledWith(
      fs.writeFile,
      pathToConfig,
      yaml.dump({
        ...existingConfigWithSingleExistingConfig,
        extends: [existingConfigWithSingleExistingConfig.extends, ...configs.map(config => `${scope}/${config}`)]
      })
    );
  });

  test('that multiple existing configs are extended by simple configs & dependencies are listed', async () => {
    const configs = any.listOf(any.word);
    fs.readFile.withArgs(pathToConfig, 'utf-8').resolves(existingYaml);
    yaml.load.withArgs(existingYaml).returns(existingConfigWithMultipleExistingConfigs);
    scopeExtractor.default.withArgs(existingConfigWithMultipleExistingConfigs).returns(scope);

    const {devDependencies} = await liftEslint({configs, pathToConfig});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config}`));
    assert.calledWith(
      fs.writeFile,
      pathToConfig,
      yaml.dump({
        ...existingConfigWithMultipleExistingConfigs,
        extends: [...existingConfigWithMultipleExistingConfigs.extends, ...configs.map(config => `${scope}/${config}`)]
      })
    );
  });

  test('that multiple existing configs are extended by complex configs & dependencies are listed', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));
    fs.readFile.withArgs(pathToConfig, 'utf-8').resolves(existingYaml);
    yaml.load.withArgs(existingYaml).returns(existingConfigWithMultipleExistingConfigs);
    scopeExtractor.default.withArgs(existingConfigWithMultipleExistingConfigs).returns(scope);

    const {devDependencies} = await liftEslint({configs, pathToConfig});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config.name}`));
    assert.calledWith(
      fs.writeFile,
      pathToConfig,
      yaml.dump({
        ...existingConfigWithMultipleExistingConfigs,
        extends: [
          ...existingConfigWithMultipleExistingConfigs.extends,
          ...configs.map(config => `${scope}/${config.name}`)
        ]
      })
    );
  });
});
