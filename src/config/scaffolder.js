import write from './writer';

export default function ({projectRoot, scope}) {
  return write({path: projectRoot, config: {root: true, extends: scope}});
}
