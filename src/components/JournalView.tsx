import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image, Video, Pencil, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import FilterBar from './FilterBar';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface JournalViewProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

interface JournalCard {
  id: string;
  playlistName?: string;
  category: string;
  moodEntries: Array<{
    stage: string;
    emotion: string;
    timestamp: string;
  }>;
  timestamp: string;
  summaryImage?: string;
  summaryData?: {
    before?: { stage: string; emotion: string; timestamp: Date };
    during?: { stage: string; emotion: string; timestamp: Date };
    after?: { stage: string; emotion: string; timestamp: Date };
  };
}

const JournalView = ({ selectedCategory, onCategoryChange }: JournalViewProps) => {
  const { toast } = useToast();
  const [journalCards, setJournalCards] = useState<JournalCard[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Load journal cards from database
  useEffect(() => {
    loadJournalCards();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('journal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
        },
        () => {
          loadJournalCards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadJournalCards = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading journal entries:', error);
      toast({
        title: "Error loading entries",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      const formattedCards = data.map(entry => ({
        id: entry.id,
        playlistName: entry.playlist_name || undefined,
        category: entry.category,
        moodEntries: (entry.mood_entries as any) || [],
        timestamp: entry.created_at,
        summaryImage: entry.summary_image || undefined,
        summaryData: (entry.summary_data as any) || undefined,
      }));
      setJournalCards(formattedCards);
    }
  };

  const handlePhotoUpload = async (cardId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageData = event.target?.result as string;
          
          // Update the card in the database
          const { error } = await supabase
            .from('journal_entries')
            .update({ summary_image: imageData })
            .eq('id', cardId);

          if (error) {
            toast({
              title: "Error uploading photo",
              description: error.message,
              variant: "destructive",
            });
            return;
          }
          
          toast({
            title: "Photo added! 📸",
            description: "Your journey photo has been saved",
          });
          
          loadJournalCards();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDownloadImage = (imageData: string, playlistName: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `${playlistName}-journey.png`;
    link.click();
    
    toast({
      title: "Downloaded! 💾",
      description: "Journey saved to your device",
    });
  };

  const filteredCards = selectedCategory
    ? journalCards.filter(card => card.category === selectedCategory)
    : journalCards;

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
          {filteredCards.map((card) => (
            <Card key={card.id} className="group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200">
              {/* Card Image */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                {card.summaryImage ? (
                  <img 
                    src={card.summaryImage}
                    alt={card.playlistName || 'Journey'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <div className="text-center space-y-2">
                      <Image className="w-12 h-12 mx-auto text-muted-foreground/40" />
                      <p className="text-xs text-muted-foreground">No photo yet</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold">{card.playlistName || 'Mood Journey'}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {new Date(card.timestamp).toLocaleDateString()} • {card.moodEntries.length} emotions
                  </p>
                  <p className="text-xs font-medium text-muted-foreground capitalize">
                    {card.category === 'peaceful' && '🌊 Peaceful'}
                    {card.category === 'social' && '✨ Social'}
                    {card.category === 'scenic' && '🌄 Scenic'}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-h-[44px]"
                    onClick={() => {
                      if (card.summaryImage) {
                        setSelectedImage(card.summaryImage);
                        setSelectedCardId(card.id);
                      } else {
                        handlePhotoUpload(card.id);
                      }
                    }}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 min-h-[44px]" disabled>
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 min-h-[44px]" disabled>
                    <Pencil className="w-4 h-4 mr-2" />
                    Draw
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Empty state placeholder cards */}
          {[...Array(Math.max(1, 6 - filteredCards.length))].map((_, i) => (
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

      {/* Image Viewer Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            {selectedImage && (
              <>
                <img 
                  src={selectedImage} 
                  alt="Journey summary"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-4 right-4">
                  <Button
                    onClick={() => {
                      const card = journalCards.find(c => c.id === selectedCardId);
                      if (selectedImage && card) {
                        handleDownloadImage(selectedImage, card.playlistName || 'journey');
                      }
                    }}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JournalView;
