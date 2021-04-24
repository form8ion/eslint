// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {lift, scaffold} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd()});

  await lift({projectRoot: process.cwd(), configs: ['mocha', 'react']});
})();
