# tetherd.

**Every answer is connected.** Eight daily trivia questions, one letter chain. Fewest letters wins.

## Development

Node 22+: `npm install`, `npm run dev`, `npm test`, `npm run build`.

## Gameplay

Eight sequentially revealed prompts; each answer starts with the previous answer's final letter. Edit revealed answers to repair broken chains. Three hints per day offer a matching prefix or random eligible answer. Scores are total letter counts; optimize throughout the UTC day. Progress and best chain persist in local storage. Share results via browser sharing or clipboard.

## Deployment

Set **Settings → Pages → Source** to **GitHub Actions**. On merge to main, the game workflow builds and deploys to https://thanoslabs.github.io/tetherd/ with a direct game route at https://thanoslabs.github.io/tetherd/play.

## Content

18 starter questions in `src/questions.js` carry stable IDs, categories, difficulties, and curated answer pools. A deterministic daily selector verifies solvability using an exact chain solver. Accepted answer lists are intentionally limited for the prototype. Future work: larger datasets, question cooldowns, difficulty calibration, and optional circular chains.
