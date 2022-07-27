Feature: ignores

  @wip
  Scenario: build directory w/o existing ignore file
    Given there is no ignore file
    And a build directory is provided
    When the project is lifted
    Then the build directory is included in the ignore file
