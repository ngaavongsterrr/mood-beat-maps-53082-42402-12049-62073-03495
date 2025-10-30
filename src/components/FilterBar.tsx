import { Button } from '@/components/ui/button';
import { getCategoryLabel, type SpotCategory } from '@/data/spots';

interface FilterBarProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories: SpotCategory[] = ['peaceful', 'social', 'scenic'];

const FilterBar = ({ selectedCategory, onCategoryChange }: FilterBarProps) => {
  const handleCategoryChange = (category: string | null) => {
    onCategoryChange(category);
    window.dispatchEvent(new CustomEvent('tutorial-category-change'));
  };

  return (
    <div className="bg-background/90 dark:bg-background/90 backdrop-blur-md border-b border-border h-16 flex items-center px-4 gap-3 overflow-x-auto">
      <span className="text-sm font-medium text-muted-foreground shrink-0">
        Filter:
      </span>
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange(null)}
          className="rounded-full min-h-[44px]"
        >
          All Spots
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(category)}
            className="rounded-full min-h-[44px] capitalize"
          >
            {getCategoryLabel(category)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
