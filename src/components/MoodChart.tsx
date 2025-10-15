import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockSongs, getMoodColor } from "@/data/mockData";

const MoodChart = () => {
  const moodData = mockSongs.reduce((acc, song) => {
    const existing = acc.find(item => item.mood === song.mood);
    if (existing) {
      existing.count += 1;
      existing.totalEnergy += song.energy;
    } else {
      acc.push({ 
        mood: song.mood, 
        count: 1, 
        totalEnergy: song.energy,
        avgEnergy: song.energy 
      });
    }
    return acc;
  }, [] as Array<{ mood: string; count: number; totalEnergy: number; avgEnergy: number }>);

  // Calculate average energy for each mood
  moodData.forEach(item => {
    item.avgEnergy = Math.round(item.totalEnergy / item.count);
  });

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Mood Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="mood" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {moodData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MoodChart;
