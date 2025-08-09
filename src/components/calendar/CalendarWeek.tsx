
import React from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  addHours,
  startOfDay,
  getHours,
  getMinutes,
  isWithinInterval,
  parseISO,
  addMinutes
} from 'date-fns';
import { CalendarEvent } from '@/pages/Calendar';
import { cn } from '@/lib/utils';

interface CalendarWeekProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarWeek({ currentDate, events }: CalendarWeekProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Calculate event position and height
  const getEventPositionForDay = (event: CalendarEvent, day: Date) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Check if event starts or ends on this day
    if (!isSameDay(eventStart, day) && !isSameDay(eventEnd, day)) {
      // Check if day is between start and end of multi-day event
      const dayStart = startOfDay(day);
      const dayEnd = addHours(dayStart, 24);
      
      if (eventStart < dayStart && eventEnd > dayEnd) {
        // Day is in the middle of a multi-day event
        return {
          top: 0,
          height: 24 * 60 // Full day height
        };
      }
      
      return null; // Event not on this day
    }
    
    let start = eventStart;
    let end = eventEnd;
    
    // If event starts on a different day, set start to beginning of this day
    if (!isSameDay(eventStart, day)) {
      start = startOfDay(day);
    }
    
    // If event ends on a different day, set end to end of this day
    if (!isSameDay(eventEnd, day)) {
      end = addHours(startOfDay(day), 24);
    }
    
    const startHour = getHours(start) + getMinutes(start) / 60;
    const endHour = getHours(end) + getMinutes(end) / 60;
    const duration = endHour - startHour;
    
    return {
      top: startHour * 60,
      height: duration * 60
    };
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Check if the event is on this day
      if (isSameDay(eventStart, day) || isSameDay(eventEnd, day)) {
        return true;
      }
      
      // Check if this day is within a multi-day event
      const dayStart = startOfDay(day);
      const dayEnd = addHours(dayStart, 24);
      
      return eventStart < dayEnd && eventEnd > dayStart;
    });
  };
  
  // Calculate event stacking for clean row display like month view
  const getEventRowPosition = (event: CalendarEvent, day: Date, events: CalendarEvent[]): number => {
    const eventsOnSameDay = events.filter(e => {
      const eventStart = new Date(e.start);
      const eventEnd = new Date(e.end);
      return (
        isSameDay(eventStart, day) || isSameDay(eventEnd, day) ||
        (eventStart < day && eventEnd > day)
      );
    }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    return eventsOnSameDay.findIndex(e => e.id === event.id);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Week header - using CSS grid for perfect alignment */}
      <div className="grid grid-cols-7 border-b sticky top-0 bg-background z-10">
        {days.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div key={i} className="p-3 text-center border-r last:border-r-0">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {format(day, 'EEE')}
              </div>
              <div className={cn(
                "text-lg font-semibold mt-1",
                isToday 
                  ? "text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto" 
                  : "text-foreground"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main calendar grid - no time column, just day columns */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 h-full">
          {/* Day columns */}
          {days.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            
            return (
              <div key={dayIndex} className="border-r last:border-r-0 p-2">
                {/* Events for this day - stacked with no spacing */}
                <div className="space-y-0">
                  {dayEvents.map((event, eventIndex) => (
                    <div
                      key={event.id}
                      className="text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 truncate"
                      style={{
                        backgroundColor: `${event.color || "#3b82f6"}33`,
                        color: event.color || "#3b82f6",
                        borderLeft: `3px solid ${event.color || "#3b82f6"}`
                      }}
                      title={`${event.title}${event.location ? ` - ${event.location}` : ''}${!event.allDay ? ` (${format(new Date(event.start), "h:mm a")})` : ''}`}
                    >
                      {!event.allDay && (
                        <span className="mr-1">{format(new Date(event.start), "h:mm")}</span>
                      )}
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
