import {promises as fs} from 'node:fs';

export default function scaffoldIgnoreFile({projectRoot, ignore: {directories = []} = {}}) {
  return fs.writeFile(`${projectRoot}/.eslintignore`, directories.join('\n'));
}
