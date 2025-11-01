import { useState, useEffect } from 'react';
import MapView from '@/components/MapView';
import JournalView from '@/components/JournalView';
import ModeToggle from '@/components/ModeToggle';
import TutorialGuide from '@/components/TutorialGuide';
import { useTutorial } from '@/hooks/useTutorial';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const Index = () => {
  const [mode, setMode] = useState<'campus' | 'nationwide' | 'global' | 'journal'>('campus');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { 
    currentStep, 
    tutorialActive, 
    completeStep, 
    dismissCurrentStep, 
    skipAllSteps,
    startTutorial,
    highlightElement 
  } = useTutorial();

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

  // Tutorial step completion listeners
  useEffect(() => {
    const handleModeChange = () => {
      if (tutorialActive && currentStep === 'mode-toggle') {
        completeStep('mode-toggle');
      }
    };

    const handleCategoryChange = () => {
      if (tutorialActive && currentStep === 'location-filter') {
        completeStep('location-filter');
      }
    };

    const handlePinClick = () => {
      if (tutorialActive && currentStep === 'location-pins') {
        completeStep('location-pins');
      }
    };

    const handlePlaylistPreview = () => {
      if (tutorialActive && currentStep === 'playlist-tab') {
        completeStep('playlist-tab');
      }
    };

    const handleSpotifyOpen = () => {
      if (tutorialActive && currentStep === 'spotify-open') {
        completeStep('spotify-open');
      }
    };

    const handleMoodSelect = () => {
      if (tutorialActive && currentStep === 'mood-visualizer') {
        completeStep('mood-visualizer');
      }
    };

    const handleJourneySave = () => {
      if (tutorialActive && currentStep === 'mood-summary') {
        completeStep('mood-summary');
      }
    };

    const handleJournalEdit = () => {
      if (tutorialActive && currentStep === 'journal-tab') {
        completeStep('journal-tab');
      }
    };

    window.addEventListener('tutorial-mode-change', handleModeChange);
    window.addEventListener('tutorial-category-change', handleCategoryChange);
    window.addEventListener('tutorial-pin-click', handlePinClick);
    window.addEventListener('tutorial-playlist-preview', handlePlaylistPreview);
    window.addEventListener('tutorial-spotify-open', handleSpotifyOpen);
    window.addEventListener('tutorial-mood-select', handleMoodSelect);
    window.addEventListener('tutorial-journey-save', handleJourneySave);
    window.addEventListener('tutorial-journal-edit', handleJournalEdit);

    return () => {
      window.removeEventListener('tutorial-mode-change', handleModeChange);
      window.removeEventListener('tutorial-category-change', handleCategoryChange);
      window.removeEventListener('tutorial-pin-click', handlePinClick);
      window.removeEventListener('tutorial-playlist-preview', handlePlaylistPreview);
      window.removeEventListener('tutorial-spotify-open', handleSpotifyOpen);
      window.removeEventListener('tutorial-mood-select', handleMoodSelect);
      window.removeEventListener('tutorial-journey-save', handleJourneySave);
      window.removeEventListener('tutorial-journal-edit', handleJournalEdit);
    };
  }, [tutorialActive, currentStep, completeStep]);

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Main Content */}
      <div className="h-full w-full">
        {mode === 'journal' ? (
          <JournalView 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            highlightElement={highlightElement}
          />
        ) : (
          <MapView 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            mapMode={mode}
            highlightElement={highlightElement}
          />
        )}
      </div>

      {/* Help Button */}
      <Button
        onClick={startTutorial}
        size="icon"
        variant="outline"
        className="fixed top-4 right-4 z-50 rounded-full shadow-lg bg-card/95 backdrop-blur-sm hover:bg-card"
        aria-label="Start tutorial"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* Mode Toggle with tutorial highlight */}
      <div className={highlightElement('mode-toggle') ? 'tutorial-highlight' : ''}>
        <ModeToggle mode={mode} onModeChange={(newMode) => {
          setMode(newMode);
          window.dispatchEvent(new CustomEvent('tutorial-mode-change'));
        }} />
      </div>

      {/* Tutorial Guide */}
      {tutorialActive && (
        <TutorialGuide
          currentStep={currentStep}
          onDismiss={dismissCurrentStep}
          onComplete={skipAllSteps}
        />
      )}
    </div>
  );
};

export default Index;
