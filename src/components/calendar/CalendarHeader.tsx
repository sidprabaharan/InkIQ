
import { format, addMonths, addWeeks, addDays, startOfMonth, startOfWeek, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarView } from "@/pages/Calendar";

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCreateEvent: () => void;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

export function CalendarHeader({ 
  view, 
  onViewChange, 
  currentDate, 
  onDateChange, 
  onCreateEvent,
  onToggleFilters,
  activeFilterCount
}: CalendarHeaderProps) {
  const navigateToday = () => {
    onDateChange(new Date());
  };

  const navigatePrevious = () => {
    if (view === "month") {
      onDateChange(addMonths(currentDate, -1));
    } else if (view === "week" || view === "agenda") {
      onDateChange(addWeeks(currentDate, -1));
    } else {
      onDateChange(addDays(currentDate, -1));
    }
  };

  const navigateNext = () => {
    if (view === "month") {
      onDateChange(addMonths(currentDate, 1));
    } else if (view === "week" || view === "agenda") {
      onDateChange(addWeeks(currentDate, 1));
    } else {
      onDateChange(addDays(currentDate, 1));
    }
  };

  const getHeaderTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week" || view === "agenda") {
      const start = startOfWeek(currentDate);
      const end = addDays(start, 6);
      if (format(start, "MMM") === format(end, "MMM")) {
        return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
      } else {
        return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
      }
    } else {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    }
  };

  return (
    <header className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="font-medium"
          onClick={onCreateEvent}
        >
          <Plus className="mr-1 h-4 w-4" />
          Create
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={navigateToday}
        >
          Today
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <h2 className="text-xl font-semibold">{getHeaderTitle()}</h2>
      </div>
      
      <div className="flex border rounded-md overflow-hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "rounded-none",
            view === "day" && "bg-primary text-primary-foreground"
          )}
          onClick={() => onViewChange("day")}
        >
          Day
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "rounded-none",
            view === "week" && "bg-primary text-primary-foreground"
          )}
          onClick={() => onViewChange("week")}
        >
          Week
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "rounded-none",
            view === "month" && "bg-primary text-primary-foreground"
          )}
          onClick={() => onViewChange("month")}
        >
          Month
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "rounded-none",
            view === "agenda" && "bg-primary text-primary-foreground"
          )}
          onClick={() => onViewChange("agenda")}
        >
          Agenda
        </Button>
      </div>
    </header>
  );
}
