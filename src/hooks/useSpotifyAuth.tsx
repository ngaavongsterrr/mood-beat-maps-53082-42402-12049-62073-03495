import { useState, useEffect } from 'react';

const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // User needs to add this
const REDIRECT_URI = window.location.origin + '/spotify-callback';
const SCOPES = 'user-read-playback-state user-read-currently-playing';

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

interface SpotifyPlaybackState {
  is_playing: boolean;
  item: SpotifyTrack | null;
  context: {
    type: string;
    uri: string;
  } | null;
}

export const useSpotifyAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentPlayback, setCurrentPlayback] = useState<SpotifyPlaybackState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('spotify_access_token');
    const expiresAt = localStorage.getItem('spotify_token_expires');
    
    if (token && expiresAt) {
      const now = Date.now();
      if (now < parseInt(expiresAt)) {
        setAccessToken(token);
        setIsAuthenticated(true);
      } else {
        // Token expired
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expires');
      }
    }
    setIsLoading(false);
  }, []);

  // Poll for current playback every 5 seconds
  useEffect(() => {
    if (!accessToken) return;

    const fetchPlayback = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.status === 204 || response.status === 404) {
          // No active playback
          setCurrentPlayback(null);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setCurrentPlayback(data);
        } else if (response.status === 401) {
          // Token expired
          setIsAuthenticated(false);
          setAccessToken(null);
          localStorage.removeItem('spotify_access_token');
          localStorage.removeItem('spotify_token_expires');
        }
      } catch (error) {
        console.error('Error fetching playback:', error);
      }
    };

    fetchPlayback();
    const interval = setInterval(fetchPlayback, 5000);

    return () => clearInterval(interval);
  }, [accessToken]);

  const login = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setCurrentPlayback(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expires');
  };

  const handleCallback = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (token && expiresIn) {
      const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
      localStorage.setItem('spotify_access_token', token);
      localStorage.setItem('spotify_token_expires', expiresAt.toString());
      setAccessToken(token);
      setIsAuthenticated(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    currentPlayback,
    login,
    logout,
    handleCallback
  };
};
