# eslint

opinionated scaffolder for managing the [ESLint](https://eslint.org)
configuration for a project

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
[![Codecov][coverage-badge]][coverage-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Table of Contents

* [Features](#features)
  * [Scaffolder](#scaffolder)
  * [Lifter](#lifter)
* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Features

### Scaffolder

* creates an initial `.eslintrc.yml` config file for the project
* extends the base shareable eslint-config package defined by `config.scope`
* defines the lint and fix scripts
* ignores the cache file from the VCS

### Lifter

* ignores linting of paths defined in
  * `results.buildDirectory`
  * `results.eslint.ignore.directories`
* extends configs defined in `results.eslint.configs`, using the scope of the
  base config already defined in the `.eslintrc.yml`

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
[![Try @form8ion/eslint on RunKit][runkit-badge]][runkit-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/eslint --save
```

### Example

#### Import

```javascript
import {lift, scaffold} from '@form8ion/eslint';
```

#### Execute

```javascript
(async () => {
  await scaffold({projectRoot: process.cwd(), config: {scope: '@foo'}});

  await lift({
    projectRoot: process.cwd(),
    results: {
      eslint: {configs: ['mocha', 'react'], ignore: {directories: []}},
      buildDirectory: 'lib'
    }
  });
})();
```

## Contributing

<!--contribution-badges start -->

[![PRs Welcome][PRs-badge]][PRs-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[github-actions-ci-link]: https://github.com/form8ion/eslint/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/eslint/node-ci.yml.svg?branch=master&logo=github

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/eslint.svg

[npm-link]: https://www.npmjs.com/package/@form8ion/eslint

[npm-badge]: https://img.shields.io/npm/v/@form8ion/eslint?logo=npm

[runkit-link]: https://npm.runkit.com/@form8ion/eslint

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/eslint.svg

[node-badge]: https://img.shields.io/node/v/@form8ion/eslint?logo=node.js

[coverage-link]: https://codecov.io/github/form8ion/eslint

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/eslint?logo=codecov

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
