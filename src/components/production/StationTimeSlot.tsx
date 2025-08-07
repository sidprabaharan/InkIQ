import { HorizontalJobCard } from "./HorizontalJobCard";
import { ImprintJob } from "@/types/imprint-job";
import { cn } from "@/lib/utils";

interface Equipment {
  id: string;
  name: string;
  capacity: number;
  type: string;
}

interface TimeSlot {
  hour: number;
  minute: number;
  totalMinutes: number;
  label: string;
  isHourMark: boolean;
}

interface StationTimeSlotProps {
  timeSlot: TimeSlot;
  equipment: Equipment;
  jobs: ImprintJob[];
  allJobs: ImprintJob[]; // All jobs for dependency checking
  selectedDate: Date;
  onJobSchedule: (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => void;
  onJobUnschedule: (jobId: string) => void;
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: ImprintJob) => void;
}

export function StationTimeSlot({ 
  timeSlot, 
  equipment, 
  jobs,
  allJobs,
  selectedDate,
  onJobSchedule,
  onJobUnschedule,
  onStageAdvance,
  onJobClick
}: StationTimeSlotProps) {
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const jobData = e.dataTransfer.getData("application/json");
    if (jobData) {
      const job = JSON.parse(jobData) as ImprintJob;
      const startTime = new Date(selectedDate);
      startTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
      const endTime = new Date(startTime);
      endTime.setTime(endTime.getTime() + (job.estimatedHours * 60 * 60 * 1000));
      
      onJobSchedule(job.id, equipment.id, startTime, endTime);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const hasJobs = jobs.length > 0;
  const totalHours = jobs.reduce((sum, job) => sum + job.estimatedHours, 0);
  const isOverUtilized = totalHours > 0.25; // 15 minutes threshold

  // Check if this is the start of a job (show full job card only at start)
  const jobsStartingHere = jobs.filter(job => {
    if (!job.scheduledStart) return false;
    const jobStartMinutes = job.scheduledStart.getHours() * 60 + job.scheduledStart.getMinutes();
    return jobStartMinutes === timeSlot.totalMinutes;
  });

  const handleScheduledJobDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (data) {
      const dropData = JSON.parse(data);
      if (dropData.isScheduledMove) {
        // This is a scheduled job being moved
        const newStartTime = new Date(selectedDate);
        newStartTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
        const newEndTime = new Date(newStartTime);
        newEndTime.setTime(newEndTime.getTime() + (dropData.estimatedHours * 60 * 60 * 1000));
        
        onJobSchedule(dropData.id, equipment.id, newStartTime, newEndTime);
      } else {
        // This is an unscheduled job being scheduled
        handleDrop(e);
      }
    }
  };

  return (
    <div 
      className={cn(
        "relative min-h-[60px] flex items-center gap-3 transition-colors border-b border-border/50",
        timeSlot.isHourMark && "border-b-border bg-muted/5",
        !timeSlot.isHourMark && "border-b-border/30",
        isOverUtilized && "bg-amber-50 border-l-2 border-amber-400",
        hasJobs && "hover:bg-muted/10"
      )}
      onDrop={handleScheduledJobDrop}
      onDragOver={handleDragOver}
    >
      {/* Time label */}
      <div className="w-20 flex-shrink-0 px-3 py-2">
        <span className={cn(
          "text-sm text-foreground",
          timeSlot.isHourMark ? "font-medium" : "font-normal text-muted-foreground"
        )}>
          {timeSlot.isHourMark ? timeSlot.label : timeSlot.minute.toString().padStart(2, '0')}
        </span>
        {isOverUtilized && (
          <div className="text-xs text-amber-600 mt-1">
            Busy
          </div>
        )}
      </div>

      {/* Jobs container - only show jobs that start in this slot */}
      <div className="flex-1 relative">
        {jobsStartingHere.length === 0 && !hasJobs ? (
          <div className="text-sm text-muted-foreground/60 italic py-2">
            {timeSlot.isHourMark ? "Drop jobs here to schedule" : ""}
          </div>
        ) : (
          jobsStartingHere.map(job => {
            // Calculate how many slots this job spans
            const jobDurationMinutes = job.estimatedHours * 60;
            const durationSlots = Math.ceil(jobDurationMinutes / 15);
            
            return (
              <div
                key={job.id}
                className="absolute left-0 right-0 z-10"
                style={{
                  height: `${Math.max(durationSlots * 60, 60)}px`, // Each slot is ~60px
                  top: 0
                }}
              >
                <div 
                  className="bg-card border border-border rounded-lg shadow-sm h-full flex items-center p-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/json", JSON.stringify({
                      ...job,
                      isScheduledMove: true
                    }));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                >
                  <HorizontalJobCard
                    job={job}
                    allJobs={allJobs}
                    variant="scheduled"
                    draggable={false}
                    onStageAdvance={() => onStageAdvance(job.id)}
                    onClick={onJobClick ? () => onJobClick(job) : undefined}
                    onUnschedule={() => onJobUnschedule(job.id)}
                    className="border-0 shadow-none bg-transparent hover:shadow-none p-0"
                  />
                  {/* Duration indicator */}
                  {durationSlots > 1 && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                      {job.estimatedHours}h
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}