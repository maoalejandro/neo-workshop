# Playwright & TypeScript Page Object Code Review Checklist

## Structure & Organization ⭐⭐⭐⭐⭐
- [ ] Class extends appropriate base class
- [ ] Locators are private and use descriptive names
- [ ] Methods are logically organized (getters, actions, workflows)
- [ ] Page object has single responsibility
- [ ] Follows project naming conventions

## Locator Quality ⭐⭐⭐⭐⭐
- [ ] Uses stable, resilient selectors (data-testid preferred)
- [ ] Avoids brittle selectors (like XPath or CSS positions)
- [ ] Properly scopes locators to avoid conflicts
- [ ] Uses appropriate selector types for elements (text, role, testid)
- [ ] Locator names clearly describe the element's purpose

## Method Design ⭐⭐⭐⭐⭐
- [ ] Methods perform single logical actions
- [ ] Return types are properly specified
- [ ] Async/await is used consistently
- [ ] Higher-level methods compose lower-level ones
- [ ] Method names clearly describe actions performed

## Error Handling ⭐⭐⭐⭐⭐
- [ ] Includes appropriate timeout settings
- [ ] Handles expected failures gracefully
- [ ] Implements retry logic where appropriate
- [ ] Uses try/catch blocks for potentially unstable operations
- [ ] Provides meaningful error messages

## TypeScript Best Practices ⭐⭐⭐⭐⭐
- [ ] Proper type definitions for parameters and returns
- [ ] Uses interfaces/types for complex structures
- [ ] No 'any' type unless absolutely necessary
- [ ] Generics used appropriately where needed
- [ ] Consistent use of access modifiers (private, protected, public)

## Overall Rating: __/25