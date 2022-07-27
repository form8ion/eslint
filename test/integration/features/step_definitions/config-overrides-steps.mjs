import {Given, Then} from '@cucumber/cucumber';
import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import {assert} from 'chai';
import any from '@travi/any';
import {eslintConfigScope, pathToYamlConfig} from './eslint-config-steps.mjs';

Given('the existing eslint config file has no existing overrides', async function () {
  this.eslintConfigScope = eslintConfigScope;

  await fs.writeFile(pathToYamlConfig, dump({extends: eslintConfigScope}));
});

Given('additional shareable configs, specifying file paths, are provided', async function () {
  this.additionalShareableConfigs = any.listOf(() => ({...any.simpleObject(), name: any.word(), files: any.string()}));
});

Given('the existing eslint config file contains existing overrides', async function () {
  this.eslintConfigScope = eslintConfigScope;
  this.existingOverrides = any.listOf(() => ({extends: any.word(), files: any.string()}));

  await fs.writeFile(pathToYamlConfig, dump({extends: eslintConfigScope, overrides: this.existingOverrides}));
});

Then('no overrides are defined in the config file', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  assert.isUndefined(config.overrides);
});

Then('the expected overrides are defined in the config file', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));
  const additionalOverrides = this.additionalShareableConfigs
    ? this.additionalShareableConfigs
      .filter(cfg => cfg.files)
      .map(cfg => ({extends: `${eslintConfigScope}/${cfg.name}`, files: cfg.files}))
    : [];

  assert.deepEqual(
    config.overrides,
    [
      ...this.existingOverrides ? this.existingOverrides : [],
      ...additionalOverrides
    ]
  );
});

Then('the existing extensions are preserved', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  assert.equal(config.extends, eslintConfigScope);
});
