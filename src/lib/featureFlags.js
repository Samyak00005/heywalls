/**
 * Temporary feature flags — toggle these directly in code as the project
 * moves through phases. Not meant to be a permanent config system.
 */

// While true, only accounts with profiles.role = 'admin' can sign in.
// Meant for the pre-launch build phase — flip to false in Phase 6 when
// the site is ready for real users. Signup still works while this is on,
// so test accounts can be created and promoted to admin as needed.
export const ADMIN_ONLY_LOGIN = true
