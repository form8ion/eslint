Feature: Scaffolder

  Scenario: Scaffold
    Given no existing eslint config file is present
    When the project is scaffolded
    And a yaml config file was created
