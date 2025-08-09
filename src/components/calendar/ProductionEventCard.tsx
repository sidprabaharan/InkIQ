import { CalendarEvent } from "@/pages/Calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Wrench, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ProductionEventCardProps {
  event: CalendarEvent;
  className?: string;
}

const decorationMethodColors: Record<string, string> = {
  screen_printing: "bg-blue-100 border-blue-300 text-blue-800",
  embroidery: "bg-green-100 border-green-300 text-green-800",
  dtf: "bg-red-100 border-red-300 text-red-800",
  dtg: "bg-orange-100 border-orange-300 text-orange-800",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 border-gray-300 text-gray-700",
  medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
  high: "bg-red-100 border-red-300 text-red-800",
};

export function ProductionEventCard({ event, className = "" }: ProductionEventCardProps) {
  const decorationMethodClass = event.decorationMethod 
    ? decorationMethodColors[event.decorationMethod] || "bg-blue-100 border-blue-300 text-blue-800"
    : "bg-blue-100 border-blue-300 text-blue-800";

  const priorityClass = event.priority 
    ? priorityColors[event.priority] || "bg-gray-100 border-gray-300 text-gray-700"
    : "bg-gray-100 border-gray-300 text-gray-700";

  return (
    <div 
      className={`p-2 rounded-md border-l-4 text-xs bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="font-medium text-gray-900 truncate flex-1 mr-1">
          {event.title}
        </div>
        <div className="flex gap-1">
          {event.priority && (
            <Badge variant="outline" className={`px-1 py-0 text-xs ${priorityClass}`}>
              {event.priority.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>
      
      {!event.allDay && (
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Clock className="h-3 w-3" />
          <span>
            {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
          </span>
        </div>
      )}

      {event.customerName && (
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <User className="h-3 w-3" />
          <span className="truncate">{event.customerName}</span>
        </div>
      )}

      {event.equipmentId && (
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Wrench className="h-3 w-3" />
          <span className="truncate">{event.equipmentId}</span>
        </div>
      )}

      {event.decorationMethod && (
        <Badge variant="outline" className={`px-1 py-0 text-xs mt-1 ${decorationMethodClass}`}>
          {event.decorationMethod.replace('_', ' ').toUpperCase()}
        </Badge>
      )}

      {event.estimatedHours && (
        <div className="text-gray-500 mt-1">
          Est: {event.estimatedHours.toFixed(1)}h
        </div>
      )}
    </div>
  );
}