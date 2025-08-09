
import { useState, useEffect, useMemo } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { CalendarAgenda } from "@/components/calendar/CalendarAgenda";
import { EnhancedCreateEventDialog } from "@/components/calendar/EnhancedCreateEventDialog";
import { CalendarFilters, CalendarFilters as CalendarFiltersType } from "@/components/calendar/CalendarFilters";
import { convertImprintJobsToCalendarEvents } from "@/utils/productionJobsToEvents";
import { getEventColor } from "@/utils/eventColors";
import { useToast } from "@/hooks/use-toast";

export type CalendarView = "month" | "week" | "day" | "agenda";

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
    location: "Main Office"
  },
  {
    id: "2",
    title: "Design Review Meeting",
    description: "Review mockups with design team",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    category: "work"
  },
  {
    id: "3",
    title: "Client Call - Order #145",
    description: "Discuss revisions for Order #145",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    allDay: false,
    category: "customer_call",
    location: "Conference Room B",
    meetingProvider: "zoom",
    meetingLink: "https://zoom.us/j/123456789",
    attendees: ["client@company.com", "sales@ourcompany.com"]
  },
  {
    id: "4",
    title: "Production Planning Meeting",
    description: "Weekly production capacity review",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: false,
    category: "meeting",
    meetingProvider: "teams",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123"
  },
  {
    id: "5",
    title: "TechCorp Artwork Review",
    description: "Final approval for promotional materials",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    allDay: false,
    category: "artwork_approval",
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
    meetingProvider: "google_meet",
    attendees: ["coach@metrosports.com"]
  },
  {
    id: "7",
    title: "Follow-up: Restaurant Chain Order",
    description: "Check on additional locations interested",
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    end: new Date(new Date().setDate(new Date().getDate() + 5)),
    allDay: true,
    category: "follow_up"
  },
  {
    id: "8",
    title: "Vendor Meeting - New Equipment",
    description: "Discuss DTF printer upgrade options",
    start: new Date(new Date().setDate(new Date().getDate() + 7)),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
    allDay: false,
    category: "meeting",
    location: "Showroom"
  },
  {
    id: "9",
    title: "Staff Training - New Embroidery Software",
    description: "Training session for design software update",
    start: new Date(new Date().setDate(new Date().getDate() + 8)),
    end: new Date(new Date().setDate(new Date().getDate() + 8)),
    allDay: false,
    category: "work"
  },
  {
    id: "10",
    title: "Quality Control Review",
    description: "Weekly QC meeting for production standards",
    start: new Date(new Date().setDate(new Date().getDate() + 9)),
    end: new Date(new Date().setDate(new Date().getDate() + 9)),
    allDay: false,
    category: "meeting"
  },
  {
    id: "11",
    title: "Charity Foundation Logo Approval",
    description: "Final logo placement review",
    start: new Date(new Date().setDate(new Date().getDate() + 10)),
    end: new Date(new Date().setDate(new Date().getDate() + 10)),
    allDay: false,
    category: "artwork_approval",
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
    meetingProvider: "zoom",
    attendees: ["events@globaltrade.com", "marketing@globaltrade.com"]
  },
  {
    id: "13",
    title: "Lunch with Supplier Rep",
    description: "Quarterly check-in with fabric supplier",
    start: new Date(new Date().setDate(new Date().getDate() + 12)),
    end: new Date(new Date().setDate(new Date().getDate() + 12)),
    allDay: false,
    category: "personal",
    location: "Downtown Restaurant"
  },
  {
    id: "14",
    title: "Press Maintenance Schedule",
    description: "Scheduled maintenance for Press 2",
    start: new Date(new Date().setDate(new Date().getDate() + 14)),
    end: new Date(new Date().setDate(new Date().getDate() + 14)),
    allDay: true,
    category: "work"
  },
  {
    id: "15",
    title: "Rush Order Follow-up: SoundWave Festival",
    description: "Confirm delivery timeline for festival merchandise",
    start: new Date(new Date().setDate(new Date().getDate() + 15)),
    end: new Date(new Date().setDate(new Date().getDate() + 15)),
    allDay: false,
    category: "follow_up",
    priority: "high",
    customerName: "SoundWave Festival"
  },
  // Pack August 9th with continuous production jobs
  {
    id: "prod_1",
    title: "1001-A Screen Print Setup",
    description: "Setup screens for TechCorp order",
    start: new Date(2025, 7, 9, 7, 0), // Aug 9, 7:00 AM
    end: new Date(2025, 7, 9, 8, 30),
    allDay: false,
    category: "production_job",
    jobId: "1001-A",
    equipmentId: "press-2",
    decorationMethod: "Screen Printing",
    stage: "Setup",
    customerName: "TechCorp Solutions",
    estimatedHours: 1.5,
    priority: "high"
  },
  {
    id: "prod_2", 
    title: "1001-A Production Run",
    description: "Print 500 units - TechCorp promotional tees",
    start: new Date(2025, 7, 9, 8, 30),
    end: new Date(2025, 7, 9, 12, 0),
    allDay: false,
    category: "production_job",
    jobId: "1001-A",
    equipmentId: "press-2",
    decorationMethod: "Screen Printing", 
    stage: "Print",
    customerName: "TechCorp Solutions",
    estimatedHours: 3.5,
    priority: "high"
  },
  {
    id: "prod_3",
    title: "1002-B Screen Changeover",
    description: "Quick changeover for Restaurant Chain order",
    start: new Date(2025, 7, 9, 12, 0),
    end: new Date(2025, 7, 9, 12, 30),
    allDay: false,
    category: "production_job",
    jobId: "1002-B",
    equipmentId: "press-2",
    decorationMethod: "Screen Printing",
    stage: "Setup",
    customerName: "Restaurant Chain",
    estimatedHours: 0.5
  },
  {
    id: "prod_4",
    title: "1002-B Production Run",
    description: "Print 300 aprons for Restaurant Chain",
    start: new Date(2025, 7, 9, 12, 30),
    end: new Date(2025, 7, 9, 15, 45),
    allDay: false,
    category: "production_job",
    jobId: "1002-B", 
    equipmentId: "press-2",
    decorationMethod: "Screen Printing",
    stage: "Print",
    customerName: "Restaurant Chain",
    estimatedHours: 3.25
  },
  {
    id: "prod_5",
    title: "1003-C Screen Setup",
    description: "Setup for Metro Sports uniforms",
    start: new Date(2025, 7, 9, 15, 45),
    end: new Date(2025, 7, 9, 16, 30),
    allDay: false,
    category: "production_job",
    jobId: "1003-C",
    equipmentId: "press-2",
    decorationMethod: "Screen Printing",
    stage: "Setup", 
    customerName: "Metro Sports",
    estimatedHours: 0.75
  },
  {
    id: "prod_6",
    title: "1003-C Production Run",
    description: "Print 200 team jerseys",
    start: new Date(2025, 7, 9, 16, 30),
    end: new Date(2025, 7, 9, 19, 0),
    allDay: false,
    category: "production_job",
    jobId: "1003-C",
    equipmentId: "press-2", 
    decorationMethod: "Screen Printing",
    stage: "Print",
    customerName: "Metro Sports",
    estimatedHours: 2.5
  },
  // Press-3 jobs running parallel
  {
    id: "prod_7",
    title: "2001-A Embroidery Setup",
    description: "Setup for Charity Foundation polos",
    start: new Date(2025, 7, 9, 8, 0),
    end: new Date(2025, 7, 9, 9, 0),
    allDay: false,
    category: "production_job",
    jobId: "2001-A",
    equipmentId: "emb-1",
    decorationMethod: "Embroidery",
    stage: "Setup",
    customerName: "United Charity Foundation",
    estimatedHours: 1
  },
  {
    id: "prod_8",
    title: "2001-A Embroidery Run",
    description: "Embroider 150 polo shirts",
    start: new Date(2025, 7, 9, 9, 0),
    end: new Date(2025, 7, 9, 13, 30),
    allDay: false,
    category: "production_job",
    jobId: "2001-A",
    equipmentId: "emb-1",
    decorationMethod: "Embroidery",
    stage: "Embroider",
    customerName: "United Charity Foundation",
    estimatedHours: 4.5
  },
  {
    id: "prod_9",
    title: "2002-B Embroidery Setup", 
    description: "Setup for Trade Show caps",
    start: new Date(2025, 7, 9, 13, 30),
    end: new Date(2025, 7, 9, 14, 15),
    allDay: false,
    category: "production_job",
    jobId: "2002-B",
    equipmentId: "emb-1", 
    decorationMethod: "Embroidery",
    stage: "Setup",
    customerName: "Global Trade Expo",
    estimatedHours: 0.75
  },
  {
    id: "prod_10",
    title: "2002-B Embroidery Run",
    description: "Embroider 100 promotional caps",
    start: new Date(2025, 7, 9, 14, 15),
    end: new Date(2025, 7, 9, 17, 30),
    allDay: false,
    category: "production_job",
    jobId: "2002-B",
    equipmentId: "emb-1",
    decorationMethod: "Embroidery", 
    stage: "Embroider",
    customerName: "Global Trade Expo",
    estimatedHours: 3.25
  },
  // DTF printer running throughout the day
  {
    id: "prod_11",
    title: "3001-A DTF Prep",
    description: "Prepare DTF transfers for SoundWave Festival",
    start: new Date(2025, 7, 9, 7, 30),
    end: new Date(2025, 7, 9, 8, 45),
    allDay: false,
    category: "production_job",
    jobId: "3001-A",
    equipmentId: "dtf-1",
    decorationMethod: "DTF",
    stage: "Prep",
    customerName: "SoundWave Festival",
    estimatedHours: 1.25,
    priority: "high"
  },
  {
    id: "prod_12",
    title: "3001-A DTF Print",
    description: "Print 400 DTF transfers",
    start: new Date(2025, 7, 9, 8, 45),
    end: new Date(2025, 7, 9, 12, 15),
    allDay: false,
    category: "production_job",
    jobId: "3001-A",
    equipmentId: "dtf-1",
    decorationMethod: "DTF",
    stage: "Print",
    customerName: "SoundWave Festival",
    estimatedHours: 3.5,
    priority: "high"
  },
  {
    id: "prod_13",
    title: "3002-B DTF Print",
    description: "Print transfers for local gym chain",
    start: new Date(2025, 7, 9, 12, 15),
    end: new Date(2025, 7, 9, 15, 30),
    allDay: false,
    category: "production_job",
    jobId: "3002-B",
    equipmentId: "dtf-1",
    decorationMethod: "DTF",
    stage: "Print",
    customerName: "FitLife Gyms",
    estimatedHours: 3.25
  },
  {
    id: "prod_14",
    title: "3003-C DTF Print",
    description: "Print small batch for boutique client",
    start: new Date(2025, 7, 9, 15, 30),
    end: new Date(2025, 7, 9, 17, 45),
    allDay: false,
    category: "production_job",
    jobId: "3003-C",
    equipmentId: "dtf-1",
    decorationMethod: "DTF",
    stage: "Print",
    customerName: "Boutique Designs",
    estimatedHours: 2.25
  },
  // Heat press station for applying DTF transfers
  {
    id: "prod_15",
    title: "3001-A DTF Application",
    description: "Apply DTF transfers to SoundWave shirts",
    start: new Date(2025, 7, 9, 12, 30),
    end: new Date(2025, 7, 9, 16, 0),
    allDay: false,
    category: "production_job",
    jobId: "3001-A",
    equipmentId: "heat-press-1",
    decorationMethod: "DTF",
    stage: "Apply",
    customerName: "SoundWave Festival", 
    estimatedHours: 3.5,
    priority: "high"
  },
  {
    id: "prod_16",
    title: "3002-B DTF Application",
    description: "Apply transfers to gym shirts",
    start: new Date(2025, 7, 9, 16, 0),
    end: new Date(2025, 7, 9, 18, 30),
    allDay: false,
    category: "production_job",
    jobId: "3002-B",
    equipmentId: "heat-press-1",
    decorationMethod: "DTF",
    stage: "Apply",
    customerName: "FitLife Gyms",
    estimatedHours: 2.5
  },
  // Quality control and finishing
  {
    id: "prod_17",
    title: "QC - TechCorp Order",
    description: "Quality check and packaging",
    start: new Date(2025, 7, 9, 19, 0),
    end: new Date(2025, 7, 9, 19, 45),
    allDay: false,
    category: "production_job",
    jobId: "1001-A",
    equipmentId: "qc-station",
    decorationMethod: "Screen Printing",
    stage: "QC",
    customerName: "TechCorp Solutions",
    estimatedHours: 0.75,
    priority: "high"
  },
  {
    id: "prod_18",
    title: "QC - Charity Foundation",
    description: "Final inspection and packing",
    start: new Date(2025, 7, 9, 17, 30),
    end: new Date(2025, 7, 9, 18, 15),
    allDay: false,
    category: "production_job",
    jobId: "2001-A", 
    equipmentId: "qc-station",
    decorationMethod: "Embroidery",
    stage: "QC",
    customerName: "United Charity Foundation",
    estimatedHours: 0.75
  }
].map(event => ({
  ...event,
  color: getEventColor(event.category as CalendarEventCategory, event.priority as "low" | "medium" | "high" | undefined)
})) as CalendarEvent[];

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
      id: Math.random().toString(36).substring(2, 9),
      color: getEventColor(newEvent.category, newEvent.priority)
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
      {showFilters && (
        <div className="border-b bg-background p-4">
          <CalendarFilters
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
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
        {view === "agenda" && (
          <CalendarAgenda 
            currentDate={currentDate} 
            events={filteredEvents} 
          />
        )}
      </div>

      <EnhancedCreateEventDialog 
        open={showCreateEventDialog}
        onOpenChange={setShowCreateEventDialog}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}
