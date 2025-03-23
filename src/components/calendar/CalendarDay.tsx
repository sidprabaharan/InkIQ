
import { 
  format, 
  isToday,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isWithinInterval,
  getHours,
  getMinutes,
  differenceInMinutes,
  addHours
} from "date-fns";
import { CalendarEvent } from "@/pages/Calendar";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarDay({ currentDate, events }: CalendarDayProps) {
  const dayStart = startOfDay(currentDate);
  const dayEnd = endOfDay(currentDate);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const allDayEvents = events.filter(event => 
    event.allDay && 
    isWithinInterval(new Date(event.start), { start: dayStart, end: dayEnd })
  );
  
  const getEventsForHour = (hour: number) => {
    const hourStart = new Date(currentDate);
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
      <div className="text-center py-2 border-b">
        <div className="text-md font-medium">
          {format(currentDate, 'EEEE')}
        </div>
        <div className={cn(
          "h-8 w-8 mx-auto flex items-center justify-center text-md rounded-full",
          isToday(currentDate) && "bg-blue-600 text-white font-medium"
        )}>
          {format(currentDate, 'd')}
        </div>
      </div>
      
      {/* All-day events section */}
      {allDayEvents.length > 0 && (
        <div className="border-b p-2">
          <div className="text-xs font-medium mb-1">All Day</div>
          <div className="space-y-1">
            {allDayEvents.map(event => (
              <div 
                key={event.id}
                className="text-sm p-2 rounded"
                style={{ 
                  backgroundColor: `${event.color}33`, // Add transparency
                  color: event.color,
                  borderLeft: `3px solid ${event.color}`
                }}
              >
                <div className="font-medium">{event.title}</div>
                {event.location && (
                  <div className="text-xs">{event.location}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_1fr] divide-x">
          {hours.map(hour => {
            const hourEvents = getEventsForHour(hour);
            
            return (
              <React.Fragment key={hour}>
                <div className="text-xs text-right pr-2 py-2 border-b">
                  {format(new Date().setHours(hour), 'h a')}
                </div>
                <div className="border-b relative h-20">
                  {hourEvents.map(event => {
                    const eventHour = getHours(new Date(event.start));
                    
                    // Only position events that start in this hour cell
                    if (eventHour === hour) {
                      const style = calculateEventPosition(event, hour);
                      
                      return (
                        <div 
                          key={event.id}
                          className="absolute left-0 right-1 z-10 rounded p-2 overflow-hidden"
                          style={{
                            ...style,
                            backgroundColor: event.color || '#4285F4',
                            color: 'white'
                          }}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-xs truncate">
                            {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                          </div>
                          {event.location && parseInt(style.height) > 30 && (
                            <div className="text-xs truncate mt-1">
                              {event.location}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
