import React, { useState } from 'react';
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Users,
  FileText,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  Image,
  Shapes,
  Palette,
  Award,
  MapPin,
  Target,
  BarChart2,
  CalendarRange,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { QuoteConversionChart } from '@/components/dashboard/QuoteConversionChart';
import { TopCustomersTable } from '@/components/dashboard/TopCustomersTable';
import { SalesByRegionMap } from '@/components/dashboard/SalesByRegionMap';
import { LeadStatusChart } from '@/components/dashboard/LeadStatusChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';

export default function Dashboard() {
  console.log('Dashboard component rendering...');
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-red-100 min-h-screen">
      <div className="bg-blue-100 p-4 rounded">
        <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard - Test Visible</h1>
        <p className="text-black">If you can see this, the component is rendering!</p>
      </div>
      
      <div className="bg-green-100 p-4 rounded">
        <p className="text-black">Simple content test</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Test Button</button>
      </div>

    </div>
  );
}
