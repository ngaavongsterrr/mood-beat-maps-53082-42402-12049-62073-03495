import { Map, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  mode: 'map' | 'journal';
  onModeChange: (mode: 'map' | 'journal') => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="fixed bottom-24 left-4 z-30 bg-background border border-border rounded-full shadow-lg p-1 flex gap-1">
      <Button
        variant={mode === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('map')}
        className="rounded-full min-h-[44px] min-w-[44px]"
        aria-label="Map view"
      >
        <Map className="w-5 h-5" />
        <span className="ml-2 hidden sm:inline">Map</span>
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
