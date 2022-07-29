import {scaffold as scaffoldConfig} from './config';

export default async function ({projectRoot, config: {scope}}) {
  await scaffoldConfig({projectRoot, scope});

  return {
    devDependencies: [`${scope}/eslint-config`],
    scripts: {
      'lint:js': 'eslint . --cache',
      'lint:js:fix': 'run-s lint:js -- --fix'
    },
    vcsIgnore: {files: ['.eslintcache']}
  };
}
