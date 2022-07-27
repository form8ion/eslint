// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, scaffold} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd(), scope: '@foo', ignore: {directories: []}});

  await lift({projectRoot: process.cwd(), configs: ['mocha', 'react'], buildDirectory: 'lib'});
})();
