
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface QuoteConversionChartProps {
  timeRange: string;
}

export function QuoteConversionChart({ timeRange }: QuoteConversionChartProps) {
  // Sample data
  const data = [
    { name: timeRange === 'year' ? 'Q1' : timeRange === 'month' ? 'Week 1' : 'Day 1', quotes: 420, orders: 320, conversion: 76.2 },
    { name: timeRange === 'year' ? 'Q2' : timeRange === 'month' ? 'Week 2' : 'Day 2', quotes: 380, orders: 302, conversion: 79.5 },
    { name: timeRange === 'year' ? 'Q3' : timeRange === 'month' ? 'Week 3' : 'Day 3', quotes: 445, orders: 356, conversion: 80 },
    { name: timeRange === 'year' ? 'Q4' : timeRange === 'month' ? 'Week 4' : 'Day 4', quotes: 510, orders: 420, conversion: 82.4 },
  ];

  const config = {
    quotes: {
      label: "Quotes",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
    orders: {
      label: "Orders",
      theme: {
        light: "hsl(var(--chart-2))",
        dark: "hsl(var(--chart-2))",
      },
    },
    conversion: {
      label: "Conversion Rate",
      theme: {
        light: "hsl(var(--chart-3))",
        dark: "hsl(var(--chart-3))",
      },
    },
  };

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px]">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          yAxisId="left"
          orientation="left"
          tickLine={false}
          axisLine={false}
          label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          label={{ value: 'Conversion %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar yAxisId="left" dataKey="quotes" fill="var(--color-quotes)" name="Quotes" />
        <Bar yAxisId="left" dataKey="orders" fill="var(--color-orders)" name="Orders" />
        <ReferenceLine yAxisId="right" y={75} stroke="var(--color-conversion)" strokeDasharray="3 3" />
      </BarChart>
    </ChartContainer>
  );
}
