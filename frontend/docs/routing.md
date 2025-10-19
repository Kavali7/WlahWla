# Routing Overview

The frontend now uses React Router v6 with a central configuration in `src/router.tsx`. Routes are organised as follows:

- `/login` exposes a lightweight form that stores a temporary token until the real auth flow is plugged in.
- `/dashboard`, `/storefront` and `/admin/*` are protected by `ProtectedRoute`, which checks `localStorage` for `authToken` via helpers in `src/lib/auth.ts`.
- `/admin` contains nested routes for `products`, `customers`, `invoices` and `settings`. The shared sidebar is declared in the router so every sub-route benefits from the same navigation.

### Adding a protected route

1. Create your page component inside `src/pages`.
2. Import it lazily inside `src/router.tsx` and wrap it with `withSuspense(...)` so code-splitting remains effective.
3. Add a route object under the protected branch (inside the `/` root). Provide a `handle.layout` block to expose the page title, description and optional sidebar/actions to the layout.
4. If the route should be public (for example onboarding), place it outside of the protected branch so it is not wrapped by `ProtectedRoute`.

> Tip: When you replace the fake login, reuse the helpers from `src/lib/auth.ts` to write and clear the token so `ProtectedRoute` keeps working without changes.
