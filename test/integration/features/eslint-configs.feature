Feature: ESLint Configs

  Scenario: No existing config
    Given no existing eslint config file is present
    When the project is lifted
    Then no eslint config file exists

  Scenario: existing yaml config
    Given an existing eslint config file is present
    When the project is lifted
    Then the yaml eslint config file contains the expected config

  Scenario: existing yaml extending multiple configs
    Given an existing eslint config file extending multiple configs is present
    When the project is lifted
    Then the yaml eslint config file contains the expected config

  Scenario: existing yaml config and shareable configs to add
    Given an existing eslint config file is present
    And additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And the next-steps are provided
    And dependencies are defined for the additional configs

  Scenario: existing yaml config extending multiple configs with shareable configs to add
    Given an existing eslint config file extending multiple configs is present
    And additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And the next-steps are provided
    And dependencies are defined for the additional configs

  Scenario: existing yaml config and complex shareable configs to add
    Given an existing eslint config file is present
    And complex additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And the next-steps are provided
    And dependencies are defined for the additional configs
