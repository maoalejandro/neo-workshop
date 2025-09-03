# Playwright Test Spec Code Review Checklist

## Test Structure & Organization ⭐⭐⭐⭐⭐
- [ ] Tests are grouped logically in describe blocks
- [ ] Test names clearly describe what is being tested
- [ ] Setup and teardown (beforeEach, afterEach) used appropriately
- [ ] Follows AAA pattern (Arrange, Act, Assert)
- [ ] Complex test logic is extracted into helper functions

## Test Coverage ⭐⭐⭐⭐⭐
- [ ] Happy path scenarios covered
- [ ] Negative test cases included
- [ ] Edge cases and boundary conditions tested
- [ ] Visual regression tests where appropriate
- [ ] All user interactions and flows verified

## Assertions ⭐⭐⭐⭐⭐
- [ ] Assertions are specific and meaningful
- [ ] Uses appropriate matchers for the condition being tested
- [ ] Custom error messages provided for complex assertions
- [ ] Avoids testing multiple concerns in a single assertion
- [ ] Proper waiting strategies used before assertions

## Test Data Management ⭐⭐⭐⭐⭐
- [ ] Test data is isolated between tests
- [ ] Uses fixtures effectively
- [ ] Environment-specific data handled properly
- [ ] Sensitive data not hardcoded
- [ ] Mock/stub external dependencies appropriately

## Performance & Reliability ⭐⭐⭐⭐⭐
- [ ] Tests run efficiently (avoid unnecessary waits)
- [ ] Proper timeout configuration
- [ ] Retries configured for flaky tests
- [ ] Tests are independent and don't affect each other
- [ ] Handles async operations correctly

## Overall Rating: __/25