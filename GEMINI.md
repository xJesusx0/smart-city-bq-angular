# Smart City BQ Angular - Project Context & Guidelines

This document serves as the primary instructional context for Gemini CLI when working on the **Smart City BQ Angular** project. It outlines the project's purpose, architecture, technical stack, and development standards.

## Project Overview

**Smart City BQ Angular** is a modern web application for smart city management, focusing on monitoring and administration. It is built using **Angular 21** and follows a highly modular, standalone-first architecture.

### Core Mission
- Provide a dashboard for smart city monitoring (cameras, sensors, reports).
- Manage users and security permissions.
- Integrate with Azure AD for secure authentication.
- Visualize geospatial data (maps) and metrics (charts).

## Technical Stack

- **Framework:** Angular 21 (Standalone Components, Signals).
- **Language:** TypeScript (Strict mode).
- **Styling:** Tailwind CSS v4 with [Spartan UI](https://www.spartan.ng/) (Brain/Hlm presets).
- **Authentication:** Azure AD via `@azure/msal-angular`.
- **State Management:**
  - **Local/UI State:** Angular Signals (`signal`, `computed`, `effect`).
  - **Server State:** TanStack Query (`@tanstack/angular-query-experimental`).
- **Data Visualization:**
  - **Maps:** Leaflet (`@asymmetrik/ngx-leaflet`).
  - **Charts:** ngx-charts and D3.
- **API Communication:** `openapi-fetch` (Typed client from OpenAPI schema).
- **Testing:**
  - **Unit Tests:** Vitest.
  - **E2E Tests:** Angular CLI integration.
- **Linting/Formatting:** ESLint and Prettier.

## Building and Running

| Task | Command |
| :--- | :--- |
| **Development Server** | `npm start` (or `ng serve`) |
| **Build (Production)** | `npm run build` |
| **Run Unit Tests** | `npm test` (uses Vitest) |
| **Lint Code** | `npm run lint` |
| **Format Code** | `npm run format` |

## Architecture and Conventions

### Project Structure
- `src/app`: Application-level components, routes, and global configuration.
  - `layouts/`: Shared layout components (e.g., `MainLayoutComponent`).
  - `pages/`: Feature pages (lazy-loaded).
- `src/lib`: Shared library code.
  - `api/`: API services and helpers.
  - `auth/`: MSAL configuration and authentication logic.
  - `components/`: Reusable UI components (mostly Spartan-based).
  - `guards/`: Route guards (e.g., `authGuard`).
  - `theme/`: Theme configuration.
  - `__gen__/`: Generated types and code (e.g., from OpenAPI).
- `public/`: Static assets.

### Angular Best Practices
- **Standalone Everything:** Always use standalone components, directives, and pipes.
- **Signals First:** Use signals for state management. Avoid `Observable` for simple UI state; use `toSignal` when bridging from RxJS.
- **Input/Output Functions:** Use `input()`, `output()`, and `model()` instead of the old decorators.
- **OnPush Change Detection:** Always set `changeDetection: ChangeDetectionStrategy.OnPush` in components.
- **Native Control Flow:** Use `@if`, `@for`, `@switch` instead of structural directives like `*ngIf`.
- **Injection:** Use the `inject()` function for dependency injection instead of constructor injection.
- **Templates:** Prefer inline templates for simple components; use external files for complex ones. Avoid complex logic in templates.

### TypeScript Standards
- **Strict Typing:** Always use strict types. Avoid `any`; use `unknown` if necessary.
- **Type Inference:** Rely on inference for obvious types (e.g., `const title = signal('...')`).

### Accessibility (A11y)
- Must pass all AXE checks.
- Follow WCAG AA standards.
- Use proper ARIA attributes and manage focus explicitly.

## Development Workflow

1. **Feature Implementation:** Always check `src/lib` for existing components or utilities before creating new ones.
2. **API Interaction:** Use `ApiService` and related services in `src/lib/api`. Leverage TanStack Query for caching and synchronization.
3. **Styling:** Use Tailwind CSS classes. Follow Spartan UI patterns for consistency.
4. **Testing:** Write unit tests for new logic using Vitest. Ensure tests pass before submitting changes.
5. **State:** Keep transformations pure. Use `computed()` for derived state. Never mutate signals; use `update()` or `set()`.

---
*Note: This file is a foundational mandate for Gemini CLI interactions. Adherence to these standards is mandatory.*
