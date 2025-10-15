import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

const StatCard = ({ title, value, description, icon: Icon, gradient }: StatCardProps) => {
  return (
    <Card className="group p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
            {value}
          </p>
        </div>
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform animate-pulse-glow"
          style={{ background: gradient }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};

export default StatCard;
