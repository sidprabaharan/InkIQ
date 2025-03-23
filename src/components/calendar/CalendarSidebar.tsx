
import { useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarEvent } from "@/pages/Calendar";

interface CalendarSidebarProps {
  events: CalendarEvent[];
  onCreateEvent: () => void;
}

export function CalendarSidebar({ events, onCreateEvent }: CalendarSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filters, setFilters] = useState({
    task: true,
    order: true,
    work: true,
    personal: true
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters({
      ...filters,
      [key]: !filters[key]
    });
  };

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-4">
        <Button 
          className="w-full justify-start gap-2"
          onClick={onCreateEvent}
        >
          <Plus size={16} />
          Create Event
        </Button>
      </div>

      <div className="p-4 border-t">
        <Calendar 
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
        />
      </div>

      <div className="p-4 border-t">
        <h3 className="text-sm font-medium mb-3">My Calendars</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox 
              id="filter-task" 
              checked={filters.task} 
              onCheckedChange={() => toggleFilter("task")}
              className="border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label htmlFor="filter-task" className="ml-2 text-sm font-medium flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
              Tasks
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="filter-order" 
              checked={filters.order} 
              onCheckedChange={() => toggleFilter("order")}
              className="border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label htmlFor="filter-order" className="ml-2 text-sm font-medium flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
              Orders
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="filter-work" 
              checked={filters.work} 
              onCheckedChange={() => toggleFilter("work")}
              className="border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <label htmlFor="filter-work" className="ml-2 text-sm font-medium flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
              Work
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="filter-personal" 
              checked={filters.personal} 
              onCheckedChange={() => toggleFilter("personal")}
              className="border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <label htmlFor="filter-personal" className="ml-2 text-sm font-medium flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-600 mr-2"></span>
              Personal
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 border-t mt-auto">
        <h3 className="text-sm font-medium mb-2">Upcoming Events</h3>
        <div className="space-y-2">
          {events
            .filter(e => new Date(e.start) >= new Date())
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .slice(0, 3)
            .map(event => (
              <div key={event.id} className="text-sm p-1.5 border-l-4 rounded-sm" style={{ borderLeftColor: event.color }}>
                <div className="font-medium">{event.title}</div>
                <div className="text-gray-500">
                  {event.allDay ? (
                    format(new Date(event.start), 'MMM d')
                  ) : (
                    format(new Date(event.start), 'MMM d, h:mm a')
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
