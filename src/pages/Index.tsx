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
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Tabs defaultValue="month" className="w-[400px]" onValueChange={setTimeRange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Revenue" 
          value="$124,750"
          change="+12.5%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
          description={`vs previous ${timeRange}`}
        />
        <MetricCard 
          title="Total Orders" 
          value="854"
          change="+7.2%"
          trend="up"
          icon={<ShoppingCart className="h-5 w-5" />}
          description={`vs previous ${timeRange}`}
        />
        <MetricCard 
          title="Total Quotes" 
          value="1,245"
          change="+18.3%"
          trend="up"
          icon={<FileText className="h-5 w-5" />}
          description={`vs previous ${timeRange}`}
        />
        <MetricCard 
          title="Active Customers" 
          value="354"
          change="+5.3%"
          trend="up"
          icon={<Users className="h-5 w-5" />}
          description={`vs previous ${timeRange}`}
        />
      </div>

      {/* Pipeline and Revenue */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue trends over the selected {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart timeRange={timeRange} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>Current lead status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadStatusChart />
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate and Top Products */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quote Conversion</CardTitle>
            <CardDescription>Quote to order conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <QuoteConversionChart timeRange={timeRange} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsChart timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>

      {/* Region and Customer Analysis */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
            <CardDescription>Geographic distribution of sales</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <SalesByRegionMap />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Customers by order value</CardDescription>
          </CardHeader>
          <CardContent>
            <TopCustomersTable />
          </CardContent>
        </Card>
      </div>

      {/* Production Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Production Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Digitized Logos" 
            value="2,845"
            change="+9.4%"
            trend="up"
            icon={<Image className="h-5 w-5" />}
            description={`Total this ${timeRange}`}
          />
          <MetricCard 
            title="Vectorized Logos" 
            value="2,124"
            change="+11.7%"
            trend="up"
            icon={<Shapes className="h-5 w-5" />}
            description={`Total this ${timeRange}`}
          />
          <MetricCard 
            title="Color Separations" 
            value="1,876"
            change="+8.2%"
            trend="up"
            icon={<Palette className="h-5 w-5" />}
            description={`Total this ${timeRange}`}
          />
          <MetricCard 
            title="Avg. Turnaround" 
            value="1.8 days"
            change="-12.5%"
            trend="down"
            icon={<Clock className="h-5 w-5" />}
            description="Improvement is better"
          />
        </div>
      </div>

      {/* AI and Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Automation Metrics</CardTitle>
            <CardDescription>Automated customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">AI Emails Handled</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">367</span>
                  <span className="text-green-600 text-xs">+24.5%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">AI Call Minutes</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">842</span>
                  <span className="text-green-600 text-xs">+32.1%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Customer Satisfaction</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">96%</span>
                  <span className="text-green-600 text-xs">+3.2%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Response Time</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">3.2 min</span>
                  <span className="text-green-600 text-xs">-18.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Indicators</CardTitle>
            <CardDescription>Key business performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceMetrics timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
