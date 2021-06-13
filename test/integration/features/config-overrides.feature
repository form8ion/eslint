Feature: Config Overrides

  Scenario: No existing overrides, none provided
    Given the existing eslint config file has no existing overrides
    And additional shareable configs are provided
    When the project is lifted
    Then no overrides are defined in the config file

  @wip
  Scenario: No existing overrides, overrides provided
    Given the existing eslint config file has no existing overrides
    And additional shareable configs, specifying file paths, are provided
    When the project is lifted
    Then the expected overrides are defined in the config file

  Scenario: Existing overrides, overrides provided
    Given the existing eslint config file contains existing overrides
    And additional shareable configs are provided
    When the project is lifted
    Then the expected overrides are defined in the config file

  @wip
  Scenario: Existing overrides, overrides provided
    Given the existing eslint config file contains existing overrides
    And additional shareable configs, specifying file paths, are provided
    When the project is lifted
    Then the expected overrides are defined in the config file
