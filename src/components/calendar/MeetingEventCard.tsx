import { CalendarEvent } from "@/pages/Calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Video, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface MeetingEventCardProps {
  event: CalendarEvent;
  className?: string;
}

const meetingProviderIcons: Record<string, string> = {
  google_meet: "🎥",
  zoom: "📹",
  teams: "💻",
};

const meetingProviderColors: Record<string, string> = {
  google_meet: "bg-blue-100 border-blue-300 text-blue-800",
  zoom: "bg-purple-100 border-purple-300 text-purple-800",
  teams: "bg-indigo-100 border-indigo-300 text-indigo-800",
};

export function MeetingEventCard({ event, className = "" }: MeetingEventCardProps) {
  const providerClass = event.meetingProvider 
    ? meetingProviderColors[event.meetingProvider] || "bg-green-100 border-green-300 text-green-800"
    : "bg-green-100 border-green-300 text-green-800";

  const handleMeetingLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.meetingLink) {
      window.open(event.meetingLink, '_blank');
    }
  };

  return (
    <div 
      className={`p-2 rounded-md border-l-4 text-xs bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="font-medium text-gray-900 truncate flex-1 mr-1">
          {event.title}
        </div>
        {event.meetingProvider && event.meetingProvider !== "none" && (
          <Badge variant="outline" className={`px-1 py-0 text-xs ${providerClass}`}>
            {meetingProviderIcons[event.meetingProvider]} {event.meetingProvider.replace('_', ' ').toUpperCase()}
          </Badge>
        )}
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

      {event.attendees && event.attendees.length > 0 && (
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Users className="h-3 w-3" />
          <span className="truncate">
            {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {event.meetingLink && (
        <button
          onClick={handleMeetingLinkClick}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-1 text-xs"
        >
          <Video className="h-3 w-3" />
          <span>Join Meeting</span>
          <ExternalLink className="h-2 w-2" />
        </button>
      )}

      {event.description && (
        <div className="text-gray-500 mt-1 line-clamp-2">
          {event.description}
        </div>
      )}
    </div>
  );
}