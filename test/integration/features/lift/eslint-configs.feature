Feature: ESLint Configs

  Scenario: No existing config, but no updates
    Given no existing eslint config file is present
    When the project is lifted
    Then no eslint config file exists

  Scenario: existing yaml config, but no updates
    Given an existing eslint config file is present
    When the project is lifted
    Then the yaml eslint config file contains the expected config

  Scenario: existing yaml config, but empty list of updates
    Given an existing eslint config file is present
    And an empty list of additional shareable configs is provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config

  Scenario: existing yaml extending multiple configs, but no updates
    Given an existing eslint config file extending multiple configs is present
    When the project is lifted
    Then the yaml eslint config file contains the expected config

  Scenario: existing yaml config and shareable configs to add
    Given an existing eslint config file is present
    And additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And dependencies are defined for the additional configs
    And the yaml eslint config file is updated with the provided simple configs

  Scenario: existing yaml config extending multiple configs with shareable configs to add
    Given an existing eslint config file extending multiple configs is present
    And additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And dependencies are defined for the additional configs
    And the yaml eslint config file is updated with the provided simple configs

  Scenario: existing yaml config extending multiple configs and complex shareable configs to add
    Given an existing eslint config file extending multiple configs is present
    And complex additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And dependencies are defined for the additional configs
    And the yaml eslint config file is updated with the provided complex configs

  Scenario: existing yaml config and complex shareable configs to add
    Given an existing eslint config file is present
    And complex additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And dependencies are defined for the additional configs
    And the yaml eslint config file is updated with the provided complex configs

  Scenario: duplicate config between existing and provided
    Given some provided configs duplicate existing configs
    When the project is lifted
    And dependencies are defined for the additional configs
    And the yaml eslint config file is updated with the provided simple configs
    But there are no duplicates listed in the extended configs
