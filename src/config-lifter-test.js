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
  const existingConfig = {...any.simpleObject(), extends: any.listOf(any.word)};

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(yaml, 'load');
    sandbox.stub(core, 'fileExists');
    sandbox.stub(scopeExtractor, 'default');
  });

  teardown(() => sandbox.restore());

  test('that dependencies are listed for requested simple configs', async () => {
    const configs = any.listOf(any.word);
    fs.readFile.withArgs(pathToConfig, 'utf-8').resolves(existingYaml);
    yaml.load.withArgs(existingYaml).returns(existingConfig);
    scopeExtractor.default.withArgs(existingConfig).returns(scope);

    const {devDependencies} = await liftEslint({configs, pathToConfig});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config}`));
    assert.calledWith(
      fs.writeFile,
      pathToConfig,
      yaml.dump({
        ...existingConfig,
        extends: [...existingConfig.extends, ...configs.map(config => `${scope}/${config}`)]
      })
    );
  });

  test('that dependencies are listed for requested complex configs', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));
    fs.readFile.withArgs(pathToConfig, 'utf-8').resolves(existingYaml);
    yaml.load.withArgs(existingYaml).returns(existingConfig);
    scopeExtractor.default.withArgs(existingConfig).returns(scope);

    const {devDependencies} = await liftEslint({configs, pathToConfig});

    assert.deepEqual(devDependencies, configs.map(config => `${scope}/eslint-config-${config.name}`));
    assert.calledWith(
      fs.writeFile,
      pathToConfig,
      yaml.dump({
        ...existingConfig,
        extends: [...existingConfig.extends, ...configs.map(config => `${scope}/${config.name}`)]
      })
    );
  });
});
