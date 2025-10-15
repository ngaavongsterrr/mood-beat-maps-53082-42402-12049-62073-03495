import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { mockSongs } from "@/data/mockData";

const EnergyTrendChart = () => {
  const energyData = mockSongs.map((song, index) => ({
    index: index + 1,
    energy: song.energy,
    title: song.title,
    artist: song.artist,
  }));

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
        Energy Levels Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={energyData}>
          <defs>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="index" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--foreground))' }}
            label={{ value: 'Song Index', position: 'insideBottom', offset: -5, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--foreground))' }}
            label={{ value: 'Energy', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: any, name: string, props: any) => {
              if (name === 'energy') {
                return [
                  <div key="tooltip" className="space-y-1">
                    <div className="font-semibold">{props.payload.title}</div>
                    <div className="text-sm text-muted-foreground">{props.payload.artist}</div>
                    <div className="text-sm">Energy: {value}%</div>
                  </div>,
                  ''
                ];
              }
              return [value, name];
            }}
          />
          <Area 
            type="monotone" 
            dataKey="energy" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            fill="url(#energyGradient)"
            dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: 'hsl(var(--accent))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default EnergyTrendChart;
