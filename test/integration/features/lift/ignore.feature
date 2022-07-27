Feature: ignores

  Scenario: build directory w/o existing ignore file
    Given an existing eslint config file is present
    And there is no ignore file
    And a build directory is provided
    When the project is lifted
    Then the build directory is included in the ignore file

  Scenario: build directory w/ an existing ignore file
    Given an existing eslint config file is present
    And there is an existing ignore file
    And a build directory is provided
    When the project is lifted
    Then the build directory is included in the ignore file
    And the existing ignores are still included in the ignore file

  @wip
  Scenario: build directory already exists in the ignore file
    Given an existing eslint config file is present
    And there is an existing ignore file
    And a build directory is provided
    And the build directory is already present in the ignore file
    When the project is lifted
    Then the build directory is included in the ignore file
    And the existing ignores are still included in the ignore file
