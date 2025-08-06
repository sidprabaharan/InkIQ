import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/production/KanbanBoard";
import { ProductionScheduler } from "@/components/production/ProductionScheduler";
import { EnhancedProductionScheduler } from "@/components/production/EnhancedProductionScheduler";
import { SmartJobRouter } from "@/components/production/SmartJobRouter";
import { ProductionFlowManager } from "@/components/production/ProductionFlowManager";
import { EquipmentManager } from "@/components/production/EquipmentManager";
import { ProductionListView } from "@/components/production/ProductionListView";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { Calendar, LayoutGrid, Settings, List, Clock } from "lucide-react";
import { CalendarView, CalendarEvent } from "@/pages/Calendar";
import { useToast } from "@/hooks/use-toast";

// Mock events data for calendar integration
const mockProductionEvents: CalendarEvent[] = [
  {
    id: "prod-1",
    title: "T-Shirts Production",
    description: "Screen printing 375 units on M&R Sportsman",
    start: new Date(new Date().setHours(8, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    allDay: false,
    category: "work",
    color: "#3b82f6",
    location: "Screen Printing Department"
  },
  {
    id: "prod-2", 
    title: "Polo Shirts Embroidery",
    description: "150 units embroidery on Brother PR-1050X",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    category: "work",
    color: "#10b981"
  },
];

export default function Production() {
  const [activeTab, setActiveTab] = useState("scheduler");
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockProductionEvents);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const { toast } = useToast();

  const handleAddEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    const event = {
      ...newEvent,
      id: Math.random().toString(36).substring(2, 9)
    };
    setEvents([...events, event]);
    toast({
      title: "Production event created",
      description: `"${event.title}" has been added to the production calendar`
    });
    setShowCreateEventDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Production Management</h1>
          <p className="text-muted-foreground">
            Intelligent production routing, scheduling, and workflow management
          </p>
        </div>
        <EquipmentManager />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-6">
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Smart Scheduler
          </TabsTrigger>
          <TabsTrigger value="router" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Job Router
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduler" className="mt-6">
          <EnhancedProductionScheduler />
        </TabsContent>

        <TabsContent value="router" className="mt-6">
          <SmartJobRouter />
        </TabsContent>

        <TabsContent value="workflow" className="mt-6">
          <ProductionFlowManager />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <KanbanBoard />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="flex h-[calc(100vh-200px)] flex-col overflow-hidden">
            <CalendarHeader 
              view={calendarView}
              onViewChange={setCalendarView}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onCreateEvent={() => setShowCreateEventDialog(true)}
            />
            <div className="flex-1 overflow-auto">
              {calendarView === "month" && (
                <CalendarMonth 
                  currentDate={currentDate} 
                  events={events} 
                />
              )}
              {calendarView === "week" && (
                <CalendarWeek 
                  currentDate={currentDate} 
                  events={events} 
                />
              )}
              {calendarView === "day" && (
                <CalendarDay 
                  currentDate={currentDate} 
                  events={events} 
                />
              )}
            </div>
            
            <CreateEventDialog 
              open={showCreateEventDialog}
              onOpenChange={setShowCreateEventDialog}
              onAddEvent={handleAddEvent}
            />
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <ProductionListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}