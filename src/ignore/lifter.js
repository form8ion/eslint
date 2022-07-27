import {promises as fs} from 'fs';
import {EOL} from 'os';
import {info} from '@travi/cli-messages';
import {fileExists} from '@form8ion/core';

export default async function ({projectRoot, buildDirectory}) {
  info('Lifting ESLint ignore definition', {level: 'secondary'});

  if (!buildDirectory) {
    info('No additional ESLint ignores provided', {level: 'secondary'});

    return {};
  }

  const pathToIgnoreFile = `${projectRoot}/.eslintignore`;

  if (await fileExists(pathToIgnoreFile)) {
    const existingIgnores = (await fs.readFile(pathToIgnoreFile, 'utf-8')).split(EOL);

    await fs.writeFile(pathToIgnoreFile, [...new Set([...existingIgnores, buildDirectory])].join(EOL));
  } else {
    await fs.writeFile(pathToIgnoreFile, buildDirectory);
  }

  return {};
}
