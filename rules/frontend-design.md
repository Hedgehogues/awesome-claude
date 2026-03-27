# Frontend Design Rules

## Component Patterns

### ConfirmDialog

Projects should have a reusable confirmation modal. Expected API:

```tsx
<ConfirmDialog
  open={boolean}
  title="Action Title"
  message="Detailed explanation of consequences."
  variant="danger" | "default"
  confirmLabel="Custom label"  // default: "Confirm"
  onConfirm={handler}
  onCancel={handler}
/>
```

Uses `createPortal` to render at document body. Follows existing modal CSS patterns.

## UI Principles

### Icons by default

**Always use SVG icons** instead of text labels — for actions, filters, toggles, and controls. This is the default; text labels require justification. Use inline SVG with `stroke="currentColor"` so icons inherit theme colors automatically.

- **Actions:** copy, expand/collapse, toggle theme, close, delete, settings, edit
- **Filters & toggles:** status filters (segmented icon buttons), view modes, sort direction
- **Inputs:** embed contextual icons (e.g., magnifying glass in search)
- **Text fallback:** only when the action is truly ambiguous without words (e.g., "Resolve All") or for primary CTA buttons (e.g., "Create Project")
- Use `aria-label` and `title` for accessibility on icon-only buttons
