import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { format, addDays, startOfDay, endOfDay, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ProductionEquipment, ProductionJob, SchedulingConflict } from "@/types/equipment";
import { getStoredProductionJobs, updateProductionJob } from "@/utils/productionJobUtils";
import { useToast } from "@/hooks/use-toast";

// Enhanced equipment data with realistic production setup
const enhancedEquipment: ProductionEquipment[] = [
  {
    id: "emb-brother-1050x",
    name: "Brother PR-1050X",
    type: "embroidery",
    heads: 10,
    maxColors: 15,
    minQuantity: 1,
    maxQuantity: 1000,
    capacity: 480, // items per day
    currentLoad: 65,
    status: "available",
    setupTime: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "emb-brother-670e",
    name: "Brother PR-670E",
    type: "embroidery", 
    heads: 6,
    maxColors: 10,
    minQuantity: 1,
    maxQuantity: 500,
    capacity: 320,
    currentLoad: 40,
    status: "available",
    setupTime: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "screen-mr-sportsman",
    name: "M&R Sportsman EX",
    type: "screen_printing",
    screens: 8,
    isAutomatic: true,
    minQuantity: 50,
    maxQuantity: 5000,
    capacity: 1200,
    currentLoad: 80,
    status: "busy",
    setupTime: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "screen-manual-6color",
    name: "Manual 6-Color Press",
    type: "screen_printing",
    screens: 6,
    isAutomatic: false,
    minQuantity: 1,
    maxQuantity: 200,
    capacity: 400,
    currentLoad: 25,
    status: "available",
    setupTime: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "screen-mr-gauntlet",
    name: "M&R Gauntlet III",
    type: "screen_printing",
    screens: 12,
    isAutomatic: true,
    minQuantity: 100,
    maxQuantity: 10000,
    capacity: 2000,
    currentLoad: 45,
    status: "available",
    setupTime: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

interface TimeSlot {
  start: Date;
  end: Date;
  jobs: ProductionJob[];
}

interface EquipmentSchedule {
  equipment: ProductionEquipment;
  timeSlots: TimeSlot[];
  utilization: number;
  conflicts: SchedulingConflict[];
}

export function EnhancedProductionScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("week");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all");
  const [productionJobs, setProductionJobs] = useState<ProductionJob[]>(getStoredProductionJobs());
  const { toast } = useToast();

  // Generate time slots for scheduling (hourly from 6 AM to 10 PM)
  const generateTimeSlots = useCallback((date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(date);
      end.setHours(hour + 1, 0, 0, 0);
      
      slots.push({
        start,
        end,
        jobs: productionJobs.filter(job => 
          job.scheduledStartTime && 
          job.scheduledStartTime >= start && 
          job.scheduledStartTime < end
        )
      });
    }
    
    return slots;
  }, [productionJobs]);

  // Get week days for week view
  const getWeekDays = useCallback((date: Date): Date[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, []);

  // Calculate equipment schedules with intelligent analysis
  const equipmentSchedules = useMemo((): EquipmentSchedule[] => {
    const filtered = selectedEquipment === "all" 
      ? enhancedEquipment 
      : enhancedEquipment.filter(eq => eq.id === selectedEquipment);

    return filtered.map(equipment => {
      const timeSlots = generateTimeSlots(selectedDate);
      const equipmentJobs = productionJobs.filter(job => job.assignedEquipmentId === equipment.id);
      
      // Calculate utilization
      const totalCapacity = equipment.capacity;
      const scheduledJobs = equipmentJobs.filter(job => 
        job.scheduledStartTime && 
        isSameDay(job.scheduledStartTime, selectedDate)
      );
      const utilization = (scheduledJobs.length / totalCapacity) * 100;

      // Detect conflicts
      const conflicts: SchedulingConflict[] = [];
      
      // Capacity conflicts
      if (utilization > 90) {
        conflicts.push({
          type: "capacity_exceeded",
          description: `${equipment.name} is over capacity (${utilization.toFixed(0)}%)`,
          severity: "high",
          suggestedActions: ["Reschedule non-urgent jobs", "Consider outsourcing", "Add overtime shift"]
        });
      }

      // Due date risks
      scheduledJobs.forEach(job => {
        const daysUntilDue = Math.ceil((job.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 1 && job.status === "pending") {
          conflicts.push({
            type: "due_date_risk",
            description: `Job ${job.itemName} due in ${daysUntilDue} day(s)`,
            severity: daysUntilDue === 0 ? "high" : "medium",
            suggestedActions: ["Prioritize this job", "Consider rush processing"]
          });
        }
      });

      return {
        equipment,
        timeSlots,
        utilization,
        conflicts
      };
    });
  }, [selectedDate, selectedEquipment, productionJobs, generateTimeSlots]);

  // Handle job drag and drop (simplified for demo)
  const handleJobMove = (jobId: string, newStartTime: Date, equipmentId: string) => {
    const updatedJobs = productionJobs.map(job => {
      if (job.id === jobId) {
        const duration = job.estimatedDuration;
        const endTime = new Date(newStartTime.getTime() + duration * 60000);
        
        return {
          ...job,
          assignedEquipmentId: equipmentId,
          scheduledStartTime: newStartTime,
          scheduledEndTime: endTime,
          status: job.status === "pending" ? "scheduled" : job.status
        } as ProductionJob;
      }
      return job;
    });

    setProductionJobs(updatedJobs);
    // Update storage
    updatedJobs.forEach(job => updateProductionJob(job.id, job));
    
    toast({
      title: "Job Rescheduled",
      description: "Production job has been moved to new time slot"
    });
  };

  // Get capacity color based on utilization
  const getCapacityColor = (utilization: number) => {
    if (utilization >= 90) return "bg-red-500";
    if (utilization >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Get equipment status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "maintenance": return "bg-red-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  // Navigate dates
  const navigateDate = (direction: "prev" | "next") => {
    const days = viewMode === "week" ? 7 : 1;
    const newDate = addDays(selectedDate, direction === "next" ? days : -days);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Enhanced Production Scheduler</h2>
          <p className="text-muted-foreground">
            Equipment-centric scheduling with intelligent capacity planning
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* View Mode */}
          <Select value={viewMode} onValueChange={(value: "day" | "week") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>

          {/* Equipment Filter */}
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {enhancedEquipment.map(eq => (
                <SelectItem key={eq.id} value={eq.id}>
                  {eq.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipmentSchedules.map((schedule) => (
          <Card key={schedule.equipment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {schedule.equipment.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(schedule.equipment.status)
                  )} />
                  <Badge variant="outline" className="text-xs">
                    {schedule.equipment.type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Utilization</span>
                  <span className="font-medium">{schedule.utilization.toFixed(0)}%</span>
                </div>
                <Progress 
                  value={schedule.utilization} 
                  className={cn(
                    "h-2",
                    schedule.utilization >= 90 && "text-red-500"
                  )}
                />
              </div>
              
              {schedule.conflicts.length > 0 && (
                <Alert className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {schedule.conflicts.length} conflict(s) detected
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-xs text-muted-foreground">
                Capacity: {schedule.equipment.capacity} items/day
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Scheduler */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Analysis</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Resolution</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {viewMode === "week" ? (
            <WeekTimelineView 
              equipmentSchedules={equipmentSchedules}
              weekDays={getWeekDays(selectedDate)}
              onJobMove={handleJobMove}
            />
          ) : (
            <DayTimelineView 
              equipmentSchedules={equipmentSchedules}
              selectedDate={selectedDate}
              onJobMove={handleJobMove}
            />
          )}
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <CapacityAnalysisView equipmentSchedules={equipmentSchedules} />
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <ConflictResolutionView equipmentSchedules={equipmentSchedules} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Week Timeline View Component
function WeekTimelineView({ 
  equipmentSchedules, 
  weekDays, 
  onJobMove 
}: {
  equipmentSchedules: EquipmentSchedule[];
  weekDays: Date[];
  onJobMove: (jobId: string, newStartTime: Date, equipmentId: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="font-medium text-sm text-muted-foreground">Equipment</div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="font-medium text-sm">{format(day, "EEE")}</div>
              <div className="text-xs text-muted-foreground">{format(day, "MMM d")}</div>
            </div>
          ))}
        </div>

        {/* Equipment rows */}
        {equipmentSchedules.map((schedule) => (
          <div key={schedule.equipment.id} className="grid grid-cols-8 gap-2 mb-2">
            <div className="flex items-center space-y-1">
              <div>
                <div className="font-medium text-sm">{schedule.equipment.name}</div>
                <div className="text-xs text-muted-foreground">
                  {schedule.utilization.toFixed(0)}% utilization
                </div>
              </div>
            </div>
            
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="h-20 border rounded-lg p-2 bg-muted/20">
                {/* Simplified job display for week view */}
                <div className="text-xs space-y-1">
                  {schedule.timeSlots
                    .filter(slot => isSameDay(slot.start, day))
                    .slice(0, 2) // Show only first 2 jobs per day
                    .map((slot, slotIndex) => 
                      slot.jobs.map((job, jobIndex) => (
                        <div 
                          key={`${slotIndex}-${jobIndex}`}
                          className="bg-primary text-primary-foreground rounded px-1 py-0.5 text-xs truncate cursor-pointer hover:bg-primary/80"
                          title={`${job.itemName} (${job.quantity} units)`}
                        >
                          {job.itemName}
                        </div>
                      ))
                    )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Day Timeline View Component  
function DayTimelineView({
  equipmentSchedules,
  selectedDate,
  onJobMove
}: {
  equipmentSchedules: EquipmentSchedule[];
  selectedDate: Date;
  onJobMove: (jobId: string, newStartTime: Date, equipmentId: string) => void;
}) {
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Time header */}
        <div className="flex border-b mb-4">
          <div className="w-48 p-2 font-medium text-sm">Equipment</div>
          {hours.map(hour => (
            <div key={hour} className="flex-1 min-w-[60px] p-2 text-center text-sm border-l">
              {hour}:00
            </div>
          ))}
        </div>

        {/* Equipment rows with time slots */}
        {equipmentSchedules.map((schedule) => (
          <div key={schedule.equipment.id} className="flex border-b">
            <div className="w-48 p-2">
              <div className="font-medium text-sm">{schedule.equipment.name}</div>
              <div className="text-xs text-muted-foreground">
                {schedule.utilization.toFixed(0)}% load
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full mt-1",
                getCapacityColor(schedule.utilization)
              )} />
            </div>
            
            <div className="flex-1 flex">
              {hours.map(hour => {
                const hourStart = new Date(selectedDate);
                hourStart.setHours(hour, 0, 0, 0);
                
                const slot = schedule.timeSlots.find(slot => 
                  slot.start.getHours() === hour
                );
                
                return (
                  <div 
                    key={hour} 
                    className="flex-1 min-w-[60px] min-h-[80px] border-l border-border/50 p-1 relative"
                  >
                    {slot?.jobs.map((job, index) => (
                      <div
                        key={job.id}
                        className={cn(
                          "absolute inset-x-1 bg-primary text-primary-foreground rounded px-2 py-1 text-xs cursor-pointer hover:bg-primary/80",
                          job.priority === "high" && "bg-red-500",
                          job.priority === "low" && "bg-blue-500"
                        )}
                        style={{
                          top: `${index * 25}px`,
                          height: "20px"
                        }}
                        title={`${job.itemName} - ${job.quantity} units\nDue: ${format(job.dueDate, "MMM d")}`}
                      >
                        <div className="truncate">
                          {job.itemName} ({job.quantity})
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Capacity Analysis View
function CapacityAnalysisView({ equipmentSchedules }: { equipmentSchedules: EquipmentSchedule[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {equipmentSchedules.map((schedule) => (
        <Card key={schedule.equipment.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{schedule.equipment.name}</span>
              <Badge variant={schedule.utilization > 90 ? "destructive" : "default"}>
                {schedule.utilization.toFixed(0)}% Utilized
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Capacity:</span>
                <span>{schedule.equipment.capacity} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current Load:</span>
                <span>{schedule.equipment.currentLoad}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Setup Time:</span>
                <span>{schedule.equipment.setupTime} min</span>
              </div>
            </div>
            
            <Progress value={schedule.utilization} className="h-3" />
            
            {schedule.conflicts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Issues Detected:</h4>
                {schedule.conflicts.map((conflict, index) => (
                  <Alert key={index} className="p-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {conflict.description}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Conflict Resolution View
function ConflictResolutionView({ equipmentSchedules }: { equipmentSchedules: EquipmentSchedule[] }) {
  const allConflicts = equipmentSchedules.flatMap(schedule => 
    schedule.conflicts.map(conflict => ({
      ...conflict,
      equipmentName: schedule.equipment.name,
      equipmentId: schedule.equipment.id
    }))
  );

  return (
    <div className="space-y-4">
      {allConflicts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium">No Conflicts Detected</h3>
            <p className="text-sm text-muted-foreground">
              All equipment is operating within capacity and schedule constraints.
            </p>
          </CardContent>
        </Card>
      ) : (
        allConflicts.map((conflict, index) => (
          <Alert key={index} className={cn(
            "p-4",
            conflict.severity === "high" && "border-destructive",
            conflict.severity === "medium" && "border-yellow-500"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4",
              conflict.severity === "high" && "text-destructive",
              conflict.severity === "medium" && "text-yellow-500"
            )} />
            <div className="ml-2 space-y-2">
              <div className="flex items-center gap-2">
                <AlertDescription className="font-medium">
                  {conflict.equipmentName}: {conflict.description}
                </AlertDescription>
                <Badge variant={conflict.severity === "high" ? "destructive" : "default"}>
                  {conflict.severity}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Suggested Actions:</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {conflict.suggestedActions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Alert>
        ))
      )}
    </div>
  );
}

// Helper function for capacity color (defined at component level)
function getCapacityColor(utilization: number) {
  if (utilization >= 90) return "bg-red-500";
  if (utilization >= 70) return "bg-yellow-500";
  return "bg-green-500";
}