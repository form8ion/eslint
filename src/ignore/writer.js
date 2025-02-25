import {promises as fs} from 'node:fs';
import {EOL} from 'node:os';

export default async function writeIgnoreFile({projectRoot, ignores}) {
  await fs.writeFile(`${projectRoot}/.eslintignore`, [...new Set(ignores)].join(EOL));
}
