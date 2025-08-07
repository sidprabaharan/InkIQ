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
  label: string;
}

interface StationTimeSlotProps {
  timeSlot: TimeSlot;
  equipment: Equipment;
  jobs: ImprintJob[];
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
      startTime.setHours(timeSlot.hour, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + job.estimatedHours);
      
      onJobSchedule(job.id, equipment.id, startTime, endTime);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const hasJobs = jobs.length > 0;
  const totalHours = jobs.reduce((sum, job) => sum + job.estimatedHours, 0);
  const isOverUtilized = totalHours > 1;

  return (
    <div 
      className={cn(
        "min-h-[60px] p-3 flex items-center gap-3 hover:bg-muted/20 transition-colors",
        hasJobs && "bg-muted/10",
        isOverUtilized && "bg-amber-50 border-l-2 border-amber-400"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Time label */}
      <div className="w-20 flex-shrink-0">
        <span className="text-sm font-medium text-foreground">
          {timeSlot.label}
        </span>
        {isOverUtilized && (
          <div className="text-xs text-amber-600 mt-1">
            Over capacity
          </div>
        )}
      </div>

      {/* Jobs container */}
      <div className="flex-1 space-y-2">
        {jobs.length === 0 ? (
          <div className="text-sm text-muted-foreground italic py-2">
            Drop jobs here to schedule
          </div>
        ) : (
          jobs.map(job => (
            <HorizontalJobCard
              key={job.id}
              job={job}
              variant="scheduled"
              onStageAdvance={() => onStageAdvance(job.id)}
              onClick={onJobClick ? () => onJobClick(job) : undefined}
              onUnschedule={() => onJobUnschedule(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}