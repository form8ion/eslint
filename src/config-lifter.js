import {info} from '@travi/cli-messages';

function getConfigToPackageNameMapper(scope) {
  return config => {
    if ('string' === typeof config) return `${scope}/eslint-config-${config}`;

    return `${scope}/eslint-config-${config.name}`;
  };
}

export default function ({configs, scope}) {
  info('Configuring ESLint', {level: 'secondary'});

  const mapConfigNameToPackageName = getConfigToPackageNameMapper(scope);

  return {
    ...configs && {
      devDependencies: configs.map(mapConfigNameToPackageName),
      nextSteps: [{summary: `extend the following additional ESLint configs: ${configs.join(', ')}`}]
    }
  };
}
