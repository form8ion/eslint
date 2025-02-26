import {info} from '@travi/cli-messages';

import readIgnoreFile from './reader.js';
import writeIgnoreFile from './writer.js';
import ignoreFileExists from './predicate.js';

export default async function ({projectRoot, ignore: {directories: directoriesToIgnore = []} = {}, buildDirectory}) {
  info('Lifting ESLint ignore definition', {level: 'secondary'});

  if (!buildDirectory && !directoriesToIgnore.length) {
    info('No additional ESLint ignores provided', {level: 'secondary'});

    return {};
  }

  const mergedIgnoresToAdd = [...buildDirectory ? [`/${buildDirectory}/`] : [], ...directoriesToIgnore];

  if (await ignoreFileExists({projectRoot})) {
    const existingIgnores = await readIgnoreFile({projectRoot});

    await writeIgnoreFile({projectRoot, ignores: [...existingIgnores, ...mergedIgnoresToAdd]});
  } else {
    await writeIgnoreFile({projectRoot, ignores: mergedIgnoresToAdd});
  }

  return {};
}
