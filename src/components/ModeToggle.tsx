import { BookOpen, Map, Globe, Notebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeToggleProps {
  mode: 'campus' | 'nationwide' | 'global' | 'journal';
  onModeChange: (mode: 'campus' | 'nationwide' | 'global' | 'journal') => void;
}

const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="fixed bottom-24 left-4 z-30 bg-background border border-border rounded-lg shadow-lg p-2 flex flex-col gap-2">
      <Button
        variant={mode === 'campus' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('campus')}
        className="justify-start min-h-[44px] w-full"
        aria-label="University campus map view"
      >
        <BookOpen className="w-5 h-5 mr-2" />
        <span className="text-sm">University Campus</span>
      </Button>
      <Button
        variant={mode === 'nationwide' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('nationwide')}
        className="justify-start min-h-[44px] w-full"
        aria-label="Nationwide map view"
      >
        <Map className="w-5 h-5 mr-2" />
        <span className="text-sm">Leeuwarden/NL</span>
      </Button>
      <Button
        variant={mode === 'global' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('global')}
        className="justify-start min-h-[44px] w-full"
        aria-label="Global map view"
      >
        <Globe className="w-5 h-5 mr-2" />
        <span className="text-sm">Global</span>
      </Button>
      <Button
        variant={mode === 'journal' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('journal')}
        className="justify-start min-h-[44px] w-full"
        aria-label="Journal view"
      >
        <Notebook className="w-5 h-5 mr-2" />
        <span className="text-sm">Journal</span>
      </Button>
    </div>
  );
};

export default ModeToggle;
