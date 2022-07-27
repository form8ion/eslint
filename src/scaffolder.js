import {promises as fs} from 'fs';
import {scaffold as scaffoldConfig} from './config';

export default async function ({projectRoot, scope, ignore: {directories = []} = {}}) {
  await Promise.all([
    scaffoldConfig({projectRoot, scope}),
    fs.writeFile(`${projectRoot}/.eslintignore`, directories.join('\n'))
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
