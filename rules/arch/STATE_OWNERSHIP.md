# State Ownership: Backend is the Single Source of Truth

## Core Principle

All business logic that involves **state** (creating, reading, updating, deleting data)
MUST live on the backend. The frontend is a **stateless projection** — it renders
what the backend tells it, sends user intents as API calls, and re-fetches to
reflect the new state.

## Rules

### R1: Backend owns all mutable state

Every piece of data that persists beyond a single page view MUST be stored in the
backend database and exposed via API endpoints. This includes:

- Domain entity fields (name, status, configuration, timestamps)
- Computed state (online/offline, watching/idle, anomaly counts)
- Process state (is_watching, watch_interval, is_active)
- Relationships (collector belongs to project, anomaly belongs to run)

**Violation example:** Storing "last selected tab" in localStorage that affects
which API calls are made. If the tab selection changes business behavior, it
belongs on the backend.

### R2: Frontend never computes domain logic

The frontend MUST NOT compute values that the backend already computes. If the
backend has `computed_status()`, the frontend displays `collector.status` from
the API response — it does not re-implement the 10-minute threshold logic.

**Allowed on frontend:**
- Pure UI state: open/closed modals, form input values, loading spinners
- Sorting/filtering of already-fetched lists (display-only grouping)
- Date formatting (relative time display)

**Forbidden on frontend:**
- Business rule evaluation (is this collector online? is this run complete?)
- State transitions (what happens when you revoke a collector?)
- Validation that affects data integrity (the backend validates too, always)

### R3: Every state change goes through the backend

When the user clicks a button that changes state, the flow is ALWAYS:

```
User action → API call (POST/PATCH/DELETE) → Backend mutates state → Frontend re-fetches → UI updates
```

Never:

```
User action → Frontend mutates local state → (maybe) tells backend later
```

**Concrete examples in this project:**

| Action | Correct | Wrong |
|---|---|---|
| Start scanning | `POST /collectors/{id}/start` → re-fetch | Toggle local `isWatching` flag |
| Rename collector | `PATCH /collectors/{id}` → re-fetch | Update local state, sync later |
| Revoke collector | `DELETE /collectors/{id}` → re-fetch | Remove from local array |
| Resolve anomaly | `POST /runs/{id}/anomalies/{id}/resolve` → re-fetch | Set `resolved_at` locally |

### R4: Backend exposes computed fields in API responses

If the frontend needs to display a derived value, the backend MUST include it
in the API response as a computed field. The frontend never derives it.

**Examples:**
- `status: "online" | "offline"` — computed from `last_seen_at` threshold
- `collector_count: 3` — computed from active collectors per project
- `is_watching: true` — stored state, not derived on frontend
- `watch_interval: 30` — stored config, not a frontend constant

### R5: Domain entity methods live in `src/domain/`

State transitions are domain methods on the entity, called by use cases:

```python
# Domain entity (backend)
def start_watching(self, interval: int = 30) -> None:
    self.is_watching = True
    self.watch_interval = interval
    self.version += 1

# Use case calls the method, repository persists
# Route calls the use case, returns updated response
# Frontend displays the new state
```

The frontend never replicates this logic. It only knows that after calling
`POST /collectors/{id}/start`, the response will have `is_watching: true`.

### R6: Optimistic updates are acceptable but the backend is authoritative

If a UI needs to feel instant, optimistic updates (showing expected state before
the API confirms) are allowed, but:

1. The API call MUST still happen
2. If the API fails, the UI MUST revert to the actual backend state
3. The backend response is always the final truth

Currently this project uses **pessimistic updates** (wait for API, then re-fetch).
This is simpler and preferred unless latency is a real UX problem.

## Architecture Consequence

This rule means:
- New features that change state → start from backend (entity → use case → route → schema)
- Frontend is last — it calls the API and displays what comes back
- If you need a new field on the frontend → add it to the domain entity first, then
  the DB model, then the schema, then the API response, then the frontend type
- The migration from entity to UI follows the dependency direction: domain → infra → presentation → frontend

## Anti-patterns to Avoid

1. **Frontend-driven state**: Adding a toggle to the UI that only changes local
   React state without a backend endpoint
2. **Duplicated business rules**: Re-implementing `computed_status()` or threshold
   checks in TypeScript
3. **Stale state**: Caching API responses and showing outdated data when the
   backend state has changed
4. **Implicit state**: Deriving behavior from URL params or localStorage instead
   of explicit backend fields
5. **Fire-and-forget mutations**: Calling an API but not re-fetching the updated
   state, relying on local assumptions about what changed
