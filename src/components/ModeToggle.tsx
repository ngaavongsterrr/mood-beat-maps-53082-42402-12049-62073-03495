import { MapPin, Navigation, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  mode: 'campus' | 'currentLocation' | 'journal';
  onModeChange: (mode: 'campus' | 'currentLocation' | 'journal') => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="fixed bottom-24 left-4 z-30 bg-background border border-border rounded-full shadow-lg p-1 flex gap-1">
      <Button
        variant={mode === 'campus' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('campus')}
        className="rounded-full min-h-[44px] min-w-[44px]"
        aria-label="Campus map view"
      >
        <MapPin className="w-5 h-5" />
        <span className="ml-2 hidden sm:inline">Campus</span>
      </Button>
      <Button
        variant={mode === 'currentLocation' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('currentLocation')}
        className="rounded-full min-h-[44px] min-w-[44px]"
        aria-label="Current location view"
      >
        <Navigation className="w-5 h-5" />
        <span className="ml-2 hidden sm:inline">Near Me</span>
      </Button>
      <Button
        variant={mode === 'journal' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('journal')}
        className="rounded-full min-h-[44px] min-w-[44px]"
        aria-label="Journal view"
      >
        <BookOpen className="w-5 h-5" />
        <span className="ml-2 hidden sm:inline">Journal</span>
      </Button>
    </div>
  );
};

export default ModeToggle;
