# Verification — Loop Dog Lab

## Static Gates

```bash
npm run test
npm run lint
npm run build
```

## Browser Smoke

Start preview:

```bash
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```

Verify in browser:

```js
document.querySelector('[data-app="loop-dog-lab"]') !== null
```

Interaction checks:

1. Click a project category filter and confirm visible project cards change.
2. Click `Search Router` project card and confirm `[data-selected-project="search-router"]`.
3. Confirm the selected project panel shows `Problem`, `Loop`, `Harness / Evidence`, `Next Step`, and `Repo / Workspace Note`.
4. Confirm the Ralph Evidence strip shows `Built`, `Verified`, and `User-validated`.
5. Click `/goal` and `/ralph` buttons and confirm `[data-mode-card]` changes.
6. Confirm console has zero JavaScript errors.

## Visual QA

First screen should read as:

- premium AI product lab, not generic resume;
- cute puppy mascot identity;
- loop/harness engineering concept;
- clear route to side projects.
