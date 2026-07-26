import {load} from '@form8ion/config-file';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
// eslint-disable-next-line import/no-unresolved
import {when} from 'vitest-when';

import extractScopeFrom from '../scope-extractor.js';
import writeConfig from './writer.js';
import liftEslint from './lifter.js';

vi.mock('@form8ion/config-file');
vi.mock('../scope-extractor.js');
vi.mock('./writer.js');

describe('config lifter', () => {
  const projectRoot = any.string();
  const scope = any.word();
  const duplicateConfig = any.word();
  const existingConfigWithSingleExistingConfig = {...any.simpleObject(), extends: any.word()};
  const existingConfigWithMultipleExistingConfigs = {
    ...any.simpleObject(),
    extends: [...any.listOf(any.word), `${scope}/${duplicateConfig}`]
  };
  const logger = {info: () => undefined};

  it('should not apply additional extensions when no additional configs are provided', async () => {
    expect(await liftEslint({projectRoot}, {logger})).toEqual({});
    expect(writeConfig).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    expect(extractScopeFrom).not.toHaveBeenCalled();
  });

  it('should not apply additional extensions when an empty list of additional configs is provided', async () => {
    expect(await liftEslint({projectRoot, configs: []}, {logger})).toEqual({});
    expect(writeConfig).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    expect(extractScopeFrom).not.toHaveBeenCalled();
  });

  it('should extend a single config by adding additional single configs & list dependencies', async () => {
    const configs = any.listOf(any.word);
    when(load).calledWith({name: 'eslint'}).thenReturn(existingConfigWithSingleExistingConfig);
    when(extractScopeFrom).calledWith(existingConfigWithSingleExistingConfig).thenReturn(scope);

    const {dependencies} = await liftEslint({configs, projectRoot}, {logger});

    expect(dependencies.javascript.development).toEqual(configs.map(config => `${scope}/eslint-config-${config}`));
    expect(writeConfig).toHaveBeenCalledWith({
      path: projectRoot,
      config: {
        ...existingConfigWithSingleExistingConfig,
        extends: [existingConfigWithSingleExistingConfig.extends, ...configs.map(config => `${scope}/${config}`)]
      }
    });
  });

  it('should extend multipl configs by adding additional simple configs & list dependencies', async () => {
    const configsWithoutDuplicate = any.listOf(any.word);
    const configs = [...configsWithoutDuplicate, duplicateConfig];
    when(load).calledWith({name: 'eslint'}).thenReturn(existingConfigWithMultipleExistingConfigs);
    when(extractScopeFrom).calledWith(existingConfigWithMultipleExistingConfigs).thenReturn(scope);

    const {dependencies} = await liftEslint({configs, projectRoot}, {logger});

    expect(dependencies.javascript.development).toEqual(configs.map(config => `${scope}/eslint-config-${config}`));
    expect(writeConfig).toHaveBeenCalledWith({
      path: projectRoot,
      config: {
        ...existingConfigWithMultipleExistingConfigs,
        extends: [
          ...existingConfigWithMultipleExistingConfigs.extends,
          ...configsWithoutDuplicate.map(config => `${scope}/${config}`)
        ]
      }
    });
  });

  it('should extend mutliple configs by adding complex configs & list dependencies', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word()}));
    when(load).calledWith({name: 'eslint'}).thenReturn(existingConfigWithMultipleExistingConfigs);
    when(extractScopeFrom).calledWith(existingConfigWithMultipleExistingConfigs).thenReturn(scope);

    const {dependencies} = await liftEslint({configs, projectRoot}, {logger});

    expect(dependencies.javascript.development).toEqual(configs.map(config => `${scope}/eslint-config-${config.name}`));
    expect(writeConfig).toHaveBeenCalledWith({
      path: projectRoot,
      config: {
        ...existingConfigWithMultipleExistingConfigs,
        extends: [
          ...existingConfigWithMultipleExistingConfigs.extends,
          ...configs.map(config => `${scope}/${config.name}`)
        ]
      }
    });
  });

  it('should add `overrides` to the config when configs with file patterns defined are provided', async () => {
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word(), files: any.string()}));
    when(load).calledWith({name: 'eslint'}).thenReturn(existingConfigWithSingleExistingConfig);
    when(extractScopeFrom).calledWith(existingConfigWithSingleExistingConfig).thenReturn(scope);

    const {dependencies} = await liftEslint({configs, projectRoot}, {logger});

    expect(dependencies.javascript.development).toEqual(configs.map(config => `${scope}/eslint-config-${config.name}`));
    expect(writeConfig).toHaveBeenCalledWith({
      path: projectRoot,
      config: {
        ...existingConfigWithSingleExistingConfig,
        extends: existingConfigWithSingleExistingConfig.extends,
        overrides: configs.map(config => ({
          extends: `${scope}/${config.name}`,
          files: config.files
        }))
      }
    });
  });

  it('should add `overrides` to the existing overrides in the config', async () => {
    const existingConfigWithOverrides = {
      ...any.simpleObject(),
      extends: any.listOf(any.word),
      overrides: any.listOf(() => ({extends: any.word(), files: any.string()}))
    };
    const configs = any.listOf(() => ({...any.simpleObject(), name: any.word(), files: any.string()}));
    when(load).calledWith({name: 'eslint'}).thenReturn(existingConfigWithOverrides);
    when(extractScopeFrom).calledWith(existingConfigWithOverrides).thenReturn(scope);

    const {dependencies} = await liftEslint({configs, projectRoot}, {logger});

    expect(dependencies.javascript.development).toEqual(configs.map(config => `${scope}/eslint-config-${config.name}`));
    expect(writeConfig).toHaveBeenCalledWith({
      path: projectRoot,
      config: {
        ...existingConfigWithOverrides,
        extends: existingConfigWithOverrides.extends,
        overrides: [
          ...existingConfigWithOverrides.overrides,
          ...configs.map(config => ({
            extends: `${scope}/${config.name}`,
            files: config.files
          }))
        ]
      }
    });
  });
});
