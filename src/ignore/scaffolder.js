import {promises as fs} from 'fs';

export default function ({projectRoot, ignore: {directories = []} = {}}) {
  return fs.writeFile(`${projectRoot}/.eslintignore`, directories.join('\n'));
}
