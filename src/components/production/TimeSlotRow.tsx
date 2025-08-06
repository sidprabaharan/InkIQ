import { JobCard } from "./JobCard";
import { PrintavoJob } from "./PrintavoPowerScheduler";
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

interface TimeSlotRowProps {
  timeSlot: TimeSlot;
  equipment: Equipment[];
  jobs: PrintavoJob[];
  selectedDate: Date;
  onJobSchedule: (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => void;
  onJobUnschedule: (jobId: string) => void;
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: PrintavoJob) => void;
}

export function TimeSlotRow({ 
  timeSlot, 
  equipment, 
  jobs, 
  selectedDate,
  onJobSchedule,
  onJobUnschedule,
  onStageAdvance,
  onJobClick
}: TimeSlotRowProps) {
  
  const handleDrop = (e: React.DragEvent, equipmentId: string) => {
    e.preventDefault();
    const jobData = e.dataTransfer.getData("application/json");
    if (jobData) {
      const job = JSON.parse(jobData) as PrintavoJob;
      const startTime = new Date(selectedDate);
      startTime.setHours(timeSlot.hour, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + job.estimatedHours);
      
      onJobSchedule(job.id, equipmentId, startTime, endTime);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Get jobs for specific equipment
  const getJobsForEquipment = (equipmentId: string) => {
    return jobs.filter(job => job.equipmentId === equipmentId);
  };

  // Calculate equipment utilization for visual feedback
  const getEquipmentUtilization = (equipmentId: string) => {
    const equipmentJobs = getJobsForEquipment(equipmentId);
    const totalHours = equipmentJobs.reduce((sum, job) => sum + job.estimatedHours, 0);
    return Math.min(totalHours, 1); // Cap at 100%
  };

  return (
    <div className={`grid min-h-[80px] hover:bg-muted/20`} style={{ gridTemplateColumns: `80px repeat(${equipment.length}, 1fr)` }}>
      {/* Time info */}
      <div className="border-r border-border p-4 flex flex-col justify-center">
        <span className="text-sm font-medium text-foreground">
          {timeSlot.label}
        </span>
      </div>

      {/* Equipment columns */}
      {equipment.map(eq => {
        const equipmentJobs = getJobsForEquipment(eq.id);
        const utilization = getEquipmentUtilization(eq.id);
        const isOverUtilized = utilization > 0.8;
        
        return (
          <div
            key={eq.id}
            className={cn(
              "border-r border-border p-2 min-h-[80px] relative",
              "hover:bg-muted/20 transition-colors",
              equipmentJobs.length > 0 && "bg-muted/10",
              isOverUtilized && "bg-amber-50 border-amber-200"
            )}
            onDrop={(e) => handleDrop(e, eq.id)}
            onDragOver={handleDragOver}
          >
            {/* Capacity warning indicator */}
            {isOverUtilized && (
              <div className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full" />
            )}
            
            {/* Multiple jobs stacked vertically */}
            <div className="space-y-1 max-h-[72px] overflow-y-auto">
              {equipmentJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  variant="scheduled"
                  className="text-xs cursor-pointer hover:shadow-sm"
                  onStageAdvance={() => onStageAdvance(job.id)}
                  onClick={onJobClick ? () => onJobClick(job) : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}