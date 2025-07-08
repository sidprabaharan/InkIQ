import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isSameDay, addDays, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Package } from "lucide-react";
import { ProductionItem, WorkStation } from "./KanbanBoard";

// Mock data - same as KanbanBoard for consistency
const mockItems: ProductionItem[] = [
  {
    id: "1",
    quoteId: "3032",
    quoteName: "Project Care Quote",
    itemName: "T-Shirts",
    description: "Cotton T-Shirt with logo print",
    quantity: 375,
    dueDate: "2024-07-15",
    priority: "high",
    workStationId: "design",
  },
  {
    id: "2",
    quoteId: "3032",
    quoteName: "Project Care Quote",
    itemName: "Hoodies",
    description: "Pullover Hoodie with embroidered logo",
    quantity: 235,
    dueDate: "2024-07-20",
    priority: "medium",
    workStationId: "embroidery",
  },
];

const defaultWorkStations: WorkStation[] = [
  { id: "design", name: "Design", color: "#3b82f6", capacity: 5 },
  { id: "printing", name: "Screen Printing", color: "#8b5cf6", capacity: 8 },
  { id: "embroidery", name: "Embroidery", color: "#10b981", capacity: 6 },
  { id: "heat-press", name: "Heat Press", color: "#f59e0b", capacity: 4 },
  { id: "quality", name: "Quality Control", color: "#ef4444", capacity: 3 },
  { id: "packaging", name: "Packaging", color: "#6b7280", capacity: 10 },
];

export function ProductionScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("week");
  const [selectedWorkStation, setSelectedWorkStation] = useState<string>("all");
  const [items] = useState<ProductionItem[]>(mockItems);
  const [workStations] = useState<WorkStation[]>(defaultWorkStations);

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getItemsForDate = (date: Date) => {
    return items.filter(item => {
      const itemDate = new Date(item.dueDate);
      const matchesDate = isSameDay(itemDate, date);
      const matchesWorkStation = selectedWorkStation === "all" || item.workStationId === selectedWorkStation;
      return matchesDate && matchesWorkStation;
    });
  };

  const getWorkStationById = (id: string) => {
    return workStations.find(ws => ws.id === id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const navigateWeek = (direction: "prev" | "next") => {
    const days = direction === "prev" ? -7 : 7;
    setSelectedDate(addDays(selectedDate, days));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Production Timeline Scheduler</h2>
        
        <div className="flex items-center gap-4">
          <Select value={selectedWorkStation} onValueChange={setSelectedWorkStation}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Work Stations</SelectItem>
              {workStations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={(value) => setViewMode(value as "day" | "week")}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "week" ? (
        <div className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="text-lg font-medium">
              Week of {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMM dd, yyyy")}
            </h3>
            
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-8 gap-2 min-h-[600px]">
            {/* Time column */}
            <div className="space-y-2">
              <div className="h-16 border rounded-lg bg-muted flex items-center justify-center font-medium">
                Time
              </div>
              {timeSlots.map((time) => (
                <div key={time} className="h-16 border rounded-lg bg-muted/50 flex items-center justify-center text-sm">
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {getWeekDays(selectedDate).map((day) => {
              const dayItems = getItemsForDate(day);
              return (
                <div key={day.toISOString()} className="space-y-2">
                  <div className="h-16 border rounded-lg bg-muted flex flex-col items-center justify-center">
                    <div className="font-medium">{format(day, "EEE")}</div>
                    <div className="text-sm text-muted-foreground">{format(day, "MMM dd")}</div>
                  </div>
                  
                  <div className="space-y-2">
                    {timeSlots.map((time, timeIndex) => (
                      <div key={time} className="h-16 border rounded-lg bg-background p-1 overflow-hidden">
                        {/* Show items in first few time slots for demo */}
                        {timeIndex < dayItems.length && (
                          <div className="h-full">
                            <Card className="h-full">
                              <CardContent className="p-2 h-full flex flex-col justify-between">
                                <div>
                                  <div className="font-medium text-xs truncate">
                                    {dayItems[timeIndex].itemName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {getWorkStationById(dayItems[timeIndex].workStationId)?.name}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <Badge variant={getPriorityColor(dayItems[timeIndex].priority)} className="text-xs px-1">
                                    {dayItems[timeIndex].priority}
                                  </Badge>
                                  <span className="text-xs">{dayItems[timeIndex].quantity}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Day View */
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{format(selectedDate, "EEEE, MMMM dd, yyyy")}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getItemsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No items scheduled for this date
                  </div>
                ) : (
                  getItemsForDate(selectedDate).map((item) => {
                    const workStation = getWorkStationById(item.workStationId);
                    return (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.itemName}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{item.quantity} units</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Due: {format(new Date(item.dueDate), "MMM dd")}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                              {workStation && (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: workStation.color }}
                                  />
                                  <span className="text-sm">{workStation.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
        </div>
      )}
    </div>
  );
}