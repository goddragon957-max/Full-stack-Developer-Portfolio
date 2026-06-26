# RUNBOOK — Loop Dog Lab

## Install

```bash
npm install
```

## Verify

```bash
npm run test
npm run lint
npm run build
```

## Local Preview

```bash
npm run preview -- --host 0.0.0.0 --port 4190 --strictPort
```

If the user needs a reachable local preview, bind to `0.0.0.0`, fetch the host/Tailscale IP, and report that URL instead of localhost.

## Vercel Deploy

Option A: connect a GitHub repository in Vercel and use:

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

Option B: Vercel CLI from this folder:

```bash
npx vercel --prod
```

Only claim live deployment after fetching the Vercel URL and confirming the HTML contains `Loop Dog Lab` or the loaded app contains `data-app="loop-dog-lab"`.
