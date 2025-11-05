import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  isOpen: boolean;
  onClose: () => void;
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

const tutorialSteps: { step: TutorialStep; content: typeof tutorialContent[TutorialStep] }[] = [
  { step: 'mode-toggle', content: tutorialContent['mode-toggle'] },
  { step: 'location-filter', content: tutorialContent['location-filter'] },
  { step: 'location-pins', content: tutorialContent['location-pins'] },
  { step: 'playlist-tab', content: tutorialContent['playlist-tab'] },
  { step: 'spotify-open', content: tutorialContent['spotify-open'] },
  { step: 'mood-visualizer', content: tutorialContent['mood-visualizer'] },
  { step: 'mood-summary', content: tutorialContent['mood-summary'] },
  { step: 'journal-tab', content: tutorialContent['journal-tab'] },
];

const TutorialGuide = ({ isOpen, onClose }: TutorialGuideProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Tutorial list dialog */}
      <div className="relative max-w-2xl w-full max-h-[80vh] bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">
            How to Use This App
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            aria-label="Close tutorial"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="h-full max-h-[calc(80vh-140px)]">
          <div className="p-6 space-y-4">
            {tutorialSteps.map(({ content }, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {content.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {content.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <Button onClick={onClose} className="w-full">
            Got it, let's start!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;
