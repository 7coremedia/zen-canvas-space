import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Text as RechartsText
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brand } from '@/types/brand';

interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

interface CustomPolarAngleAxisProps {
  payload?: { value: string };
  x: number;
  y: number;
  cx?: number;
  cy?: number;
  radius?: number;
  textAnchor?: string;
}

const CustomPolarAngleAxis: React.FC<CustomPolarAngleAxisProps> = (props) => {
  const { payload, x, y } = props;
  
  if (!payload) return null;
  
  const words = payload.value.split(' ');

  return (
    <RechartsText
      x={x}
      y={y}
      textAnchor="middle"
      verticalAnchor="middle"
      className="text-xs fill-muted-foreground"
    >
      {words.join(' ')}
    </RechartsText>
  );
};

interface BrandPersonalityRadarProps {
  brand: Partial<Brand>;
  className?: string;
}

export function BrandPersonalityRadar({ brand, className }: BrandPersonalityRadarProps) {
  const data = useMemo<RadarDataPoint[]>(() => {
    if (!brand.brand_personality) return [];
    
    const personality = brand.brand_personality;
    
    return [
      { subject: 'Masculine', A: personality.masculine || 5, fullMark: 10 },
      { subject: 'Classic', A: personality.classic || 5, fullMark: 10 },
      { subject: 'Playful', A: personality.playful || 5, fullMark: 10 },
      { subject: 'Loud', A: personality.loud || 5, fullMark: 10 },
      { subject: 'Approachable', A: personality.approachable || 5, fullMark: 10 },
      { subject: 'Warm', A: personality.warm || 5, fullMark: 10 },
      { subject: 'Traditional', A: personality.traditional || 5, fullMark: 10 },
      { subject: 'Luxury', A: personality.luxury || 5, fullMark: 10 },
      { subject: 'Text Focused', A: personality.textFocused || 5, fullMark: 10 },
      { subject: 'Corporate', A: personality.corporate || 5, fullMark: 10 },
    ];
  }, [brand.brand_personality]);

  if (!brand.brand_personality) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Brand Personality</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No personality data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Brand Personality</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <PolarGrid stroke="hsl(var(--muted))" strokeOpacity={0.3} />
            <PolarAngleAxis
              dataKey="subject"
              tick={(props) => <CustomPolarAngleAxis {...props} />}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tickCount={6}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Radar
              name="Brand Personality"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
