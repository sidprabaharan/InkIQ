import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";
import { CalendarEvent } from "@/pages/Calendar";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

interface CalendarAgendaProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function CalendarAgenda({ currentDate, events }: CalendarAgendaProps) {
  // Get current week
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const getEventsForDay = (day: Date) => {
    return events
      .filter(event => isSameDay(new Date(event.start), day))
      .sort((a, b) => {
        // Sort all-day events first, then by time
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
  };

  return (
    <div className="space-y-6">
      {weekDays.map((day) => {
        const dayEvents = getEventsForDay(day);
        
        return (
          <div key={day.toISOString()} className="space-y-2">
            <div className={cn(
              "flex items-center gap-3 border-b pb-2",
              isToday(day) && "border-primary"
            )}>
              <div className={cn(
                "flex flex-col items-center justify-center min-w-[60px]",
                isToday(day) && "text-primary font-medium"
              )}>
                <div className="text-sm text-muted-foreground uppercase">
                  {format(day, "EEE")}
                </div>
                <div className={cn(
                  "text-2xl font-semibold",
                  isToday(day) && "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm"
                )}>
                  {format(day, "d")}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {format(day, "EEEE, MMMM d")}
                </h3>
                {dayEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground">No events scheduled</p>
                )}
              </div>
            </div>
            
            {dayEvents.length > 0 && (
              <div className="ml-[75px] space-y-2">
                {dayEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="min-w-[80px] text-sm text-muted-foreground pt-1">
                      {event.allDay ? (
                        "All day"
                      ) : (
                        <>
                          {format(new Date(event.start), "h:mm a")}
                          {event.start !== event.end && (
                            <>
                              {" - "}
                              {format(new Date(event.end), "h:mm a")}
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex-1">
                      <EventCard 
                        event={event}
                        className="border shadow-sm hover:shadow-md transition-shadow"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}