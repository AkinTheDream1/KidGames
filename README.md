# Scoop & Count

A joyful, movement-based math game for children ages 3–6. Learners count scoops, recognize numbers, solve early addition problems, collect rewards, and take regular dance breaks.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Spotify (optional)

The game works without Spotify and links families to a Spotify search as a fallback. To enable in-app song discovery, create a Spotify developer app using the Authorization Code flow with PKCE and add:

```bash
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

Add the same redirect URI to the Spotify app dashboard. Full-track playback depends on Spotify account and Web Playback SDK eligibility; when a preview is unavailable, the app opens the selected song in Spotify.

## Quality checks

```bash
npm test
npm run build
```

Progress and rewards are stored locally on the device. No child profile or personal information is collected.
