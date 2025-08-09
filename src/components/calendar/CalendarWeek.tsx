
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
      <div className="grid border-b sticky top-0 bg-background z-10" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
        <div className="p-3 border-r text-center text-sm font-medium text-muted-foreground bg-muted/20">
          GMT-5
        </div>
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

      {/* Main calendar grid - single grid container for perfect alignment */}
      <div className="flex-1 overflow-auto">
        <div className="grid h-full" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
          {/* Time column */}
          <div className="border-r bg-muted/10">
            {hours.map(hour => (
              <div key={hour} className="h-16 relative border-t border-border/30 first:border-t-0">
                <div className="absolute -top-2 right-3 text-xs text-muted-foreground font-medium">
                  {hour === 0 ? null : (
                    <>
                      {hour % 12 === 0 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            
            return (
              <div key={dayIndex} className="relative border-r last:border-r-0">
                {/* Hour grid lines */}
                {hours.map(hour => (
                  <div key={hour} className="h-16 border-t border-border/30 first:border-t-0 relative">
                    {/* 30-minute line */}
                    <div className="absolute top-8 left-0 right-0 h-px bg-border/20"></div>
                  </div>
                ))}
                
                {/* Events for this day - displayed as clean rows like month view */}
                {dayEvents.map(event => {
                  const position = getEventPositionForDay(event, day);
                  const rowPosition = getEventRowPosition(event, day, dayEvents);
                  
                  if (!position) return null;
                  
                  // All-day events get special treatment at the top
                  if (event.allDay) {
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 h-5 text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 truncate z-10"
                        style={{
                          top: `${rowPosition * 22}px`,
                          backgroundColor: `${event.color || "#3b82f6"}33`,
                          color: event.color || "#3b82f6",
                          borderLeft: `3px solid ${event.color || "#3b82f6"}`
                        }}
                        title={`${event.title}${event.location ? ` - ${event.location}` : ''}`}
                      >
                        {event.title}
                      </div>
                    );
                  }
                  
                  // Regular timed events - positioned based on time but displayed as clean rows
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 truncate z-10"
                      style={{
                        top: `${position.top * (64/60) + rowPosition * 20}px`, // Stack events that start at same time
                        height: `${Math.max(18, Math.min(position.height * (64/60), 40))}px`, // Limit height for readability
                        backgroundColor: `${event.color || "#3b82f6"}33`,
                        color: event.color || "#3b82f6",
                        borderLeft: `3px solid ${event.color || "#3b82f6"}`
                      }}
                      title={`${event.title}${event.location ? ` - ${event.location}` : ''} (${format(new Date(event.start), "h:mm a")})`}
                    >
                      <span className="mr-1">{format(new Date(event.start), "h:mm")}</span>
                      {event.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
