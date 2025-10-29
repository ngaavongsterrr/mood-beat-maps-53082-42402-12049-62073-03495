import { useState, useEffect } from 'react';
import MapView from '@/components/MapView';
import JournalView from '@/components/JournalView';
import ModeToggle from '@/components/ModeToggle';

const Index = () => {
  const [mode, setMode] = useState<'campus' | 'nationwide' | 'global' | 'journal'>('campus');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Session management: Clear journal entries on new session
  useEffect(() => {
    const sessionId = sessionStorage.getItem('appSessionId');
    
    if (!sessionId) {
      // New session - clear previous journal entries
      localStorage.removeItem('moodJournalEntries');
      localStorage.removeItem('selectedPlaylistCategory');
      localStorage.removeItem('selectedSpotifyPlaylistName');
      localStorage.removeItem('selectedLocationTitle');
      localStorage.removeItem('spotifyPlaylistActive');
      
      // Set new session ID
      sessionStorage.setItem('appSessionId', Date.now().toString());
    }
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Main Content */}
      <div className="h-full w-full">
        {mode === 'journal' ? (
          <JournalView 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        ) : (
          <MapView 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            mapMode={mode}
          />
        )}
      </div>

      {/* Mode Toggle */}
      <ModeToggle mode={mode} onModeChange={setMode} />
    </div>
  );
};

export default Index;
