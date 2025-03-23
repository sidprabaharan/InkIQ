
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  eachHourOfInterval, 
  format, 
  isSameDay, 
  isToday,
  addHours,
  getHours,
  getMinutes,
  differenceInMinutes,
  isWithinInterval
} from "date-fns";
import { CalendarEvent } from "@/pages/Calendar";
import { cn } from "@/lib/utils";

interface CalendarWeekProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarWeek({ currentDate, events }: CalendarWeekProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(weekStart);
  
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventsForDayAndHour = (day: Date, hour: number) => {
    const hourStart = new Date(day);
    hourStart.setHours(hour, 0, 0, 0);
    
    const hourEnd = new Date(hourStart);
    hourEnd.setHours(hour + 1, 0, 0, 0);
    
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Skip all-day events (handled separately)
      if (event.allDay) return false;
      
      // Check if event overlaps with this hour
      return isWithinInterval(hourStart, { start: eventStart, end: eventEnd }) ||
             isWithinInterval(eventEnd, { start: hourStart, end: hourEnd }) ||
             (eventStart <= hourStart && eventEnd >= hourEnd);
    });
  };
  
  const getAllDayEvents = (day: Date) => {
    return events.filter(event => 
      event.allDay && isSameDay(new Date(event.start), day)
    );
  };
  
  const calculateEventPosition = (event: CalendarEvent, hour: number) => {
    const eventStart = new Date(event.start);
    const hourStart = new Date(eventStart);
    hourStart.setHours(hour, 0, 0, 0);
    
    const minutesOffset = differenceInMinutes(eventStart, hourStart);
    const eventDuration = differenceInMinutes(new Date(event.end), eventStart);
    
    // Calculate top position based on minutes offset
    const top = (minutesOffset / 60) * 100;
    
    // Calculate height based on event duration (max 60 minutes per cell)
    const height = Math.min((eventDuration / 60) * 100, 100);
    
    return {
      top: `${top}%`,
      height: `${height}%`,
      maxHeight: hour === 23 ? '100%' : 'none'
    };
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-[50px_repeat(7,1fr)] border-b">
        <div />
        {weekDays.map((day, i) => (
          <div 
            key={i} 
            className={cn(
              "py-2 text-center",
              isToday(day) && "bg-blue-50"
            )}
          >
            <div className="text-sm font-medium">
              {format(day, 'EEE')}
            </div>
            <div className={cn(
              "h-7 w-7 mx-auto flex items-center justify-center text-sm rounded-full",
              isToday(day) && "bg-blue-600 text-white font-medium"
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      {/* All-day events row */}
      <div className="grid grid-cols-[50px_repeat(7,1fr)] border-b">
        <div className="text-xs py-1 px-2 flex items-center justify-center font-medium">
          All Day
        </div>
        {weekDays.map((day, i) => {
          const allDayEvents = getAllDayEvents(day);
          
          return (
            <div 
              key={i} 
              className={cn(
                "p-1 relative min-h-[30px]",
                isToday(day) && "bg-blue-50"
              )}
            >
              {allDayEvents.map(event => (
                <div 
                  key={event.id}
                  className="text-xs p-1 mb-1 rounded truncate"
                  style={{ 
                    backgroundColor: `${event.color}33`, // Add transparency
                    color: event.color,
                    borderLeft: `3px solid ${event.color}`
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[50px_repeat(7,1fr)] divide-x h-full">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-right pr-2 py-2 border-b border-r">
                {format(new Date().setHours(hour), 'h a')}
              </div>
              
              {weekDays.map((day, dayIndex) => {
                const hourEvents = getEventsForDayAndHour(day, hour);
                
                return (
                  <div 
                    key={`${hour}-${dayIndex}`} 
                    className={cn(
                      "border-b relative h-12",
                      isToday(day) && "bg-blue-50/50"
                    )}
                  >
                    {hourEvents.map(event => {
                      const eventHour = getHours(new Date(event.start));
                      
                      // Only position events that start in this hour cell
                      if (eventHour === hour) {
                        const style = calculateEventPosition(event, hour);
                        
                        return (
                          <div 
                            key={event.id}
                            className="absolute left-0 right-1 z-10 rounded px-1 overflow-hidden text-xs"
                            style={{
                              ...style,
                              backgroundColor: event.color || '#4285F4',
                              color: 'white'
                            }}
                          >
                            <div className="font-medium truncate">
                              {event.title}
                            </div>
                            {parseInt(style.height) > 25 && (
                              <div className="truncate">
                                {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
