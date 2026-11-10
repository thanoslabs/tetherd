# tether'd

**Every answer is connected.** Seven daily trivia questions, one letter chain. Fewest letters wins.

## Development

Node 22+: `npm install`, `npm run dev`, `npm test`, `npm run build`.

## Gameplay

Seven sequentially revealed prompts; each answer starts with the previous answer's final letter. Edit revealed answers to repair broken chains. Three hints per day offer a matching prefix or random eligible answer. Scores are total letter counts; optimize throughout the UTC day. Progress and best chain persist in local storage. Share results via browser sharing or clipboard.

## Deployment

Set **Settings → Pages → Source** to **GitHub Actions**. On merge to main, the game workflow builds and deploys to https://thanoslabs.github.io/tetherd/ with a direct game route at https://thanoslabs.github.io/tetherd/play.

## Content

18 starter questions in `src/questions.js` carry stable IDs, categories, difficulties, and curated answer pools. A deterministic daily selector verifies solvability using an exact chain solver. Accepted answer lists are curated and expandable. Future work: larger datasets, question cooldowns, difficulty calibration, and optional circular chains.

## Roadmap

### Future: Daily community leaderboard and tether distribution

Introduce an optional backend/API that collects submitted daily results and shows how the community performed on each puzzle. The primary visualization should be a **distribution of completed tether scores**, including the percentage of participating players who finished with each total letter count (and optionally the percentage matching a particular answer chain).

- **Submission:** after a valid seven-answer completion, submit the puzzle date/version, normalized answers or a server-verifiable representation, letter score, hint usage, and an anonymous per-player identifier. No account required.
- **Validation:** the server must verify answers against the published puzzle's question IDs and accepted answer set, chain links, uniqueness, and score. Never trust client-supplied scores or completion flags.
- **Deduplication:** one counted result per anonymous player per puzzle; allow a better result to replace a prior submission rather than inflating participation. Define how hints affect comparison before launch.
- **Privacy:** collect only the minimum necessary data, disclose collection, and avoid exposing individual answer sequences or identifiers publicly. Use opt-in submission initially.
- **Results:** show total participants, score histogram, percentage at each letter total, and the player's position within the distribution. Consider hiding live results until the daily puzzle ends to avoid influencing answers.
- **Operations:** rate limiting, basic abuse prevention, retention limits, and versioned puzzle manifests. Preserve the current static GitHub Pages frontend; deploy the API separately.

**Status:** Planned for a later milestone; not part of the current frontend MVP.
