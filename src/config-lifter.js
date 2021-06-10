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

export default async function ({configs, pathToConfig}) {
  info('Configuring ESLint', {level: 'secondary'});

  if (!configs) {
    info('No additional ESLint configs provided', {level: 'secondary'});

    return {};
  }

  const normalizedConfigBasenames = configs.map(normalizeConfigBasename);
  const existingConfig = load(await fs.readFile(pathToConfig, 'utf-8'));
  const scope = extractScopeFrom(existingConfig);

  await fs.writeFile(
    pathToConfig,
    dump({
      ...existingConfig,
      extends: [...existingConfig.extends, ...normalizedConfigBasenames.map(config => `${scope}/${config}`)]
    })
  );

  const mapConfigNameToPackageName = getConfigToPackageNameMapper(scope);

  return {
    devDependencies: normalizedConfigBasenames.map(mapConfigNameToPackageName),
    nextSteps: [{summary: `extend the following additional ESLint configs: ${configs.join(', ')}`}]
  };
}
