# CARD-013 — Admin Login

**Status:** 🟢 Ready (Phase 2 — prerequisite for all admin CRUD)

## Summary
Add a login button and an admin-only auth flow. Only a single admin user exists. This unlocks the CRUD cards (014–016).

## Instructions
1. **Serverless scaffolding:** create `/api` folder (Vercel auto-deploys serverless functions — no new hosting).
2. **Login endpoint:** `POST /api/admin/login` validates the submitted password against `ADMIN_PASSWORD_HASH` (bcrypt) from env. On success, set a JWT in an **httpOnly** cookie (signed with `JWT_SECRET`).
3. **Middleware:** shared verifier for all `/api/admin/*` routes that checks/validates the cookie; reject unauthenticated requests with 401.
4. **Frontend:** add a login button/entry and an `/admin` route guarded client-side (redirect to login if no valid session). A subtle login affordance — this is a personal portfolio, not a public product.
5. **Env vars** (`.env`, Phase 2): `ADMIN_PASSWORD_HASH`, `JWT_SECRET` (see `features.md`).

## Acceptance criteria
- [ ] `/api` serverless functions deploy on Vercel.
- [ ] Correct password → JWT set in httpOnly cookie; wrong password → 401, no token.
- [ ] `/admin` route is inaccessible without a valid session (client guard + server middleware).
- [ ] All `/api/admin/*` routes reject requests lacking a valid cookie.
- [ ] Secrets only in env vars — never committed, never shipped to the client bundle.
- [ ] All libs are FOSS (`jsonwebtoken`/`jose`, `bcryptjs`).

## Nuances & considerations
- **FOSS / no external auth service** — roll auth with JWT + bcrypt, no Auth0/Clerk/etc.
- httpOnly cookie (not localStorage) to mitigate XSS token theft; set `Secure` + `SameSite`.
- Client-side route guard is UX only — real enforcement is the server middleware on `/api/admin/*`.
- Add basic rate limiting on the login endpoint (in-memory sliding window per IP) to slow brute force.
- Generate `ADMIN_PASSWORD_HASH` with bcrypt offline; document the one-liner in the repo (not the plaintext).

## Files likely touched
- New: `api/admin/login.ts`, `api/_middleware`/shared auth util
- New: `src/pages` or route for `/admin`, login UI component
- `.env` (local), Vercel project env settings
