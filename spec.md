# Specification

## Summary
**Goal:** Fix all broken sound effects (Dreamy.mp3, Hello.mp3, Double Knock.mp3) so they play correctly across the app in both development and production.

**Planned changes:**
- Ensure all three audio files (Dreamy.mp3, Hello.mp3, Double Knock.mp3) are placed under `frontend/public/assets/audio/` with correct filenames and extensions
- Update all audio file references in hooks and pages to use root-relative paths (e.g. `/assets/audio/Dreamy.mp3`) so they resolve correctly after production build
- Fix `Dreamy.mp3` playback on the Lock Screen so it triggers when the correct passcode is entered, complying with browser autoplay policies
- Fix `Hello.mp3` playback on the Chat page so it triggers on entering or interacting with the Chat section
- Fix `Double Knock.mp3` in `useDoubleKnockSound.ts` so it plays on every click/touch across all pages, with the Audio object preloaded and the 120ms throttle preserved
- Ensure no console errors related to audio loading or playback for any of the three files

**User-visible outcome:** All three sound effects play audibly as intended — the unlock sound on the Lock Screen, the greeting sound on the Chat page, and the click sound on every tap/click throughout the app — in both development and production environments.
