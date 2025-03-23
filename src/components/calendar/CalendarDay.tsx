
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
  isToday,
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
  
  // Determine if events overlap
  const getEventWidth = (event: CalendarEvent, index: number) => {
    const overlappingEvents = filteredEvents.filter(e => {
      if (e.id === event.id) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const eStart = new Date(e.start);
      const eEnd = new Date(e.end);
      
      return (
        isWithinInterval(eStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(eEnd, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(eventStart, { start: eStart, end: eEnd })
      );
    });
    
    if (overlappingEvents.length === 0) return '96%';
    
    // Find position in overlapping group
    const totalEvents = overlappingEvents.length + 1;
    const width = 95 / totalEvents;
    
    return `${width}%`;
  };
  
  const getEventLeft = (event: CalendarEvent, index: number) => {
    const overlappingEvents = filteredEvents.filter(e => {
      if (e.id === event.id) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const eStart = new Date(e.start);
      const eEnd = new Date(e.end);
      
      return (
        isWithinInterval(eStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(eEnd, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(eventStart, { start: eStart, end: eEnd })
      );
    });
    
    if (overlappingEvents.length === 0) return '2%';
    
    // Find position in overlapping group
    let position = 0;
    overlappingEvents.forEach(e => {
      if (new Date(e.start) < new Date(event.start)) position++;
    });
    
    const totalEvents = overlappingEvents.length + 1;
    const width = 95 / totalEvents;
    const left = 2 + position * width;
    
    return `${left}%`;
  };
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'task':
        return '#4285F4'; // Blue
      case 'order':
        return '#F4B400'; // Yellow/Gold
      case 'work':
        return '#0F9D58'; // Green
      case 'personal':
        return '#DB4437'; // Red
      default:
        return '#4285F4';
    }
  };
  
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-2">
        <div className="flex items-center">
          <h2 className="text-2xl font-normal">
            {format(currentDate, 'MMMM d, yyyy')}
          </h2>
          {isToday(currentDate) && (
            <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-sm">
              Today
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-auto">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r">
          {hours.map(hour => (
            <div key={hour} className="h-[60px] relative border-b text-xs text-gray-500 pr-2 -mt-2.5">
              {hour === 0 ? null : (
                <div className="absolute right-2">
                  {hour % 12 === 0 ? '12' : hour % 12} {hour >= 12 ? 'PM' : 'AM'}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Events column */}
        <div className="flex-1 relative">
          {/* Hour divisions */}
          {hours.map(hour => (
            <div key={hour} className="h-[60px] border-b border-gray-200 relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-100"></div>
              <div className="absolute top-[30px] left-0 w-full h-[1px] bg-gray-50"></div>
            </div>
          ))}
          
          {/* All-day events */}
          {filteredEvents.filter(e => e.allDay).length > 0 && (
            <div className="absolute top-0 left-0 right-0 bg-gray-50 border-b z-10">
              <div className="p-1 flex flex-wrap gap-1">
                {filteredEvents
                  .filter(e => e.allDay)
                  .map((event, index) => {
                    const eventColor = event.color || getCategoryColor(event.category);
                    
                    return (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded-sm truncate font-medium"
                        style={{
                          backgroundColor: eventColor,
                          color: 'white',
                          width: 'calc(100% - 8px)',
                          margin: '2px 4px'
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          
          {/* Timed events */}
          {filteredEvents
            .filter(e => !e.allDay)
            .map((event, index) => {
              const { top, height } = getEventPosition(event);
              const width = getEventWidth(event, index);
              const left = getEventLeft(event, index);
              const eventColor = event.color || getCategoryColor(event.category);
              
              return (
                <div
                  key={event.id}
                  className="absolute px-2 rounded-sm truncate shadow-sm text-xs hover:z-10"
                  style={{
                    top,
                    height,
                    width,
                    left,
                    backgroundColor: eventColor,
                    color: 'white',
                    overflow: 'hidden'
                  }}
                >
                  <div className="font-medium">
                    {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                  </div>
                  <div className="truncate font-medium">{event.title}</div>
                  {event.location && (
                    <div className="truncate text-white/80 text-[10px]">{event.location}</div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
