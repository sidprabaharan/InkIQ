
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
  
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div 
            key={day} 
            className="py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 flex-1 divide-x divide-y">
        {calendarDays.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div 
              key={i} 
              className={cn(
                "min-h-[120px] p-1 relative",
                !isCurrentMonth && "bg-gray-50 text-gray-400",
                isToday(day) && "bg-blue-50"
              )}
            >
              <div className={cn(
                "h-6 w-6 flex items-center justify-center text-sm rounded-full",
                isToday(day) && "bg-blue-600 text-white font-medium"
              )}>
                {getDate(day)}
              </div>
              
              <div className="mt-1 overflow-y-auto max-h-[80px] space-y-1">
                {dayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="text-xs p-1 rounded truncate"
                    style={{ 
                      backgroundColor: `${event.color}33`, // Add transparency
                      color: event.color,
                      borderLeft: `3px solid ${event.color}`
                    }}
                  >
                    {!event.allDay && (
                      <span className="mr-1 font-medium">
                        {format(new Date(event.start), 'h:mm a')}
                      </span>
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
  );
}
