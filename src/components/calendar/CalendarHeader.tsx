
import React from "react";
import { format, addMonths, addWeeks, addDays, startOfMonth, startOfWeek, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Search, HelpCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarView } from "@/pages/Calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCreateEvent: () => void;
}

export function CalendarHeader({
  view,
  onViewChange,
  currentDate,
  onDateChange,
  onCreateEvent
}: CalendarHeaderProps) {
  const navigateToday = () => {
    onDateChange(new Date());
  };

  const navigatePrevious = () => {
    if (view === "month") {
      onDateChange(addMonths(currentDate, -1));
    } else if (view === "week") {
      onDateChange(addWeeks(currentDate, -1));
    } else {
      onDateChange(addDays(currentDate, -1));
    }
  };

  const navigateNext = () => {
    if (view === "month") {
      onDateChange(addMonths(currentDate, 1));
    } else if (view === "week") {
      onDateChange(addWeeks(currentDate, 1));
    } else {
      onDateChange(addDays(currentDate, 1));
    }
  };

  const getHeaderTitle = () => {
    if (view === "month" || view === "week") {
      return format(currentDate, "MMMM yyyy");
    } else {
      return format(currentDate, "MMMM d, yyyy");
    }
  };

  return (
    <header className="border-b py-2 px-4 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full px-6 font-medium"
          onClick={navigateToday}
        >
          Today
        </Button>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={navigatePrevious} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext} className="rounded-full">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <h2 className="text-xl font-normal">{getHeaderTitle()}</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <Select value={view} onValueChange={(value) => onViewChange(value as CalendarView)}>
          <SelectTrigger className="w-[110px] border rounded-full">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="ml-1 flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-l-full rounded-r-none border-r-0 bg-blue-50 hover:bg-blue-100"
            >
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-r-full rounded-l-none bg-blue-50 hover:bg-blue-100"
              onClick={onCreateEvent}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
