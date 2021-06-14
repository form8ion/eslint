import {promises as fsPromises} from 'fs';

export default async function ({projectRoot, scope, ignore: {directories = []} = {}}) {
  await Promise.all([
    fsPromises.writeFile(`${projectRoot}/.eslintrc.yml`, `root: true\nextends: '${scope}'`),
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
