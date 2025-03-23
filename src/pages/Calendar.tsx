
import { useState } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { useToast } from "@/hooks/use-toast";

export type CalendarView = "month" | "week" | "day";
export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  category: "task" | "order" | "work" | "personal";
  color?: string;
  location?: string;
};

// Mock events data
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Order #123 Due",
    description: "Complete screen printing order for ABC Corp",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    allDay: false,
    category: "order",
    color: "#4285F4" // Google blue
  },
  {
    id: "2",
    title: "Design Review",
    description: "Review mockups with design team",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    category: "work",
    color: "#0F9D58" // Google green
  },
  {
    id: "3",
    title: "Call with Client",
    description: "Discuss revisions for Order #145",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    allDay: false,
    category: "task",
    color: "#DB4437" // Google red
  }
];

export default function Calendar() {
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const { toast } = useToast();

  const handleAddEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    const event = {
      ...newEvent,
      id: Math.random().toString(36).substring(2, 9)
    };
    setEvents([...events, event]);
    toast({
      title: "Event created",
      description: `"${event.title}" has been added to your calendar`
    });
    setShowCreateEventDialog(false);
  };

  return (
    <div className="flex h-screen">
      <CalendarSidebar 
        events={events}
        onCreateEvent={() => setShowCreateEventDialog(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CalendarHeader 
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onCreateEvent={() => setShowCreateEventDialog(true)}
        />
        <div className="flex-1 overflow-auto">
          {view === "month" && (
            <CalendarMonth 
              currentDate={currentDate} 
              events={events} 
            />
          )}
          {view === "week" && (
            <CalendarWeek 
              currentDate={currentDate} 
              events={events} 
            />
          )}
          {view === "day" && (
            <CalendarDay 
              currentDate={currentDate} 
              events={events} 
            />
          )}
        </div>
      </div>

      <CreateEventDialog 
        open={showCreateEventDialog}
        onOpenChange={setShowCreateEventDialog}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}
