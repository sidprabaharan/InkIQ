
import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday,
  getHours,
  getDate
} from "date-fns";
import { CalendarEvent } from "@/pages/Calendar";
import { cn } from "@/lib/utils";

interface CalendarMonthProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarMonth({ currentDate, events }: CalendarMonthProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.start), day));
  };

  const getDayNumber = (day: Date) => {
    const date = getDate(day);
    
    // If it's the first day of the month and not in the current month, show the full date
    if (date === 1 && !isSameMonth(day, monthStart)) {
      return `${format(day, 'MMM')} ${date}`;
    }
    return date;
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
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
          <div 
            key={day} 
            className="py-2 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 flex-1 divide-x divide-y border-gray-200">
        {calendarDays.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div 
              key={i} 
              className={cn(
                "min-h-[100px] relative",
                !isCurrentMonth && "bg-gray-50",
                isToday(day) && "bg-blue-50"
              )}
            >
              <div className="p-1 border-b border-gray-100">
                <div className={cn(
                  "h-7 w-7 flex items-center justify-center text-sm rounded-full",
                  isToday(day) && "bg-blue-600 text-white font-medium",
                  !isCurrentMonth && "text-gray-400"
                )}>
                  {getDayNumber(day)}
                </div>
              </div>
              
              <div className="px-1 py-0.5 overflow-y-auto max-h-[150px]">
                {dayEvents.map((event) => {
                  const eventColor = event.color || getCategoryColor(event.category);
                  
                  return (
                    <div 
                      key={event.id}
                      className="mb-1 text-xs p-1 px-2 rounded-sm truncate flex items-baseline gap-1 hover:bg-gray-100"
                      style={{ 
                        borderLeft: `3px solid ${eventColor}`
                      }}
                    >
                      <span 
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: eventColor }}
                      />
                      
                      {!event.allDay && (
                        <span className="font-medium whitespace-nowrap">
                          {format(new Date(event.start), 'h:mma')}
                        </span>
                      )}
                      <span className="truncate">{event.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
