---
paths:
  - "packages/front/src/**"
  - "packages/front/e2e/**"
  - "packages/front/playwright.config.ts"
  - "packages/front/vite.config.ts"
---

# Frontend Testing Conventions

## Stack

| Tool | Role |
|------|------|
| **Vitest** | Unit/component tests (via `vite.config.ts` `test` block) |
| **React Testing Library** | DOM rendering + queries (`@testing-library/react`) |
| **@testing-library/jest-dom** | Custom matchers (`toBeInTheDocument`, `toBeVisible`, etc.) |
| **@testing-library/user-event** | User interaction simulation (click, type) |
| **Playwright** | E2E + visual screenshot tests (headless Chromium) |

## Test File Locations

- Unit tests: `src/<module>/__tests__/<Component>.test.tsx` (colocated with source)
- E2E tests: `e2e/*.spec.ts`
- Screenshot baselines: `e2e/screenshots/` (committed to repo)
- Setup file: `src/test/setup.ts`

## Running Tests

```bash
npm test              # Vitest unit tests (single run)
npm run test:watch    # Vitest in watch mode
npm run test:e2e      # Playwright E2E (requires running frontend on :3001)
npm run test:e2e:update  # Update screenshot baselines
```

## Unit Test Guidelines

### What to test
- Component renders correct text/elements
- CSS class presence for key visual states (variants, active/inactive, loading)
- User interactions: click handlers, form inputs, disabled state
- Conditional rendering (empty state, loading, with/without optional props)
- API client: correct HTTP method, URL, body, error handling

### What NOT to test
- Exact Tailwind class strings (too brittle) — test class *presence* instead
- Internal component state directly
- Third-party library internals (react-router, lucide icons)
- Trivial components (< 15 lines, no logic, single return with text/class) — their behavior is covered by tests of parent components that use them
- Mock call assertions (`toHaveBeenCalledWith`) on internal functions — test visible output instead

### Patterns

```tsx
// Rendering
import { render, screen } from "@testing-library/react";
render(<MyComponent prop="value" />);
expect(screen.getByText("expected text")).toBeInTheDocument();

// CSS class check
expect(element.className).toContain("bg-indigo-600");

// User interaction
import userEvent from "@testing-library/user-event";
const user = userEvent.setup();
await user.click(screen.getByRole("button"));
expect(handler).toHaveBeenCalledOnce();

// Router-dependent components — wrap in MemoryRouter
import { MemoryRouter } from "react-router-dom";
render(<MemoryRouter initialEntries={["/"]}><Layout /></MemoryRouter>);

// API client tests — mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;
mockFetch.mockReturnValueOnce(jsonResponse({ data: [] }));
```

## E2E / Screenshot Test Guidelines

### What to test
- Page layout structure (sidebar width, main offset, grid columns)
- Tailwind CSS is loaded (body has dark bg, not white)
- Navigation between pages works
- Key visual elements: active nav link highlighting, card borders, button styling, font loading
- **Screenshot regression** for each page (Dashboard, Repositories, Interests, Reports)

### Screenshot tests

```ts
// Wait for content to load, then snapshot
await page.waitForTimeout(500);
await expect(page).toHaveScreenshot("page-name.png", { fullPage: true });
```

- Max diff pixel ratio: 1% (`maxDiffPixelRatio: 0.01` in config)
- Viewport: 1440x900 (desktop)
- Run `npm run test:e2e:update` after intentional visual changes

### Playwright config

Located at `frontend/playwright.config.ts`. Screenshots stored in `e2e/screenshots/`.
Browser: Chromium headless only.

## Vitest Config

Configured in `vite.config.ts` under `test` key:
- `globals: true` — no need to import `describe`/`it`/`expect`
- `environment: "jsdom"` — DOM simulation
- `setupFiles: "./src/test/setup.ts"` — loads jest-dom matchers
- `css: true` — processes CSS imports

## SQLite UUID Gotcha (shared with backend integration tests)

When inserting models with UUID foreign keys from API response strings (e.g., `repo_id` from JSON), always convert: `uuid.UUID(string_id)`. SQLAlchemy's UUID type in SQLite requires actual UUID objects, not strings.
