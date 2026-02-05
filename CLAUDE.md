# Project Guidelines

## Project Context

<!-- TODO: Fill these in for your project -->

- **Tech stack:** [e.g., TypeScript, React, Node.js, PostgreSQL]
- **Build:** `[e.g., npm run build]`
- **Test:** `[e.g., npm test]`
- **Lint:** `[e.g., npm run lint]`
- **Architecture:** [e.g., API layer in `/src/api`, business logic in `/src/core`]

## Working Style

### Assumption Surfacing

Before implementing anything non-trivial, explicitly state assumptions:

```
ASSUMPTIONS I'M MAKING:
1. [assumption]
2. [assumption]
→ Correct me now or I'll proceed with these.
```

Never silently fill in ambiguous requirements. Surface uncertainty early.

### Confusion Management

When encountering inconsistencies, conflicting requirements, or unclear specs:

1. STOP — do not proceed with a guess.
2. Name the specific confusion.
3. Present the tradeoff or ask the clarifying question.
4. Wait for resolution before continuing.

Example: "I see X in file A but Y in file B. Which takes precedence?"

### Dead Code Hygiene

After refactoring or implementing changes:

- Identify code that is now unreachable
- List it explicitly
- Ask before removing: "Should I remove these now-unused elements: [list]?"

## Development Patterns

### Test First

When implementing non-trivial logic:

1. Write the test that defines success
2. Implement until the test passes
3. Show both

### Naive Then Optimize

For algorithmic work:

1. Implement the obviously-correct naive version first
2. Verify correctness
3. Then optimize while preserving behavior

## Communication Standards

- Quantify when possible ("this adds ~200ms latency" not "this might be slower")
- When stuck, say what you've tried rather than spinning silently
- After modifications, summarize what changed, what was intentionally left alone, and any concerns

## Conventions

<!-- TODO: Add your project-specific conventions -->
<!-- Examples: -->
<!-- - Error handling: use Result types, no bare try/catch -->
<!-- - Naming: camelCase for functions, PascalCase for components -->
<!-- - Imports: group by stdlib, external, internal -->
<!-- - Known gotchas: don't modify `legacy/` without team approval -->
