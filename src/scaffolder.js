import {promises as fsPromises} from 'fs';
import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

export default async function ({projectRoot, scope, ignore: {directories = []} = {}}) {
  await Promise.all([
    write({
      format: fileTypes.YAML,
      path: projectRoot,
      name: 'eslint',
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
