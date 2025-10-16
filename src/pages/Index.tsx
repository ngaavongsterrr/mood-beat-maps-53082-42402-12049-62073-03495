import { useState } from 'react';
import MapView from '@/components/MapView';
import JournalView from '@/components/JournalView';
import ModeToggle from '@/components/ModeToggle';

const Index = () => {
  const [mode, setMode] = useState<'campus' | 'nationwide' | 'global' | 'journal'>('campus');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
