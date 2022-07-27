Feature: Config Overrides

  Scenario: No existing overrides, none provided
    Given the existing eslint config file has no existing overrides
    And additional shareable configs are provided
    When the project is lifted
    Then no overrides are defined in the config file

  Scenario: No existing overrides, overrides provided
    Given the existing eslint config file has no existing overrides
    And additional shareable configs, specifying file paths, are provided
    When the project is lifted
    Then the expected overrides are defined in the config file
    But the existing extensions are preserved
    And dependencies are defined for the additional configs

  Scenario: Existing overrides, no overrides provided
    Given the existing eslint config file contains existing overrides
    And additional shareable configs are provided
    When the project is lifted
    Then the yaml eslint config file contains the expected config
    And the expected overrides are defined in the config file
    And dependencies are defined for the additional configs

  Scenario: Existing overrides, overrides provided
    Given the existing eslint config file contains existing overrides
    And additional shareable configs, specifying file paths, are provided
    When the project is lifted
    Then the expected overrides are defined in the config file
    But the existing extensions are preserved
    And dependencies are defined for the additional configs
