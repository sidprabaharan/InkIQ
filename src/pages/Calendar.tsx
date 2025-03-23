
import { useState } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { useToast } from "@/hooks/use-toast";
import { addDays, addHours, addMinutes, setHours, startOfDay } from "date-fns";

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

// Current date/time for relative event scheduling
const now = new Date();
const today = startOfDay(now);

// Mock events data with realistic business-focused events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Order #123 Due",
    description: "Complete screen printing order for ABC Corp",
    start: setHours(today, 10),
    end: setHours(today, 11),
    allDay: false,
    category: "order",
    color: "#F4B400" // Gold
  },
  {
    id: "2",
    title: "Design Review Meeting",
    description: "Review mockups with design team",
    start: addDays(today, 1),
    end: addDays(today, 1),
    allDay: true,
    category: "work",
    color: "#0F9D58" // Green
  },
  {
    id: "3",
    title: "Call with Client",
    description: "Discuss revisions for Order #145",
    start: addHours(today, 14),
    end: addHours(today, 15),
    allDay: false,
    category: "task",
    color: "#4285F4", // Blue
    location: "Zoom Conference"
  },
  {
    id: "4",
    title: "Gym",
    description: "Weekly workout session",
    start: addHours(today, 18),
    end: addHours(today, 19),
    allDay: false,
    category: "personal",
    color: "#DB4437", // Red
    location: "Downtown Fitness Center"
  },
  {
    id: "5",
    title: "Print Shop Maintenance",
    description: "Regular equipment maintenance",
    start: addDays(today, 2),
    end: addDays(today, 2),
    allDay: true,
    category: "work",
    color: "#0F9D58" // Green
  },
  {
    id: "6",
    title: "Customer Pickup - Order #156",
    description: "Client coming to collect their order",
    start: addDays(addHours(today, 15), 2),
    end: addDays(addHours(today, 16), 2),
    allDay: false,
    category: "order",
    color: "#F4B400" // Gold
  },
  {
    id: "7",
    title: "Staff Meeting",
    description: "Weekly team check-in",
    start: addDays(addHours(today, 9), 3),
    end: addDays(addHours(today, 10), 3),
    allDay: false,
    category: "work",
    color: "#0F9D58" // Green
  },
  {
    id: "8",
    title: "Inventory Restock",
    description: "Restock ink and materials",
    start: addDays(today, 4),
    end: addDays(today, 4),
    allDay: true,
    category: "task",
    color: "#4285F4" // Blue
  },
  {
    id: "9",
    title: "Marketing Campaign Review",
    description: "Review Q2 marketing performance",
    start: addDays(addHours(today, 13), 5),
    end: addDays(addHours(today, 14), 5),
    allDay: false,
    category: "work",
    color: "#0F9D58" // Green
  },
  {
    id: "10",
    title: "Website Update",
    description: "Publish new product catalog",
    start: addDays(addHours(today, 10), 6),
    end: addDays(addHours(today, 11), 6),
    allDay: false,
    category: "task",
    color: "#4285F4" // Blue
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
    <div className="flex h-screen bg-white">
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
