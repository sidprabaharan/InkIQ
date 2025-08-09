
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
      
      <div className="flex flex-1 overflow-auto">
        {/* Time column */}
        <div className="w-20 flex-shrink-0 border-r bg-muted/10">
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
        
        {/* Events column */}
        <div className="flex-1 relative">
          {/* Hour divisions */}
          {hours.map(hour => (
            <div key={hour} className="h-16 border-t border-border/30 first:border-t-0 relative">
              {/* 30-minute line */}
              <div className="absolute top-8 left-0 right-0 h-px bg-border/20"></div>
            </div>
          ))}
          
          {/* All-day events - styled like month view */}
          {filteredEvents.filter(e => e.allDay).length > 0 && (
            <div className="absolute top-0 left-0 right-0 bg-muted/20 border-b p-2">
              <div className="space-y-0.5">
                {filteredEvents
                  .filter(e => e.allDay)
                  .map((event, index) => (
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
              </div>
            </div>
          )}
          
          {/* Timed events - styled exactly like month view rows */}
          {filteredEvents
            .filter(e => !e.allDay)
            .map((event, index) => {
              const { top, height } = getEventPosition(event);
              const rowPosition = getEventRowPosition(event);
              
              return (
                <div
                  key={event.id}
                  className="absolute left-2 right-2 text-xs px-1 py-0.5 rounded cursor-pointer hover:opacity-80 truncate z-10"
                  style={{
                    top: `${parseInt(top) + rowPosition * 20}px`, // Stack events that start at same time
                    height: `${Math.max(18, Math.min(parseInt(height), 40))}px`, // Limit height for readability
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
      </div>
    </div>
  );
}
