Feature: Scaffolder

  Scenario: Scaffold
    Given ignored directories are provided
    When the project is scaffolded
    Then the provided directories are ignored
