import { CalendarEvent } from "@/pages/Calendar";
import { ProductionEventCard } from "./ProductionEventCard";
import { MeetingEventCard } from "./MeetingEventCard";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: CalendarEvent;
  className?: string;
}

function DefaultEventCard({ event, className = "" }: EventCardProps) {
  const categoryColors: Record<string, string> = {
    task: "bg-red-100 border-red-300 text-red-800",
    order: "bg-blue-100 border-blue-300 text-blue-800",
    work: "bg-gray-100 border-gray-300 text-gray-700",
    personal: "bg-pink-100 border-pink-300 text-pink-800",
    follow_up: "bg-yellow-100 border-yellow-300 text-yellow-800",
    artwork_approval: "bg-orange-100 border-orange-300 text-orange-800",
    customer_call: "bg-purple-100 border-purple-300 text-purple-800",
  };

  const categoryClass = categoryColors[event.category] || "bg-gray-100 border-gray-300 text-gray-700";

  return (
    <div 
      className={`p-2 rounded-md border-l-4 text-xs bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="font-medium text-gray-900 truncate flex-1 mr-1">
          {event.title}
        </div>
        <Badge variant="outline" className={`px-1 py-0 text-xs ${categoryClass}`}>
          {event.category.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
      
      {!event.allDay && (
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Clock className="h-3 w-3" />
          <span>
            {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
          </span>
        </div>
      )}

      {event.location && (
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{event.location}</span>
        </div>
      )}

      {event.description && (
        <div className="text-gray-500 mt-1 line-clamp-2">
          {event.description}
        </div>
      )}
    </div>
  );
}

export function EventCard({ event, className }: EventCardProps) {
  // Render specialized cards for different event types
  if (event.category === "production_job") {
    return <ProductionEventCard event={event} className={className} />;
  }
  
  if (event.category === "meeting" || event.category === "customer_call") {
    return <MeetingEventCard event={event} className={className} />;
  }
  
  // Default card for other event types
  return <DefaultEventCard event={event} className={className} />;
}