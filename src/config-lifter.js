import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import {info} from '@travi/cli-messages';
import extractScopeFrom from './scope-extractor';

function normalizeConfigBasename(config) {
  if ('string' === typeof config) return config;

  return config.name;
}

function getConfigToPackageNameMapper(scope) {
  return configName => `${scope}/eslint-config-${configName}`;
}

function normalizeExistingExtensions(existingExtensions) {
  if ('string' === typeof existingExtensions) return [existingExtensions];

  return existingExtensions;
}

function noAdditionalConfigsWereProvided(configs) {
  return !configs || 0 === configs.length;
}

export default async function ({configs, pathToConfig}) {
  info('Configuring ESLint', {level: 'secondary'});

  if (noAdditionalConfigsWereProvided(configs)) {
    info('No additional ESLint configs provided', {level: 'secondary'});

    return {};
  }

  const normalizedConfigBasenames = configs.map(normalizeConfigBasename);
  const overrides = configs
    .filter(config => 'string' !== typeof config && config.files)
    .map(({name, files}) => ({extends: name, files}));
  const existingConfig = load(await fs.readFile(pathToConfig, 'utf-8'));
  const scope = extractScopeFrom(existingConfig);

  await fs.writeFile(
    pathToConfig,
    dump({
      ...existingConfig,
      extends: [
        ...normalizeExistingExtensions(existingConfig.extends),
        ...normalizedConfigBasenames.map(config => `${scope}/${config}`)
      ],
      ...overrides.length && {overrides}
    })
  );

  const mapConfigNameToPackageName = getConfigToPackageNameMapper(scope);

  return {devDependencies: normalizedConfigBasenames.map(mapConfigNameToPackageName)};
}
