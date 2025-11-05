import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpotDetailsTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'Preview Playlists',
    description: 'Preview Spotify recommended playlists by pressing the play button or selecting a track.'
  },
  {
    title: 'Open in Spotify',
    description: 'Tap the Spotify logo or +Open in Spotify to open your playlist. Then return here to continue.'
  },
  {
    title: 'Record Your Mood',
    description: 'Select the playlist category you\'re playing, then tap the animated mood interface to start recording your mood.'
  },
  {
    title: 'Save Your Journey',
    description: 'Click Save Journey to add your entry to your journal.'
  },
  {
    title: 'Manage Your Entries',
    description: 'Press Edit to adjust details like playlist name or location; use the Photo button to download your summary as an image.'
  }
];

const SpotDetailsTutorial = ({ isOpen, onClose }: SpotDetailsTutorialProps) => {
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
            Spot Details Guide
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
            {tutorialSteps.map((content, index) => (
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
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpotDetailsTutorial;
