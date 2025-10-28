import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MapView from '@/components/MapView';
import JournalView from '@/components/JournalView';
import ModeToggle from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [mode, setMode] = useState<'campus' | 'nationwide' | 'global' | 'journal'>('campus');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you next time! 👋",
    });
    navigate('/auth');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          className="rounded-full"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

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
