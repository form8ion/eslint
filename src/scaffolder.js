import {promises as fsPromises} from 'fs';
import {fileTypes, writeConfigFile} from '@form8ion/core';

export default async function ({projectRoot, scope, ignore: {directories = []} = {}}) {
  await Promise.all([
    writeConfigFile({
      format: fileTypes.YAML,
      path: projectRoot,
      name: '.eslintrc',
      config: {root: true, extends: scope}
    }),
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
