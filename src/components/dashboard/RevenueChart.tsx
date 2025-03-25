
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  Legend,
  Line, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip,
  CartesianGrid 
} from 'recharts';

interface RevenueChartProps {
  timeRange: string;
}

export function RevenueChart({ timeRange }: RevenueChartProps) {
  // Sample data - in a real app, this would come from an API
  const data = [
    { name: timeRange === 'year' ? 'Jan' : timeRange === 'month' ? '1' : 'Mon', revenue: 12400, profit: 8200, target: 10000 },
    { name: timeRange === 'year' ? 'Feb' : timeRange === 'month' ? '5' : 'Tue', revenue: 15600, profit: 10400, target: 10000 },
    { name: timeRange === 'year' ? 'Mar' : timeRange === 'month' ? '10' : 'Wed', revenue: 14200, profit: 9500, target: 10000 },
    { name: timeRange === 'year' ? 'Apr' : timeRange === 'month' ? '15' : 'Thu', revenue: 18100, profit: 12800, target: 10000 },
    { name: timeRange === 'year' ? 'May' : timeRange === 'month' ? '20' : 'Fri', revenue: 21400, profit: 15300, target: 10000 },
    { name: timeRange === 'year' ? 'Jun' : timeRange === 'month' ? '25' : 'Sat', revenue: 24200, profit: 17800, target: 10000 },
    { name: timeRange === 'year' ? 'Jul' : timeRange === 'month' ? '30' : 'Sun', revenue: 22800, profit: 16500, target: 10000 },
    ...(timeRange === 'year' ? [
      { name: 'Aug', revenue: 25600, profit: 19200, target: 10000 },
      { name: 'Sep', revenue: 28400, profit: 21800, target: 10000 },
      { name: 'Oct', revenue: 27200, profit: 20500, target: 10000 },
      { name: 'Nov', revenue: 29800, profit: 22500, target: 10000 },
      { name: 'Dec', revenue: 32400, profit: 24800, target: 10000 },
    ] : []),
  ];

  const config = {
    revenue: {
      label: "Revenue",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
    profit: {
      label: "Profit",
      theme: {
        light: "hsl(var(--chart-2))",
        dark: "hsl(var(--chart-2))",
      },
    },
    target: {
      label: "Target",
      theme: {
        light: "hsl(var(--chart-3))",
        dark: "hsl(var(--chart-3))",
      },
    },
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <ChartContainer config={config} className="aspect-auto h-[300px]">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name"
          tickLine={false}
          axisLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          tickFormatter={formatCurrency}
          tickLine={false}
          axisLine={false}
          tickCount={5}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="revenue"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 4 }}
          stroke="var(--color-revenue)"
        />
        <Line
          type="monotone"
          dataKey="profit"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 4 }}
          stroke="var(--color-profit)"
        />
        <Line
          type="monotone"
          dataKey="target"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          stroke="var(--color-target)"
        />
      </LineChart>
    </ChartContainer>
  );
}
