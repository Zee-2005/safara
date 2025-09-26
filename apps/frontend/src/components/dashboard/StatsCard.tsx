import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  status?: 'emergency' | 'warning' | 'success' | 'info';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  status
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'emergency':
        return 'bg-emergency-muted text-emergency border-emergency/20';
      case 'warning':
        return 'bg-warning-muted text-warning border-warning/20';
      case 'success':
        return 'bg-success-muted text-success border-success/20';
      case 'info':
        return 'bg-info-muted text-info border-info/20';
      default:
        return 'bg-card text-card-foreground';
    }
  };

  const getChangeColors = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-emergency';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`card-shadow transition-all hover:shadow-lg ${getStatusColors()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <Badge 
            variant="outline" 
            className={`mt-2 ${getChangeColors()} border-current/20`}
          >
            {change}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;