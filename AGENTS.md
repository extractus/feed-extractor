# AI Agent Instructions

Coding guidelines for AI agents working in this project.

## Philosophy

- Minimalism. Simple is better. KISS (Keep It Simple, Stupid).
- Clean code, easy to read, easy to delete.
- Functional Programming — pure functions, immutability, no side effects.
- MVP mindset — deliver the smallest thing that works, then iterate.

## Security Rules (CRITICAL — no exceptions)

- NEVER output or request .env and example.env file contents
- NEVER hardcode API credentials, secret tokens, private keys or passwords in source code
- NEVER send sensitive data to external AI services
- Follow `.aiignore` and `.gitignore` for excluded files — do not read or reference them
- When asking for help, sanitize data (replace real IDs, emails, tokens with placeholders)
- Do not log sensitive information

## Coding Standards (Strict)
- Language: JavaScript (ESM syntax). No TypeScript.
- Style: No semicolons, single quotes, 2-space indentation.
- Respect `eslint.config.js` — do not suggest rule changes
- Patterns:
  - Functional Programming only. No Classes or OOP.
  - Arrow functions are preferred.
  - Maximum 3 parameters per function. Use objects for more.
- Naming: camelCase for variables/functions, SNAKE_CASE for constants.
- Documentation:
  - Add JSDocs before all functions and exported variables.
  - Language: Use American English for all comments and JSDocs.
  - Constraint: NEVER use Vietnamese or other languages in the source code.

### Error Handling

- Handle errors explicitly — never swallow silently
- Use try/catch with proper logging
- Return null or throw meaningful errors

```javascript
export const send = async (params) => {
  try {
    const response = await ai.ask(params)
    logger.info(`send() -> success: ${response.id}`)
    return response
  } catch (err) {
    logger.error(`send() -> failed: ${err.message}`)
    console.error(err)
    return null
  }
}
```

## Testing Standards

- Write tests for critical business logic, all error cases
- Use simple test runners (node:test, bun:test, vitest)
- No complex mocking frameworks unless necessary
- Tests live alongside source: `[module].test.js` next to `[module].js`

## Dependency Rules

- Prefer built-in APIs over external packages
- Before adding dependency, explain:
  - Why it is needed
  - Alternatives considered
  - Bundle size impact
- Never add dependency for trivial utilities
- Avoid packages with large dependency trees

## Architecture Rules

- Do NOT change existing project architecture without explicit approval
- Do NOT move or rename core modules unless requested
- Respect module boundaries
- Avoid cross-module coupling
- New modules must follow existing folder structure

## When Making Changes

1. Read existing patterns first
2. Follow current coding style strictly
3. Keep dependencies minimal
4. Handle errors explicitly
5. Add JSDoc comments for new functions
6. Run `npm run lint` before committing
7. Do NOT refactor unrelated code
8. Do NOT modify working code outside task scope
9. Prefer minimal diff changes
10. Preserve existing behavior unless explicitly requested

## When in Doubt

- Ask for clarification before generating code
- State your assumption explicitly if proceeding without confirmation
- Prefer doing less and asking over doing more and guessing

## Git Workflow

- Work only inside the current branch
- Do NOT create or delete branches
- Do NOT rewrite git history
- Do NOT modify commit messages
- Changes must correspond to the current issue

## Agent References

Reference these URLs when working on related topics:

- Bun: https://bun.sh/llms-full.txt
- RSS Feed: https://www.rssboard.org/rss-specification
- RDF Feed: https://web.resource.org/rss/1.0/spec
- ATOM Feed: https://datatracker.ietf.org/doc/html/rfc5023
- JSON Feed: https://www.jsonfeed.org/version/1.1/

---
