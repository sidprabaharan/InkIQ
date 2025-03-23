
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
  isToday,
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
  
  // Calculate width and left position for overlapping events
  const getEventWidthAndLeft = (event: CalendarEvent, day: Date, events: CalendarEvent[]) => {
    const eventsOnSameDay = events.filter(e => {
      if (e.id === event.id) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const eStart = new Date(e.start);
      const eEnd = new Date(e.end);
      
      // Check for time overlap
      return (
        isWithinInterval(eStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(eEnd, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(eventStart, { start: eStart, end: eEnd })
      );
    });
    
    if (eventsOnSameDay.length === 0) {
      return { width: '95%', left: '2%' };
    }
    
    // Find position in overlapping group
    const totalEvents = eventsOnSameDay.length + 1;
    let position = 0;
    
    eventsOnSameDay.forEach(e => {
      if (new Date(e.start) < new Date(event.start)) position++;
    });
    
    const width = 95 / totalEvents;
    const left = 2 + position * width;
    
    return { 
      width: `${width}%`, 
      left: `${left}%` 
    };
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
      {/* Week header */}
      <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10 select-none">
        <div className="p-2 border-r text-center text-xs font-medium text-gray-500">
          GMT-04
        </div>
        {days.map((day, i) => {
          const isCurrentDay = isToday(day);
          
          return (
            <div 
              key={i} 
              className={cn(
                "p-2 text-center",
                isCurrentDay && "bg-blue-50"
              )}
            >
              <div className="text-xs font-medium">{format(day, 'EEE').toUpperCase()}</div>
              <div className={cn(
                "text-xl inline-flex h-10 w-10 items-center justify-center rounded-full font-normal",
                isCurrentDay && "bg-blue-600 text-white font-medium"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Week grid */}
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
        
        {/* Days columns with events */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            
            return (
              <div key={dayIndex} className="relative border-r">
                {/* Hour divisions */}
                {hours.map(hour => (
                  <div key={hour} className="h-[60px] border-b border-gray-200 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-100"></div>
                    <div className="absolute top-[30px] left-0 w-full h-[1px] bg-gray-50"></div>
                  </div>
                ))}
                
                {/* Events */}
                {dayEvents.map((event, eventIndex) => {
                  const position = getEventPositionForDay(event, day);
                  if (!position) return null;
                  
                  const { width, left } = getEventWidthAndLeft(event, day, dayEvents);
                  const isAllDay = event.allDay;
                  const eventColor = event.color || getCategoryColor(event.category);
                  
                  if (isAllDay) {
                    return (
                      <div
                        key={event.id}
                        className="absolute top-0 left-0 right-0 h-6 px-2 text-xs truncate z-10 font-medium"
                        style={{
                          backgroundColor: eventColor,
                          color: 'white',
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  }
                  
                  return (
                    <div
                      key={event.id}
                      className="absolute px-2 truncate text-xs hover:z-20 rounded-sm"
                      style={{
                        top: `${position.top}px`,
                        height: `${position.height}px`,
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
                      <div className="truncate">{event.title}</div>
                      {event.location && (
                        <div className="truncate text-white/80 text-[10px]">{event.location}</div>
                      )}
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
