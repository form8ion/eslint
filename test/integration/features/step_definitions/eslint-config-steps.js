import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';
import {fileExists} from '@form8ion/core';

export const pathToYamlConfig = `${process.cwd()}/.eslintrc.yml`;
export const eslintConfigScope = `@${any.word()}`;

Given('no existing eslint config file is present', async function () {
  this.eslintConfigScope = eslintConfigScope;
});

Given('an existing eslint config file is present', async function () {
  this.eslintConfigScope = eslintConfigScope;

  await fs.writeFile(pathToYamlConfig, dump({extends: eslintConfigScope}));
});

Given('an existing eslint config file extending multiple configs is present', async function () {
  this.eslintConfigScope = eslintConfigScope;
  this.additionalExistingConfig = `${eslintConfigScope}/${any.word()}`;

  await fs.writeFile(pathToYamlConfig, dump({extends: [eslintConfigScope, this.additionalExistingConfig]}));
});

Given('an empty list of additional shareable configs is provided', async function () {
  this.additionalShareableConfigs = [];
});

Given('additional shareable configs are provided', async function () {
  this.additionalShareableConfigs = any.listOf(any.word);
});

Given('complex additional shareable configs are provided', async function () {
  this.additionalShareableConfigs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));
});

Given('some provided configs duplicate existing configs', async function () {
  const additionalConfigBase = any.word();
  this.eslintConfigScope = eslintConfigScope;
  this.additionalExistingConfig = `${eslintConfigScope}/${additionalConfigBase}`;
  this.additionalShareableConfigs = [additionalConfigBase, ...any.listOf(any.word)];

  await fs.writeFile(pathToYamlConfig, dump({extends: [eslintConfigScope, this.additionalExistingConfig]}));
});

Then('no eslint config file exists', async function () {
  assert.isFalse(await fileExists(pathToYamlConfig));
});

Then('a yaml config file was created', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  assert.deepEqual(config.extends, eslintConfigScope);
});

Then('the yaml eslint config file contains the expected config', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  if (this.additionalExistingConfig) {
    assert.includeMembers(config.extends, [eslintConfigScope, this.additionalExistingConfig]);
  } else if (this.additionalShareableConfigs && 0 !== this.additionalShareableConfigs.length) {
    assert.equal(config.extends[0], eslintConfigScope);
    assert.includeMembers(
      config.extends,
      this.additionalShareableConfigs.map(cfg => {
        if ('string' === typeof cfg) return `${eslintConfigScope}/${cfg}`;

        return `${eslintConfigScope}/${cfg.name}`;
      })
    );
  } else {
    assert.deepEqual(config.extends, eslintConfigScope);
  }
});

Then('dependencies are defined for the additional configs', async function () {
  assert.deepEqual(
    this.result.devDependencies,
    this.additionalShareableConfigs.map(config => {
      if ('string' === typeof config) return `${this.eslintConfigScope}/eslint-config-${config}`;

      return `${this.eslintConfigScope}/eslint-config-${config.name}`;
    })
  );
});

Then('the yaml eslint config file is updated with the provided simple configs', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  assert.includeMembers(
    config.extends,
    this.additionalShareableConfigs.map(configName => `${this.eslintConfigScope}/${configName}`)
  );
});

Then('the yaml eslint config file is updated with the provided complex configs', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  assert.includeMembers(
    config.extends,
    this.additionalShareableConfigs.map(({name}) => `${this.eslintConfigScope}/${name}`)
  );
});

Then('there are no duplicates listed in the extended configs', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  const counts = config.extends.reduce((acc, cfg) => ({...acc, [cfg]: [...acc[cfg] ? acc[cfg] : [], cfg]}), {});
  const countsHigherThanOne = Object.entries(counts).filter(([, list]) => 1 < list.length);

  assert.equal(countsHigherThanOne.length, 0);
});
