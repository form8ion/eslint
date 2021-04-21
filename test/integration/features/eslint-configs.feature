Feature: ESLint Configs

  Scenario: No existing config
    Given no existing eslint config file is present
    When the project is lifted
    Then no eslint config file exists

  Scenario: existing yaml config
    Given an existing eslint config file is present
    When the project is lifted
    Then the yaml eslint config file contains the expected config
