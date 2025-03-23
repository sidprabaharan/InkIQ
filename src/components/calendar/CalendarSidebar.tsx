
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent } from "@/pages/Calendar";
import { CheckCircle, CheckSquare, Clock, Plus, Calendar as CalendarIcon } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalendarSidebarProps {
  events: CalendarEvent[];
  onCreateEvent: () => void;
}

export function CalendarSidebar({ events, onCreateEvent }: CalendarSidebarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Get today's events
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const today = new Date();
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });
  
  return (
    <div className="w-64 border-r bg-white flex flex-col h-full overflow-hidden">
      <div className="p-4">
        <Button 
          onClick={onCreateEvent}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Create Event</span>
        </Button>
      </div>
      
      <div className="px-4 pb-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
      
      <Separator className="my-2" />
      
      <div className="p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Clock size={16} />
          <span>Today's Events</span>
        </h3>
        
        <ScrollArea className="h-[220px] pr-2">
          {todaysEvents.length > 0 ? (
            <div className="space-y-2">
              {todaysEvents.map((event) => (
                <div 
                  key={event.id}
                  className="p-2 rounded-md text-sm"
                  style={{ 
                    backgroundColor: `${event.color}15`,
                    borderLeft: `3px solid ${event.color}`
                  }}
                >
                  <div className="font-medium">{event.title}</div>
                  {!event.allDay && (
                    <div className="text-xs text-gray-500">
                      {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No events today
            </div>
          )}
        </ScrollArea>
      </div>
      
      <Separator className="my-2" />
      
      <div className="px-4 pb-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <CheckSquare size={16} />
          <span>My Calendars</span>
        </h3>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4285F4]"></div>
            <span className="text-sm">Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0F9D58]"></div>
            <span className="text-sm">Personal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#DB4437]"></div>
            <span className="text-sm">Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
