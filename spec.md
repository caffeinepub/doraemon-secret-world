# Specification

## Summary
**Goal:** Update the backend passphrase to `Nobita` so that only this exact value grants access through the lock screen.

**Planned changes:**
- Update the hardcoded passphrase in the backend actor's verification function to accept exactly `Nobita` (case-sensitive)
- Any input other than `Nobita` will return false and deny access

**User-visible outcome:** The lock screen grants access when the user enters `Nobita` and denies access for any other input.
