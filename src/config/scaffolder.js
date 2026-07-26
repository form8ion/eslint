import write from './writer.js';

export default function scaffoldConfig({projectRoot, scope}) {
  return write({path: projectRoot, config: {root: true, extends: scope}});
}
