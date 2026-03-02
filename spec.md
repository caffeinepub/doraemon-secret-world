# Specification

## Summary
**Goal:** Fix all broken audio playback — background music (BGM) and click/tap sound effects are not playing anywhere in the app.

**Planned changes:**
- Fix the `useBGM` hook so background music reliably loads and starts playing on the Dashboard page after the first user interaction, and correctly reflects play/pause state in `FloatingMusicControl`.
- Fix the `useDoubleKnockSound` and `useClickSound` hooks so click/tap sounds play on every user interaction throughout the app.
- Fix page-specific sounds: hello sound in `ChatPage`, unlock sound in `LockScreen`, and audio in `OurMemoriesPage`.
- Audit all audio file references across hooks and pages and ensure every referenced file exists in the correct public assets directory.
- Replace any missing audio files with the provided assets or synthesize sounds via the Web Audio API where needed.
- Ensure all audio hooks gracefully handle autoplay restrictions and unavailable audio without crashing.

**User-visible outcome:** Background music plays on the Dashboard after the first interaction, click/tap sounds are heard throughout the app, and all page-specific sounds trigger correctly with no console or network errors.
