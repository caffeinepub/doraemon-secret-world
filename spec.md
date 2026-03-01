# Specification

## Summary
**Goal:** Add auto-randomised quotes on page load, remove the 6th memory photo, add Home page BGM, and attach audio triggers for the Doraemon image click and Our Memories page entry.

**Planned changes:**
- On the Quotes & Fun Facts page, automatically load a randomly selected quote and fun fact on every page refresh/navigation, without requiring the user to click the refresh button.
- In the Our Memories gallery, remove the 6th photo (index 5) from the photo array so only the remaining photos are shown.
- On the Home/Dashboard page, play `Doremon_theme` as looping background BGM automatically when the page is active, and pause/stop it when navigating away.
- On the Home/Dashboard page, clicking the central Doraemon image plays `VID_20260301_052016.MP4` from the start on each click.
- On the Our Memories page, automatically play `VID_20260301_052623.MP4` once on page entry and stop it when navigating away.

**User-visible outcome:** The Quotes page always shows fresh random content on load; the Memories gallery has one fewer photo; the Home page plays background music; clicking Doraemon triggers a sound effect; and visiting Our Memories plays an audio clip automatically.
