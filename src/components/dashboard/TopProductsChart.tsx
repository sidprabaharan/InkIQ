
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
  LabelList,
} from 'recharts';

interface TopProductsChartProps {
  timeRange: string;
}

export function TopProductsChart({ timeRange }: TopProductsChartProps) {
  // Sample data
  const data = [
    { name: 'Premium Polos', revenue: 24500, units: 1250 },
    { name: 'Custom Caps', revenue: 19800, units: 2200 },
    { name: 'Embroidered Jackets', revenue: 16500, units: 550 },
    { name: 'Printed T-Shirts', revenue: 15200, units: 2500 },
    { name: 'Team Uniforms', revenue: 12800, units: 640 },
  ];

  const config = {
    revenue: {
      label: "Revenue",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
    units: {
      label: "Units Sold",
      theme: {
        light: "hsl(var(--chart-2))",
        dark: "hsl(var(--chart-2))",
      },
    },
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px]">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis 
          type="number" 
          tickFormatter={formatCurrency}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          content={<ChartTooltipContent />} 
          formatter={(value, name) => [
            name === 'revenue' ? formatCurrency(value as number) : value,
            name === 'revenue' ? 'Revenue' : 'Units Sold'
          ]}
        />
        <Bar 
          dataKey="revenue" 
          fill="var(--color-revenue)" 
          barSize={20}
          radius={[0, 4, 4, 0]}
        >
          <LabelList dataKey="revenue" position="right" formatter={formatCurrency} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
