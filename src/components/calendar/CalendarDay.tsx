
import React from 'react';
import { 
  format, 
  addHours, 
  startOfDay, 
  isSameDay, 
  isWithinInterval,
  getHours,
  getMinutes,
  addMinutes,
  parseISO
} from 'date-fns';
import { CalendarEvent } from '@/pages/Calendar';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarDay({ currentDate, events }: CalendarDayProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Filter events for the current day
  const filteredEvents = events.filter(event => 
    isSameDay(new Date(event.start), currentDate)
  );
  
  // Calculate event position and height in the day view
  const getEventPosition = (event: CalendarEvent) => {
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);
    
    const startHour = getHours(startTime) + getMinutes(startTime) / 60;
    const endHour = getHours(endTime) + getMinutes(endTime) / 60;
    const duration = endHour - startHour;
    
    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`
    };
  };
  
  // Calculate event row position for clean stacking like month view
  const getEventRowPosition = (event: CalendarEvent): number => {
    const eventsAtSameTime = filteredEvents.filter(e => {
      const eventStart = new Date(event.start);
      const eStart = new Date(e.start);
      return Math.abs(eventStart.getTime() - eStart.getTime()) < 900000; // Within 15 minutes
    }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    return eventsAtSameTime.findIndex(e => e.id === event.id);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <h2 className="text-2xl font-semibold text-foreground">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {/* Events stacked with no spacing */}
        <div className="space-y-0">
          {/* All-day events first */}
          {filteredEvents
            .filter(e => e.allDay)
            .map((event) => (
              <div
                key={event.id}
                className="text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 truncate"
                style={{
                  backgroundColor: `${event.color || "#3b82f6"}33`,
                  color: event.color || "#3b82f6",
                  borderLeft: `3px solid ${event.color || "#3b82f6"}`
                }}
                title={`${event.title}${event.location ? ` - ${event.location}` : ''}`}
              >
                {event.title}
              </div>
            ))}
          
          {/* Timed events sorted by start time */}
          {filteredEvents
            .filter(e => !e.allDay)
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .map((event) => (
              <div
                key={event.id}
                className="text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 truncate"
                style={{
                  backgroundColor: `${event.color || "#3b82f6"}33`,
                  color: event.color || "#3b82f6",
                  borderLeft: `3px solid ${event.color || "#3b82f6"}`
                }}
                title={`${event.title}${event.location ? ` - ${event.location}` : ''} (${format(new Date(event.start), "h:mm a")})`}
              >
                <span className="mr-1">{format(new Date(event.start), "h:mm")}</span>
                {event.title}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
