import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (token && expiresIn) {
      const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
      localStorage.setItem('spotify_access_token', token);
      localStorage.setItem('spotify_token_expires', expiresAt.toString());
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('spotifyAuthenticated'));
      
      // Redirect back to home
      navigate('/');
    } else {
      // Authentication failed
      navigate('/?spotify_error=1');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Connecting to Spotify...</p>
      </div>
    </div>
  );
};

export default SpotifyCallback;
