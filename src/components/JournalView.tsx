import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image, Video, Pencil } from 'lucide-react';
import FilterBar from './FilterBar';
import { spots } from '@/data/spots';

interface JournalViewProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const JournalView = ({ selectedCategory, onCategoryChange }: JournalViewProps) => {
  const filteredSpots = selectedCategory
    ? spots.filter(spot => spot.category === selectedCategory)
    : spots;

  return (
    <div className="h-full w-full overflow-y-auto">
      {/* Filter Bar */}
      <div className="sticky top-0 z-20">
        <FilterBar 
          selectedCategory={selectedCategory} 
          onCategoryChange={onCategoryChange} 
        />
      </div>

      {/* Journal Grid */}
      <div className="container mx-auto p-4 md:p-6">
        {/* Add Card Button */}
        <div className="mb-6">
          <Button className="rounded-lg px-6 py-3 min-h-[44px]">
            <Plus className="w-5 h-5 mr-2" />
            Add Journal Card
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredSpots.map((spot) => (
            <Card key={spot.id} className="group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200">
              {/* Card Image */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold">{spot.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {spot.description}
                </p>

                {/* Card Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 min-h-[44px]">
                    <Image className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 min-h-[44px]">
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 min-h-[44px]">
                    <Pencil className="w-4 h-4 mr-2" />
                    Draw
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Empty state placeholder cards */}
          {[...Array(3)].map((_, i) => (
            <Card 
              key={`placeholder-${i}`}
              className="border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer min-h-[300px] flex items-center justify-center"
            >
              <div className="text-center space-y-2 p-6">
                <Plus className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Create a new journal card
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalView;
