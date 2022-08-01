import {promises as fs} from 'fs';
import {EOL} from 'os';
import {info} from '@travi/cli-messages';
import {fileExists} from '@form8ion/core';

export default async function ({projectRoot, ignore: {directories: directoriesToIgnore = []} = {}, buildDirectory}) {
  info('Lifting ESLint ignore definition', {level: 'secondary'});

  if (!buildDirectory && !directoriesToIgnore.length) {
    info('No additional ESLint ignores provided', {level: 'secondary'});

    return {};
  }

  const pathToIgnoreFile = `${projectRoot}/.eslintignore`;
  const mergedIgnoresToAdd = [...buildDirectory ? [`/${buildDirectory}/`] : [], ...directoriesToIgnore];

  if (await fileExists(pathToIgnoreFile)) {
    const existingIgnores = (await fs.readFile(pathToIgnoreFile, 'utf-8')).split(EOL);

    await fs.writeFile(pathToIgnoreFile, [...new Set([...existingIgnores, `/${buildDirectory}/`])].join(EOL));
  } else {
    await fs.writeFile(pathToIgnoreFile, mergedIgnoresToAdd.join(EOL));
  }

  return {};
}
