import { BookOpen, Map, Globe, Notebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  mode: 'campus' | 'nationwide' | 'global' | 'journal';
  onModeChange: (mode: 'campus' | 'nationwide' | 'global' | 'journal') => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="fixed bottom-24 left-4 z-30 bg-background border border-border rounded-full shadow-lg p-1 flex gap-1">
      <Button
        variant={mode === 'campus' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('campus')}
        className="rounded-full min-h-[44px] min-w-[44px] px-3"
        aria-label="University campus map view"
      >
        <BookOpen className="w-5 h-5" />
        <span className="ml-2">Campus</span>
      </Button>
      <Button
        variant={mode === 'nationwide' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('nationwide')}
        className="rounded-full min-h-[44px] min-w-[44px] px-3"
        aria-label="Nationwide map view"
      >
        <Map className="w-5 h-5" />
        <span className="ml-2">NL</span>
      </Button>
      <Button
        variant={mode === 'global' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('global')}
        className="rounded-full min-h-[44px] min-w-[44px] px-3"
        aria-label="Global map view"
      >
        <Globe className="w-5 h-5" />
        <span className="ml-2">Global</span>
      </Button>
      <Button
        variant={mode === 'journal' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('journal')}
        className="rounded-full min-h-[44px] min-w-[44px] px-3"
        aria-label="Journal view"
      >
        <Notebook className="w-5 h-5" />
        <span className="ml-2">Journal</span>
      </Button>
    </div>
  );
};

export default ModeToggle;
