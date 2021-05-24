import {promises as fsPromises} from 'fs';

function buildConfig(scope, additionalConfigs) {
  const stringConfigs = additionalConfigs && additionalConfigs
    .filter(additionalConfig => 'string' === typeof additionalConfig);
  const complexConfigs = additionalConfigs && additionalConfigs
    .filter(additionalConfig => 'object' === typeof additionalConfig);

  const baseConfigs = stringConfigs && stringConfigs.length
    ? `root: true\nextends:\n  - '${scope}'\n  - '${scope}/${stringConfigs.join(`'\n  - '${scope}/`)}'`
    : `root: true\nextends: '${scope}'`;

  return complexConfigs && complexConfigs.length
    ? `${baseConfigs}

overrides:${complexConfigs.map(complexConfig => `
  - files: ${complexConfig.files}
    extends: '${scope}/${complexConfig.name}'
`)}`
    : baseConfigs;
}

export default async function ({projectRoot, config, additionalConfigs, ignore: {directories = []} = {}}) {
  const {scope} = config;

  await Promise.all([
    fsPromises.writeFile(`${projectRoot}/.eslintrc.yml`, buildConfig(scope, additionalConfigs)),
    fsPromises.writeFile(`${projectRoot}/.eslintignore`, directories.join('\n'))
  ]);

  return {
    devDependencies: [`${scope}/eslint-config`],
    scripts: {
      'lint:js': 'eslint . --cache',
      'lint:js:fix': 'run-s lint:js -- --fix'
    },
    vcsIgnore: {files: ['.eslintcache']}
  };
}
