import { useState } from "react";
import { ImprintJob } from "@/types/imprint-job";
import { StationTimeSlot } from "./StationTimeSlot";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Equipment {
  id: string;
  name: string;
  capacity: number;
  type: string;
}

interface StationGridProps {
  equipment: Equipment;
  jobs: ImprintJob[];
  allJobs: ImprintJob[]; // All jobs for dependency checking
  selectedDate: Date;
  onJobSchedule: (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => void;
  onJobUnschedule: (jobId: string) => void;
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: ImprintJob) => void;
}

export function StationGrid({
  equipment,
  jobs,
  allJobs,
  selectedDate,
  onJobSchedule,
  onJobUnschedule,
  onStageAdvance,
  onJobClick
}: StationGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Time slots for the day (8 AM to 6 PM) in 15-minute intervals
  const timeSlots = Array.from({ length: 40 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 15; // Start at 8 AM, add 15 minutes per slot
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    return {
      hour,
      minute,
      totalMinutes,
      label: `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`,
      isHourMark: minute === 0
    };
  });

  // Get utilization data
  const scheduledJobs = jobs.filter(job => job.equipmentId === equipment.id);
  const totalHours = scheduledJobs.reduce((sum, job) => sum + job.estimatedHours, 0);
  const utilizationPercentage = Math.min((totalHours / 10) * 100, 100); // 10 hour workday
  const isOverUtilized = utilizationPercentage > 80;

  return (
    <div className="border border-border rounded-lg mb-4 bg-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="text-left">
                <h3 className="font-semibold text-base text-foreground">
                  {equipment.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {equipment.type} • Capacity: {equipment.capacity}/day
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isOverUtilized ? "destructive" : utilizationPercentage > 50 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {utilizationPercentage.toFixed(0)}% utilized
                </Badge>
                {scheduledJobs.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {scheduledJobs.length} jobs
                  </Badge>
                )}
              </div>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t border-border">
            {/* Time header */}
            <div className="sticky top-0 bg-muted/30 border-b border-border z-10 px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                Time Slots - {selectedDate.toLocaleDateString()}
              </span>
            </div>
            
            {/* Time slots */}
            <div className="divide-y divide-border">
              {timeSlots.map(slot => {
                // Filter jobs that should be displayed in this time slot
                const slotJobs = jobs.filter(job => {
                  if (!job.scheduledStart || job.equipmentId !== equipment.id) return false;
                  
                  const jobStartMinutes = job.scheduledStart.getHours() * 60 + job.scheduledStart.getMinutes();
                  const jobEndMinutes = job.scheduledEnd ? 
                    job.scheduledEnd.getHours() * 60 + job.scheduledEnd.getMinutes() :
                    jobStartMinutes + (job.estimatedHours * 60);
                  
                  // Show job if this slot is within the job's time range
                  return slot.totalMinutes >= jobStartMinutes && slot.totalMinutes < jobEndMinutes;
                });

                return (
                  <StationTimeSlot
                    key={`${slot.hour}-${slot.minute}`}
                    timeSlot={slot}
                    equipment={equipment}
                    jobs={slotJobs}
                    allJobs={allJobs}
                    selectedDate={selectedDate}
                    onJobSchedule={onJobSchedule}
                    onJobUnschedule={onJobUnschedule}
                    onStageAdvance={onStageAdvance}
                    onJobClick={onJobClick}
                  />
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}