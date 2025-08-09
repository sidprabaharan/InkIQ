
import { useState, useEffect, useMemo } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { EnhancedCreateEventDialog } from "@/components/calendar/EnhancedCreateEventDialog";
import { CalendarFilters, CalendarFilters as CalendarFiltersType } from "@/components/calendar/CalendarFilters";
import { convertImprintJobsToCalendarEvents } from "@/utils/productionJobsToEvents";
import { useToast } from "@/hooks/use-toast";

export type CalendarView = "month" | "week" | "day";

export type CalendarEventCategory = 
  | "task" 
  | "order" 
  | "work" 
  | "personal" 
  | "production_job" 
  | "meeting" 
  | "follow_up" 
  | "artwork_approval" 
  | "customer_call";

export type MeetingProvider = "google_meet" | "zoom" | "teams" | "none";

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  category: CalendarEventCategory;
  color?: string;
  location?: string;
  
  // Meeting-specific fields
  meetingProvider?: MeetingProvider;
  meetingLink?: string;
  attendees?: string[];
  
  // Production-specific fields
  jobId?: string;
  equipmentId?: string;
  decorationMethod?: string;
  stage?: string;
  priority?: "low" | "medium" | "high";
  customerName?: string;
  estimatedHours?: number;
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
    color: "#4285F4",
    location: "Main Office"
  },
  {
    id: "2",
    title: "Design Review Meeting",
    description: "Review mockups with design team",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    category: "work",
    color: "#0F9D58"
  },
  {
    id: "3",
    title: "Client Call - Order #145",
    description: "Discuss revisions for Order #145",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    allDay: false,
    category: "customer_call",
    color: "#DB4437",
    location: "Conference Room B",
    meetingProvider: "zoom",
    meetingLink: "https://zoom.us/j/123456789",
    attendees: ["client@company.com", "sales@ourcompany.com"]
  },
  // Weekly recurring meetings
  {
    id: "4",
    title: "Production Planning Meeting",
    description: "Weekly production capacity review",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: false,
    category: "meeting",
    color: "#9C27B0",
    meetingProvider: "teams",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123"
  },
  // Customer meetings throughout the week
  {
    id: "5",
    title: "TechCorp Artwork Review",
    description: "Final approval for promotional materials",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    allDay: false,
    category: "artwork_approval",
    color: "#FF9800",
    customerName: "TechCorp Solutions"
  },
  {
    id: "6",
    title: "Metro Sports Quote Discussion",
    description: "Review uniform requirements",
    start: new Date(new Date().setDate(new Date().getDate() + 4)),
    end: new Date(new Date().setDate(new Date().getDate() + 4)),
    allDay: false,
    category: "customer_call",
    color: "#E91E63",
    meetingProvider: "google_meet",
    attendees: ["coach@metrosports.com"]
  },
  // Follow-up tasks
  {
    id: "7",
    title: "Follow-up: Restaurant Chain Order",
    description: "Check on additional locations interested",
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    end: new Date(new Date().setDate(new Date().getDate() + 5)),
    allDay: true,
    category: "follow_up",
    color: "#FF5722"
  },
  // Next week events
  {
    id: "8",
    title: "Vendor Meeting - New Equipment",
    description: "Discuss DTF printer upgrade options",
    start: new Date(new Date().setDate(new Date().getDate() + 7)),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
    allDay: false,
    category: "meeting",
    color: "#607D8B",
    location: "Showroom"
  },
  {
    id: "9",
    title: "Staff Training - New Embroidery Software",
    description: "Training session for design software update",
    start: new Date(new Date().setDate(new Date().getDate() + 8)),
    end: new Date(new Date().setDate(new Date().getDate() + 8)),
    allDay: false,
    category: "work",
    color: "#795548"
  },
  {
    id: "10",
    title: "Quality Control Review",
    description: "Weekly QC meeting for production standards",
    start: new Date(new Date().setDate(new Date().getDate() + 9)),
    end: new Date(new Date().setDate(new Date().getDate() + 9)),
    allDay: false,
    category: "meeting",
    color: "#3F51B5"
  },
  // More customer interactions
  {
    id: "11",
    title: "Charity Foundation Logo Approval",
    description: "Final logo placement review",
    start: new Date(new Date().setDate(new Date().getDate() + 10)),
    end: new Date(new Date().setDate(new Date().getDate() + 10)),
    allDay: false,
    category: "artwork_approval",
    color: "#FF9800",
    customerName: "United Charity Foundation"
  },
  {
    id: "12",
    title: "Trade Show Planning Call",
    description: "Coordinate promotional materials for Global Trade Expo",
    start: new Date(new Date().setDate(new Date().getDate() + 11)),
    end: new Date(new Date().setDate(new Date().getDate() + 11)),
    allDay: false,
    category: "customer_call",
    color: "#8BC34A",
    meetingProvider: "zoom",
    attendees: ["events@globaltrade.com", "marketing@globaltrade.com"]
  },
  // Personal events
  {
    id: "13",
    title: "Lunch with Supplier Rep",
    description: "Quarterly check-in with fabric supplier",
    start: new Date(new Date().setDate(new Date().getDate() + 12)),
    end: new Date(new Date().setDate(new Date().getDate() + 12)),
    allDay: false,
    category: "personal",
    color: "#E91E63",
    location: "Downtown Restaurant"
  },
  // Equipment maintenance
  {
    id: "14",
    title: "Press Maintenance Schedule",
    description: "Scheduled maintenance for Press 2",
    start: new Date(new Date().setDate(new Date().getDate() + 14)),
    end: new Date(new Date().setDate(new Date().getDate() + 14)),
    allDay: true,
    category: "work",
    color: "#FF5722"
  },
  // Urgent follow-ups
  {
    id: "15",
    title: "Rush Order Follow-up: SoundWave Festival",
    description: "Confirm delivery timeline for festival merchandise",
    start: new Date(new Date().setDate(new Date().getDate() + 15)),
    end: new Date(new Date().setDate(new Date().getDate() + 15)),
    allDay: false,
    category: "follow_up",
    color: "#FF9800",
    customerName: "SoundWave Festival"
  }
];

export default function Calendar() {
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [baseEvents, setBaseEvents] = useState<CalendarEvent[]>(mockEvents);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CalendarFiltersType>({
    categories: [],
    decorationMethods: [],
    stages: [],
    equipmentIds: [],
    meetingProviders: [],
    priorities: [],
    showAllDay: true,
    showTimed: true,
  });
  const { toast } = useToast();

  // Load production jobs as calendar events
  useEffect(() => {
    const productionEvents = convertImprintJobsToCalendarEvents();
    setBaseEvents([...mockEvents, ...productionEvents]);
  }, []);

  // Filter events based on active filters
  const filteredEvents = useMemo(() => {
    let filtered = [...baseEvents];

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(event => filters.categories.includes(event.category));
    }

    // Filter by decoration methods
    if (filters.decorationMethods.length > 0) {
      filtered = filtered.filter(event => 
        !event.decorationMethod || filters.decorationMethods.includes(event.decorationMethod)
      );
    }

    // Filter by stages
    if (filters.stages.length > 0) {
      filtered = filtered.filter(event => 
        !event.stage || filters.stages.includes(event.stage)
      );
    }

    // Filter by equipment
    if (filters.equipmentIds.length > 0) {
      filtered = filtered.filter(event => 
        !event.equipmentId || filters.equipmentIds.includes(event.equipmentId)
      );
    }

    // Filter by all-day/timed
    if (!filters.showAllDay) {
      filtered = filtered.filter(event => !event.allDay);
    }
    if (!filters.showTimed) {
      filtered = filtered.filter(event => event.allDay);
    }

    return filtered;
  }, [baseEvents, filters]);

  const getActiveFilterCount = () => {
    return (
      filters.categories.length +
      filters.decorationMethods.length +
      filters.stages.length +
      filters.equipmentIds.length +
      filters.meetingProviders.length +
      filters.priorities.length
    );
  };

  const handleAddEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    const event = {
      ...newEvent,
      id: Math.random().toString(36).substring(2, 9)
    };
    setBaseEvents([...baseEvents, event]);
    toast({
      title: "Event created",
      description: `"${event.title}" has been added to your calendar`
    });
    setShowCreateEventDialog(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <CalendarHeader 
        view={view}
        onViewChange={setView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onCreateEvent={() => setShowCreateEventDialog(true)}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFilterCount={getActiveFilterCount()}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <CalendarFilters
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
          
          {view === "month" && (
            <CalendarMonth 
              currentDate={currentDate} 
              events={filteredEvents} 
            />
          )}
          {view === "week" && (
            <CalendarWeek 
              currentDate={currentDate} 
              events={filteredEvents} 
            />
          )}
          {view === "day" && (
            <CalendarDay 
              currentDate={currentDate} 
              events={filteredEvents} 
            />
          )}
        </div>
      </div>

      <EnhancedCreateEventDialog 
        open={showCreateEventDialog}
        onOpenChange={setShowCreateEventDialog}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}
