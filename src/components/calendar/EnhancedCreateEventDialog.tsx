import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarEvent, CalendarEventCategory, MeetingProvider } from "@/pages/Calendar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Video, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedCreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Omit<CalendarEvent, "id">) => void;
}

const eventCategories: { value: CalendarEventCategory; label: string }[] = [
  { value: "meeting", label: "Meeting" },
  { value: "customer_call", label: "Customer Call" },
  { value: "follow_up", label: "Follow-up" },
  { value: "task", label: "Task" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
];

const meetingProviders: { value: MeetingProvider; label: string }[] = [
  { value: "google_meet", label: "Google Meet" },
  { value: "zoom", label: "Zoom" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "none", label: "No video call" },
];

export function EnhancedCreateEventDialog({ open, onOpenChange, onAddEvent }: EnhancedCreateEventDialogProps) {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "meeting" as CalendarEventCategory,
    location: "",
    allDay: false,
    meetingProvider: "none" as MeetingProvider,
    meetingLink: "",
    attendees: "",
  });

  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDate = new Date(date);
    const endDate = new Date(date);
    
    if (!eventData.allDay) {
      startDate.setHours(startHour, startMinute, 0, 0);
      endDate.setHours(endHour, endMinute, 0, 0);
    }

    const newEvent: Omit<CalendarEvent, "id"> = {
      title: eventData.title,
      description: eventData.description,
      start: startDate,
      end: endDate,
      allDay: eventData.allDay,
      category: eventData.category,
      location: eventData.location,
      meetingProvider: eventData.meetingProvider !== "none" ? eventData.meetingProvider : undefined,
      meetingLink: generateMeetingLink(eventData.meetingProvider, eventData.meetingLink),
      attendees: eventData.attendees ? eventData.attendees.split(',').map(email => email.trim()) : undefined,
    };

    onAddEvent(newEvent);
    resetForm();
  };

  const generateMeetingLink = (provider: MeetingProvider, customLink: string): string | undefined => {
    if (customLink) return customLink;
    
    if (provider === "google_meet") {
      return `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;
    } else if (provider === "zoom") {
      return `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
    } else if (provider === "teams") {
      return `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(2, 15)}`;
    }
    
    return undefined;
  };

  const resetForm = () => {
    setEventData({
      title: "",
      description: "",
      category: "meeting",
      location: "",
      allDay: false,
      meetingProvider: "none",
      meetingLink: "",
      attendees: "",
    });
    setDate(new Date());
    setStartTime("09:00");
    setEndTime("10:00");
  };

  const isMeetingType = eventData.category === "meeting" || eventData.category === "customer_call";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              placeholder="Event title"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Event Type</Label>
            <Select 
              value={eventData.category} 
              onValueChange={(value) => setEventData({ ...eventData, category: value as CalendarEventCategory })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              placeholder="Event description (optional)"
              rows={3}
            />
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={eventData.allDay}
              onCheckedChange={(checked) => setEventData({ ...eventData, allDay: checked as boolean })}
            />
            <Label htmlFor="allDay">All day event</Label>
          </div>

          {/* Time Selection */}
          {!eventData.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <Label htmlFor="location">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location
            </Label>
            <Input
              id="location"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              placeholder="Event location (optional)"
            />
          </div>

          {/* Meeting-specific fields */}
          {isMeetingType && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <Label className="text-sm font-medium">Meeting Settings</Label>
              </div>
              
              {/* Meeting Provider */}
              <div>
                <Label htmlFor="meetingProvider">Video Conference</Label>
                <Select 
                  value={eventData.meetingProvider} 
                  onValueChange={(value) => setEventData({ ...eventData, meetingProvider: value as MeetingProvider })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meeting provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingProviders.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Meeting Link */}
              {eventData.meetingProvider !== "none" && (
                <div>
                  <Label htmlFor="meetingLink">Custom Meeting Link (optional)</Label>
                  <Input
                    id="meetingLink"
                    value={eventData.meetingLink}
                    onChange={(e) => setEventData({ ...eventData, meetingLink: e.target.value })}
                    placeholder="Leave blank to auto-generate"
                  />
                </div>
              )}

              {/* Attendees */}
              <div>
                <Label htmlFor="attendees">
                  <Users className="inline h-4 w-4 mr-1" />
                  Attendees (optional)
                </Label>
                <Input
                  id="attendees"
                  value={eventData.attendees}
                  onChange={(e) => setEventData({ ...eventData, attendees: e.target.value })}
                  placeholder="Enter email addresses separated by commas"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}