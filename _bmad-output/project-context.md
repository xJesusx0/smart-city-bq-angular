---
project_name: 'smart-city-bq-angular'
user_name: 'Jesus'
date: '2026-02-25'
sections_completed:
  [
    'technology_stack',
    'language_rules',
    'framework_rules',
    'testing_rules',
    'code_quality_rules',
    'workflow_rules',
    'critical_rules',
  ]
status: 'complete'
rule_count: 35
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

_Framework:_ Angular 21 (Standalone Components, Signals)
_Language:_ TypeScript 5.9 (Strict mode)
_Styling:_ Tailwind CSS 4, Spartan UI (Brain/Hlm presets)
_Auth:_ Azure AD (@azure/msal-angular)
_State:_ Angular Signals (local), TanStack Query (server)
_Maps:_ Leaflet (@asymmetrik/ngx-leaflet)
_Charts:_ ngx-charts, D3
_API:_ openapi-fetch
_Testing:_ Vitest

## Critical Implementation Rules

### Language-Specific Rules

- TypeScript strict mode enabled
- Use `unknown` in catch blocks, never `any`
- Explicit imports, no `* as`
- Use `@lib/*` alias for src/lib imports

### Framework-Specific Rules (Angular)

- All components must be standalone (no NgModules)
- Use `input()`, `output()`, `model()` instead of decorators
- Always `changeDetection: ChangeDetectionStrategy.OnPush`
- Use `signal()` for local state, `computed()` for derived state
- NEVER use `mutate()` on signals - use `set()` or `update()`
- Use `inject()` instead of constructor injection
- Use native control flow (`@if`, `@for`, `@switch`) - NOT `*ngIf`, `*ngFor`
- NO `ngClass` - use `class` bindings
- NO `ngStyle` - use `style` bindings
- NO arrow functions in templates

### Testing Rules

- Test files: `*.spec.ts` next to source file
- Structure: Arrange-Act-Assert (AAA)
- Use `provideMock` for services
- Use HttpTestingModule for HTTP mocks
- Mock contracts, not implementations

### Code Quality & Style Rules

- Run `npm run lint` before commit
- Run `npm run format` for auto-formatting
- printWidth: 100, singleQuote: true
- Components: PascalCase, Files: kebab-case
- Tests: `.spec.ts` suffix

### Development Workflow Rules

- Branches: feature/_, bugfix/_, hotfix/\*
- Commits: Conventional commits (feat:, fix:, docs:)
- PRs: Require lint and tests passing
- Use ApiService from src/lib/api
- Use TanStack Query for caching
- Generated types in src/lib/**gen**

### Critical Don't-Miss Rules

- NEVER use `any` - use `unknown` when type is uncertain
- NEVER mutate signals - always use `set()` or `update()`
- NEVER use NgModules - standalone components only
- NEVER use @Input/@Output decorators - use input()/output() functions
- Use NgOptimizedImage for static images (NOT inline base64)
- Use Reactive Forms, not template-driven forms
- Lazy loading for feature routes
- NO secrets/keys in code - use environment variables

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time
