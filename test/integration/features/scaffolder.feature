Feature: Scaffolder

  Scenario: Scaffold
    Given no existing eslint config file is present
    And ignored directories are provided
    When the project is scaffolded
    Then the provided directories are ignored
    And a yaml config file was created
