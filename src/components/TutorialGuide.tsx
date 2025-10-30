import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type TutorialStep = 
  | 'mode-toggle' 
  | 'location-filter' 
  | 'location-pins' 
  | 'playlist-tab' 
  | 'spotify-open' 
  | 'mood-visualizer' 
  | 'mood-summary' 
  | 'journal-tab';

interface TutorialGuideProps {
  currentStep: TutorialStep | null;
  onDismiss: () => void;
  onComplete: () => void;
  targetRef?: React.RefObject<HTMLElement>;
}

const tutorialContent: Record<TutorialStep, { title: string; description: string }> = {
  'mode-toggle': {
    title: 'Navigate to Your Mode',
    description: 'Navigate to the mode of your current location (campus: NHL Stenden Leeuwarden, Netherlands, Global) to show outdoor spots in your area.'
  },
  'location-filter': {
    title: 'Select Location Category',
    description: 'Select a location category to display location pins that match your preference (optional).'
  },
  'location-pins': {
    title: 'Tap Location Pins',
    description: 'Tap an outdoor location pin to view spot details.'
  },
  'playlist-tab': {
    title: 'Preview Playlists',
    description: 'Preview Spotify recommended playlists by pressing the play button or selecting a track.'
  },
  'spotify-open': {
    title: 'Open in Spotify',
    description: 'Tap the Spotify logo or +Open in Spotify to open your playlist. Then return here to continue.'
  },
  'mood-visualizer': {
    title: 'Record Your Mood',
    description: 'Select the playlist category you\'re playing, then tap the animated mood interface to start recording your mood.'
  },
  'mood-summary': {
    title: 'Save Your Journey',
    description: 'Click Save Journey to add your entry to your journal.'
  },
  'journal-tab': {
    title: 'Manage Your Entries',
    description: 'Press Edit to adjust details like playlist name or location; use the Photo button to download your summary as an image.'
  }
};

const TutorialGuide = ({ currentStep, onDismiss, onComplete }: TutorialGuideProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentStep) {
      // Fade in
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [currentStep]);

  if (!currentStep) return null;

  const content = tutorialContent[currentStep];

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 250);
  };

  const handleSkipAll = () => {
    setIsVisible(false);
    setTimeout(onComplete, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none transition-opacity duration-250 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Translucent backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm pointer-events-auto" onClick={handleDismiss} />
      
      {/* Tutorial pop-up */}
      <div
        className={`relative max-w-md w-full bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-6 pointer-events-auto transition-all duration-250 ease-in-out ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8"
          onClick={handleDismiss}
          aria-label="Dismiss tutorial step"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="pr-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {content.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {content.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleDismiss}
              className="flex-1"
            >
              Got it
            </Button>
            <Button
              variant="outline"
              onClick={handleSkipAll}
            >
              Skip All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;
