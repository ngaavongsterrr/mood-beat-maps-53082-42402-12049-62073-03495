import { useEffect, useRef, useState } from 'react';
import { SpotCategory } from '@/data/spots';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPlaylists } from '@/data/mockData';
import { X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodVisualizerProps {
  category: SpotCategory;
  isPlaying?: boolean;
}

type EmotionType = 'happy' | 'neutral' | 'sad' | 'angry' | 'love';
type MoodStage = 'before' | 'during' | 'after';

interface MoodEntry {
  stage: MoodStage;
  emotion: EmotionType;
  timestamp: Date;
}

const emotions = [
  { 
    id: 'happy' as EmotionType, 
    emoji: '😊', 
    label: 'Happy', 
    color: 'hsl(var(--emotion-positive))', 
    positive: true,
    animation: 'animate-bounce-gentle'
  },
  { 
    id: 'neutral' as EmotionType, 
    emoji: '😐', 
    label: 'Neutral', 
    color: 'hsl(var(--emotion-neutral))', 
    positive: false,
    animation: 'animate-pulse-steady'
  },
  { 
    id: 'sad' as EmotionType, 
    emoji: '😢', 
    label: 'Sad', 
    color: 'hsl(220, 60%, 40%)', 
    positive: false,
    animation: 'animate-sway-slow'
  },
  { 
    id: 'angry' as EmotionType, 
    emoji: '😡', 
    label: 'Angry', 
    color: 'hsl(var(--emotion-negative))', 
    positive: false,
    animation: 'animate-shake-fast'
  },
  { 
    id: 'love' as EmotionType, 
    emoji: '😍', 
    label: 'Love', 
    color: 'hsl(var(--emotion-love))', 
    positive: true,
    animation: 'animate-glow-warm'
  },
];

const stagePrompts = {
  before: "How does this playlist make you feel before starting your journey?",
  during: "How does this playlist feel while exploring?",
  after: "How well does this playlist match the location's atmosphere?"
};

const MoodVisualizer = ({ category, isPlaying = true }: MoodVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentStage, setCurrentStage] = useState<MoodStage>('before');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(mockPlaylists[0].id);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const moodRef = useRef<EmotionType | null>(null);
  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation parameters based on category and mood
    let particles: Particle[] = [];
    let animationId: number;
    
    const getMoodModifier = (mood: EmotionType | null) => {
      if (!mood) return { speedMultiplier: 1, sizeMultiplier: 1, opacityBoost: 0, baseColor: null };
      
      const emotion = emotions.find(e => e.id === mood);
      if (!emotion) return { speedMultiplier: 1, sizeMultiplier: 1, opacityBoost: 0, baseColor: null };
      
      switch (mood) {
        case 'happy':
          return { speedMultiplier: 1.3, sizeMultiplier: 1.1, opacityBoost: 0.1, baseColor: emotion.color };
        case 'neutral':
          return { speedMultiplier: 0.8, sizeMultiplier: 1, opacityBoost: 0, baseColor: emotion.color };
        case 'sad':
          return { speedMultiplier: 0.5, sizeMultiplier: 0.9, opacityBoost: -0.1, baseColor: emotion.color };
        case 'angry':
          return { speedMultiplier: 2, sizeMultiplier: 0.8, opacityBoost: 0.15, baseColor: emotion.color };
        case 'love':
          return { speedMultiplier: 1.2, sizeMultiplier: 1.2, opacityBoost: 0.2, baseColor: emotion.color };
      }
    };

    class BurstParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;
      emoji: string;

      constructor(x: number, y: number, emoji: string, color: string) {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.size = Math.random() * 30 + 20;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2;
        this.color = color;
        this.life = 0;
        this.maxLife = 60;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2; // gravity
        this.life++;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = 1 - (this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText(this.emoji, this.x, this.y);
        ctx.restore();
      }

      isDead() {
        return this.life >= this.maxLife;
      }
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      angle: number;
      angleSpeed: number;

      constructor(canvas: HTMLCanvasElement, category: SpotCategory) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        const mood = getMoodModifier(moodRef.current);
        const baseColor = mood.baseColor;
        
        switch (category) {
          case 'peaceful':
            this.size = (Math.random() * 30 + 20) * mood.sizeMultiplier;
            this.speedX = (Math.random() - 0.5) * 0.3 * mood.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * 0.3 * mood.speedMultiplier;
            this.color = baseColor || `hsla(222, 66%, 55%, ${Math.random() * 0.3 + 0.1 + mood.opacityBoost})`;
            this.angleSpeed = (Math.random() - 0.5) * 0.01 * mood.speedMultiplier;
            break;
          case 'social':
            this.size = (Math.random() * 20 + 10) * mood.sizeMultiplier;
            this.speedX = (Math.random() - 0.5) * 2 * mood.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * 2 * mood.speedMultiplier;
            this.color = baseColor || `hsla(340, 80%, 60%, ${Math.random() * 0.4 + 0.2 + mood.opacityBoost})`;
            this.angleSpeed = (Math.random() - 0.5) * 0.05 * mood.speedMultiplier;
            break;
          case 'scenic':
            this.size = (Math.random() * 40 + 25) * mood.sizeMultiplier;
            this.speedX = (Math.random() - 0.5) * 1 * mood.speedMultiplier;
            this.speedY = (Math.random() - 0.5) * 1 * mood.speedMultiplier;
            this.color = baseColor || `hsla(160, 70%, 50%, ${Math.random() * 0.3 + 0.15 + mood.opacityBoost})`;
            this.angleSpeed = (Math.random() - 0.5) * 0.03 * mood.speedMultiplier;
            break;
        }
        
        this.angle = Math.random() * Math.PI * 2;
      }

      update(canvas: HTMLCanvasElement) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.angleSpeed;

        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }

      draw(ctx: CanvasRenderingContext2D, category: SpotCategory) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        switch (category) {
          case 'peaceful':
            // Soft circles
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
          case 'social':
            // Dynamic squares
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            break;
          case 'scenic':
            // Flowing shapes
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 * i) / 6;
              const x = Math.cos(angle) * this.size;
              const y = Math.sin(angle) * this.size;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
        }

        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = category === 'peaceful' ? 8 : category === 'social' ? 15 : 12;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, category));
    }

    let localBurstParticles: BurstParticle[] = [];

    // Animation loop
    const animate = () => {
      if (!isPlaying) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(canvas);
        particle.draw(ctx, category);
      });

      // Update and draw burst particles
      localBurstParticles = localBurstParticles.filter(bp => {
        bp.update();
        bp.draw(ctx);
        return !bp.isDead();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Listen for burst particle events
    const handleBurstEvent = (event: CustomEvent) => {
      const { x, y, emoji, color } = event.detail;
      for (let i = 0; i < 8; i++) {
        localBurstParticles.push(new BurstParticle(x, y, emoji, color));
      }
    };

    canvas.addEventListener('moodBurst' as any, handleBurstEvent as any);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('moodBurst' as any, handleBurstEvent as any);
      cancelAnimationFrame(animationId);
    };
  }, [category, isPlaying, selectedMood]);

  // Periodic reminder effect
  useEffect(() => {
    if (!selectedMood) {
      reminderTimerRef.current = setInterval(() => {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 3000);
      }, 15000);
    }

    return () => {
      if (reminderTimerRef.current) {
        clearInterval(reminderTimerRef.current);
      }
    };
  }, [selectedMood]);

  const handleMoodSelect = (mood: EmotionType) => {
    setSelectedMood(mood);
    moodRef.current = mood;
    setShowOverlay(false);
    
    // Save mood entry for current stage
    const newEntry: MoodEntry = {
      stage: currentStage,
      emotion: mood,
      timestamp: new Date()
    };
    setMoodEntries(prev => [...prev.filter(e => e.stage !== currentStage), newEntry]);
    
    setShowConfirmation(true);
    
    // Trigger burst effect
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;
      const emotion = emotions.find(e => e.id === mood);
      if (emotion) {
        const event = new CustomEvent('moodBurst', {
          detail: { x, y, emoji: emotion.emoji, color: emotion.color }
        });
        canvas.dispatchEvent(event);
      }
    }
    
    setTimeout(() => {
      setShowConfirmation(false);
      setShowSubmitPrompt(true);
    }, 2000);
  };

  const handleContinue = () => {
    setShowSubmitPrompt(false);
    
    // Move to next stage
    if (currentStage === 'before') {
      setCurrentStage('during');
      setSelectedMood(null);
      moodRef.current = null;
    } else if (currentStage === 'during') {
      setCurrentStage('after');
      setSelectedMood(null);
      moodRef.current = null;
    }
  };

  const handleSaveToJournal = () => {
    const playlist = mockPlaylists.find(p => p.id === selectedPlaylist);
    
    // Create journal entry data
    const journalEntry = {
      playlistName: playlist?.name,
      category,
      moodEntries,
      timestamp: new Date()
    };
    
    // Save to localStorage for journal access
    const existingEntries = JSON.parse(localStorage.getItem('moodJournalEntries') || '[]');
    localStorage.setItem('moodJournalEntries', JSON.stringify([...existingEntries, journalEntry]));
    
    toast({
      title: "Journey Saved! 🎵",
      description: `${playlist?.name} mood journey saved to your journal`,
    });
    
    setShowSubmitPrompt(false);
    setShowSaveConfirmation(true);
    
    setTimeout(() => {
      setShowSaveConfirmation(false);
      // Reset for new journey
      setMoodEntries([]);
      setCurrentStage('before');
      setSelectedMood(null);
      moodRef.current = null;
    }, 2000);
  };

  const handleClose = () => {
    setShowOverlay(false);
    setShowSubmitPrompt(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showOverlay && !showConfirmation) {
      setShowOverlay(true);
    }
  };

  const currentPlaylist = mockPlaylists.find(p => p.id === selectedPlaylist);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm">
      {/* Playlist Selector */}
      <div className="absolute top-4 left-4 z-30">
        <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
          <SelectTrigger className="w-[200px] bg-black/60 backdrop-blur-md border-white/20 text-white">
            <SelectValue placeholder="Select playlist" />
          </SelectTrigger>
          <SelectContent>
            {mockPlaylists.map(playlist => (
              <SelectItem key={playlist.id} value={playlist.id}>
                {playlist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentPlaylist && (
          <p className="text-xs text-white/60 mt-1">
            {currentPlaylist.songs.length} songs • {currentPlaylist.dominantMood}
          </p>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
      />

      {/* Periodic Reminder */}
      {showReminder && !selectedMood && !showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-fade-in">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20 animate-pulse">
            <p className="text-white/80 text-sm font-medium">
              Tap to share how you feel 💭
            </p>
          </div>
        </div>
      )}
      
      {/* Emotion Selection Overlay */}
      {showOverlay && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center animate-fade-in z-10"
        >
          <div 
            className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 max-w-sm mx-4 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Stage indicator */}
            <div className="text-center mb-4">
              <div className="flex justify-center gap-2 mb-3">
                {(['before', 'during', 'after'] as MoodStage[]).map((stage) => (
                  <div 
                    key={stage}
                    className={`h-2 w-12 rounded-full transition-all ${
                      currentStage === stage 
                        ? 'bg-primary' 
                        : moodEntries.some(e => e.stage === stage)
                        ? 'bg-primary/50'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {currentStage === 'before' && 'Before Journey'}
                {currentStage === 'during' && 'During Journey'}
                {currentStage === 'after' && 'After Journey'}
              </p>
            </div>

            <h3 className="text-lg font-medium text-center mb-6 text-foreground">
              {stagePrompts[currentStage]}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.id}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-6 hover:scale-110 transition-all border-white/20 bg-background/50 hover:bg-background/80 relative group"
                  style={{ 
                    borderColor: emotion.positive ? 'hsl(var(--emotion-positive) / 0.3)' : 'hsl(var(--emotion-negative) / 0.3)'
                  }}
                  onClick={() => handleMoodSelect(emotion.id)}
                >
                  <span className={`text-4xl ${emotion.animation}`}>
                    {emotion.emoji}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Prompt */}
      {showSubmitPrompt && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center animate-fade-in z-10"
        >
          <div 
            className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 max-w-md mx-4 animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-center space-y-4">
              <div className={`text-5xl mb-4 ${emotions.find(e => e.id === selectedMood)?.animation}`}>
                {emotions.find(e => e.id === selectedMood)?.emoji}
              </div>
              <h3 className="text-lg font-medium text-foreground">
                {emotions.find(e => e.id === selectedMood)?.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {mockPlaylists.find(p => p.id === selectedPlaylist)?.name}
              </p>

              {/* Mood journey progress */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {moodEntries.map((entry) => (
                  <div key={entry.stage} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{entry.stage}:</span>
                    <span className="flex items-center gap-2">
                      {emotions.find(e => e.id === entry.emotion)?.emoji}
                      <span className="text-foreground">{emotions.find(e => e.id === entry.emotion)?.label}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                {currentStage !== 'after' ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleClose}
                    >
                      Continue Listening
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleContinue}
                    >
                      Next Stage
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleSaveToJournal}
                    >
                      <Save className="w-4 h-4" />
                      Save Journey
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation */}
      {showSaveConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-background/90 backdrop-blur-md rounded-2xl px-8 py-6 shadow-lg border border-white/10 animate-scale-in">
            <p className="text-lg font-medium text-foreground flex items-center gap-3">
              <Save className="w-5 h-5 text-primary" />
              Journey saved to journal! 
              <span className="text-2xl">🎵</span>
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-background/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/10 animate-fade-in">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              Mood captured 
              <span className="text-lg">
                {emotions.find(e => e.id === selectedMood)?.emoji}
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 text-white/60 text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {category === 'peaceful' && '🌊 Peaceful'}
        {category === 'social' && '✨ Social'}
        {category === 'scenic' && '🌄 Scenic'}
      </div>

      {selectedMood && !showOverlay && !showConfirmation && !showSubmitPrompt && !showSaveConfirmation && (
        <div className="absolute top-4 right-4 text-white/80 text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className={`text-base ${emotions.find(e => e.id === selectedMood)?.animation}`}>
            {emotions.find(e => e.id === selectedMood)?.emoji}
          </span>
          <span className="text-xs text-white/60 capitalize">{currentStage}</span>
        </div>
      )}
    </div>
  );
};

export default MoodVisualizer;
