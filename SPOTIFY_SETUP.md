# Spotify Integration Setup

To enable real-time Spotify playlist tracking in the mood visualizer, you need to set up a Spotify Developer application.

## Steps:

1. **Create a Spotify Developer Account**
   - Go to https://developer.spotify.com/dashboard
   - Log in with your Spotify account (or create one)

2. **Create a New App**
   - Click "Create app" button
   - Fill in:
     - App name: "Mood Journey Tracker" (or any name you prefer)
     - App description: "Personal mood and music tracking app"
     - Redirect URI: Add your app URL + `/spotify-callback`
       - For local development: `http://localhost:5173/spotify-callback`
       - For production: `https://yourdomain.com/spotify-callback`
     - Check "Web API" in the APIs used
   - Click "Save"

3. **Get Your Client ID**
   - On your app's dashboard, you'll see "Client ID"
   - Click "Show Client Secret" to see your secret (you won't need this for implicit grant flow)

4. **Update the Code**
   - Open `src/hooks/useSpotifyAuth.tsx`
   - Replace `'YOUR_SPOTIFY_CLIENT_ID'` with your actual Client ID
   - Example:
     ```typescript
     const CLIENT_ID = 'abc123def456ghi789jkl012mno345pq';
     ```

5. **Test the Integration**
   - Start your app
   - Click "Connect to Spotify" in the mood visualizer
   - Authorize the app
   - Play a Spotify playlist
   - Click "+Open in Spotify" on a matching playlist in the app
   - The mood visualizer should now be enabled!

## How It Works:

- The app checks every 5 seconds what's currently playing on your Spotify account
- When you click "+Open in Spotify", it stores the playlist category
- The mood visualizer is only enabled when:
  1. You're authenticated with Spotify
  2. A playlist is actually playing on Spotify
  3. The category of the playing playlist matches what you selected

## Privacy Note:

This integration only reads what you're currently playing. It does not:
- Control playback
- Access your playlists
- Modify anything in your Spotify account
- Share your listening data with anyone
