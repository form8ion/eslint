import {Given, Then} from '@cucumber/cucumber';
import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import {assert} from 'chai';
import {eslintConfigScope, pathToYamlConfig} from './eslint-config-steps';

Given('the existing eslint config file has no existing overrides', async function () {
  this.eslintConfigScope = eslintConfigScope;

  await fs.writeFile(pathToYamlConfig, dump({extends: eslintConfigScope}));
});

Then('no overrides are defined in the config file', async function () {
  const config = load(await fs.readFile(pathToYamlConfig));

  assert.isUndefined(config.overrides);
});
