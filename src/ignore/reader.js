import {promises as fs} from 'node:fs';
import {EOL} from 'node:os';

export default async function readIgnoreFile({projectRoot}) {
  const ignoreContent = await fs.readFile(`${projectRoot}/.eslintignore`, 'utf-8');

  return ignoreContent.split(EOL);
}
