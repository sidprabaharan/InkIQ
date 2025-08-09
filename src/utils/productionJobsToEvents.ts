import { CalendarEvent, CalendarEventCategory } from "@/pages/Calendar";
import { ImprintJob } from "@/types/imprint-job";
import { convertOrderBreakdownToImprintJobs } from "@/utils/imprintJobUtils";

// Color mapping for different decoration methods
const decorationMethodColors: Record<string, string> = {
  screen_printing: "#4285F4", // Google blue
  embroidery: "#0F9D58", // Google green  
  dtf: "#DB4437", // Google red
  dtg: "#FF6D01", // Orange
};

// Color mapping for production stages
const stageColors: Record<string, string> = {
  burn_screens: "#9C27B0", // Purple
  print: "#4285F4", // Blue
  digitize: "#0F9D58", // Green
  embroider: "#0F9D58", // Green
  design_file: "#FF9800", // Orange
  pretreat: "#FF5722", // Deep orange
  press: "#795548", // Brown
};

export function convertImprintJobsToCalendarEvents(): CalendarEvent[] {
  const imprintJobs = convertOrderBreakdownToImprintJobs();
  const calendarEvents: CalendarEvent[] = [];

  imprintJobs.forEach(job => {
    // Only convert scheduled jobs to calendar events
    if (job.status === "scheduled" && job.scheduledStart && job.scheduledEnd) {
      const event: CalendarEvent = {
        id: `production-${job.id}`,
        title: `${job.jobNumber} - ${job.customerName}`,
        description: `${job.description} | ${job.totalQuantity} pieces | ${job.decorationMethod.replace('_', ' ').toUpperCase()}`,
        start: job.scheduledStart,
        end: job.scheduledEnd,
        allDay: false,
        category: "production_job" as CalendarEventCategory,
        color: decorationMethodColors[job.decorationMethod] || "#4285F4",
        location: job.equipmentId ? `Station: ${job.equipmentId}` : undefined,
        
        // Production-specific fields
        jobId: job.id,
        equipmentId: job.equipmentId,
        decorationMethod: job.decorationMethod,
        stage: job.currentStage,
        priority: job.priority,
        customerName: job.customerName,
        estimatedHours: job.estimatedHours,
      };

      calendarEvents.push(event);
    }

    // Create additional events for important milestones if needed
    if (!job.artworkApproved) {
      const approvalEvent: CalendarEvent = {
        id: `approval-${job.id}`,
        title: `Artwork Approval - ${job.customerName}`,
        description: `Job ${job.jobNumber} - Waiting for customer artwork approval`,
        start: new Date(job.dueDate.getTime() - (3 * 24 * 60 * 60 * 1000)), // 3 days before due date
        end: new Date(job.dueDate.getTime() - (3 * 24 * 60 * 60 * 1000)),
        allDay: true,
        category: "artwork_approval" as CalendarEventCategory,
        color: "#FF9800", // Orange for pending items
        jobId: job.id,
        customerName: job.customerName,
      };

      calendarEvents.push(approvalEvent);
    }
  });

  return calendarEvents;
}

export function getEventsByCategory(events: CalendarEvent[], category: CalendarEventCategory): CalendarEvent[] {
  return events.filter(event => event.category === category);
}

export function getEventsByDecorationMethod(events: CalendarEvent[], method: string): CalendarEvent[] {
  return events.filter(event => event.decorationMethod === method);
}

export function getEventsByEquipment(events: CalendarEvent[], equipmentId: string): CalendarEvent[] {
  return events.filter(event => event.equipmentId === equipmentId);
}

export function getEventsByStage(events: CalendarEvent[], stage: string): CalendarEvent[] {
  return events.filter(event => event.stage === stage);
}