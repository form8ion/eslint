Feature: Config Overrides

  Scenario: No existing overrides, none provided
    Given the existing eslint config file has no existing overrides
    And additional shareable configs are provided
    When the project is lifted
    Then no overrides are defined in the config file
