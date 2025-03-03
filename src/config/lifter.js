import {promises as fs} from 'fs';
import {load} from 'js-yaml';
import {info} from '@travi/cli-messages';

import write from './writer.js';
import extractScopeFrom from '../scope-extractor.js';

function normalizeConfigBasename(config) {
  if ('string' === typeof config) return config;

  return config.name;
}

function getConfigToPackageNameMapper(scope) {
  return configName => `${scope}/eslint-config-${configName}`;
}

function getConfigBasenameToConfigShortNameMapper(scope) {
  return configName => `${scope}/${configName}`;
}

function normalizeExistingExtensions(existingExtensions) {
  if ('string' === typeof existingExtensions) return [existingExtensions];

  return existingExtensions;
}

function noAdditionalConfigsWereProvided(configs) {
  return !configs || 0 === configs.length;
}

export default async function ({configs, projectRoot}) {
  info('Lifting ESLint config', {level: 'secondary'});

  const pathToConfig = `${projectRoot}/.eslintrc.yml`;

  if (noAdditionalConfigsWereProvided(configs)) {
    info('No additional ESLint configs provided', {level: 'secondary'});

    return {};
  }

  const existingConfig = load(await fs.readFile(pathToConfig, 'utf-8'));
  const scope = extractScopeFrom(existingConfig);
  const mapConfigNameToPackageName = getConfigToPackageNameMapper(scope);
  const mapConfigBasenameToConfigShortName = getConfigBasenameToConfigShortNameMapper(scope);
  const normalizedConfigBasenames = configs.map(normalizeConfigBasename);
  const normalizedNonOverrideConfigBasenames = configs
    .filter(config => 'string' === typeof config || !config.files)
    .map(normalizeConfigBasename);
  const overrides = [
    ...existingConfig.overrides ? existingConfig.overrides : [],
    ...configs
      .filter(config => 'object' === typeof config && config.files)
      .map(({name, files}) => ({extends: mapConfigBasenameToConfigShortName(name), files}))
  ];

  await write(
    {
      path: projectRoot,
      config: {
        ...existingConfig,
        extends: normalizedNonOverrideConfigBasenames.length
          ? [...new Set([
            ...normalizeExistingExtensions(existingConfig.extends),
            ...normalizedNonOverrideConfigBasenames.map(mapConfigBasenameToConfigShortName)
          ])]
          : existingConfig.extends,
        ...overrides.length && {overrides}
      }
    }
  );

  return {dependencies: {javascript: {development: normalizedConfigBasenames.map(mapConfigNameToPackageName)}}};
}
