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
              <div className="ml-[75px] space-y-1">
                {dayEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 py-2 px-3 hover:bg-accent rounded-sm group cursor-pointer">
                    <div className="min-w-[80px] text-sm text-muted-foreground">
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
                    
                    <div 
                      className="w-1 h-8 rounded-full mr-2"
                      style={{ backgroundColor: event.color || "#3b82f6" }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        <span className={cn(
                          "px-2 py-0.5 text-xs rounded-full uppercase font-medium",
                          event.category === "production_job" && "bg-blue-100 text-blue-800",
                          event.category === "meeting" && "bg-green-100 text-green-800",
                          event.category === "customer_call" && "bg-purple-100 text-purple-800",
                          event.category === "follow_up" && "bg-orange-100 text-orange-800",
                          event.category === "artwork_approval" && "bg-yellow-100 text-yellow-800"
                        )}>
                          {event.category.replace("_", " ")}
                        </span>
                        {event.priority === "high" && (
                          <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-800 font-medium uppercase">
                            HIGH
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {event.location && (
                          <span className="flex items-center gap-1">
                            📍 {event.location}
                          </span>
                        )}
                        {event.customerName && (
                          <span className="flex items-center gap-1">
                            👤 {event.customerName}
                          </span>
                        )}
                        {event.estimatedHours && (
                          <span>Est: {event.estimatedHours}h</span>
                        )}
                        {event.meetingProvider && event.meetingProvider !== "none" && (
                          <span className="flex items-center gap-1 text-blue-600">
                            📹 {event.meetingProvider.toUpperCase()}
                          </span>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <span>{event.attendees.length} attendees</span>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {event.description}
                        </p>
                      )}
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