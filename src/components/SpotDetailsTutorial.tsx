import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createPortal } from 'react-dom';

interface SpotDetailsTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'Preview Playlists',
    description: 'In the Playlists tab, preview Spotify recommended playlists by pressing the play button or selecting a track.',
    tab: 'Playlists Tab'
  },
  {
    title: 'Select & Open Playlist',
    description: 'Choose a playlist that inspires you and tap "+Open in Spotify" to open it in your Spotify app. This will enable the Navigate to Location button and activate the Mood Visualizer.',
    tab: 'Playlists Tab'
  },
  {
    title: 'Navigate to Location',
    description: 'After opening a playlist, use the Navigate to Location button to open the spot in your GPS app (Apple Maps, Google Maps, or Waze).',
    tab: 'Playlists Tab'
  },
  {
    title: 'Record Your Mood',
    description: 'Switch to the Mood Visualizer tab and tap the animated mood interface to start recording your current mood while listening to your selected playlist.',
    tab: 'Mood Visualizer Tab'
  },
  {
    title: 'Save Your Journey',
    description: 'Click Save Journey in the Mood Visualizer to add your entry to your journal.',
    tab: 'Mood Visualizer Tab'
  },
  {
    title: 'Manage Your Entries',
    description: 'Switch to Journal mode to view all entries. Press Edit to adjust details like playlist name or location; use the Photo button to download your summary as an image.',
    tab: 'Journal Mode'
  }
];

const SpotDetailsTutorial = ({ isOpen, onClose }: SpotDetailsTutorialProps) => {
  if (!isOpen) return null;

  const tutorialContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Tutorial dialog */}
      <div className="relative max-w-2xl w-full max-h-[80vh] flex flex-col bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
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
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 space-y-4">
            {tutorialSteps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {step.tab}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t border-border flex-shrink-0">
          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(tutorialContent, document.body);
};

export default SpotDetailsTutorial;
