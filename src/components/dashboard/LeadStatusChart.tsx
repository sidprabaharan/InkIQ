
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function LeadStatusChart() {
  // Sample data
  const data = [
    { name: 'New Lead', value: 110, color: '#9b87f5' },
    { name: 'In Contact', value: 85, color: '#a3e635' },
    { name: 'Qualified', value: 65, color: '#fbbf24' },
    { name: 'Quoted', value: 45, color: '#60a5fa' },
    { name: 'Follow Up', value: 30, color: '#f87171' },
    { name: 'Closed Won', value: 25, color: '#4ade80' },
    { name: 'Closed Lost', value: 20, color: '#94a3b8' },
  ];

  const config = Object.fromEntries(
    data.map(item => [
      item.name.toLowerCase(),
      {
        label: item.name,
        color: item.color,
      },
    ])
  );

  const totalLeads = data.reduce((sum, entry) => sum + entry.value, 0);
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="text-xl font-bold">{totalLeads}</div>
        <div className="text-sm text-muted-foreground">Total Leads</div>
      </div>
      
      <ChartContainer config={config} className="aspect-auto h-[250px]">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent nameKey="name" labelKey="value" />} />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
