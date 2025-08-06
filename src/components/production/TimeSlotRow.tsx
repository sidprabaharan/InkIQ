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
}

export function TimeSlotRow({ 
  timeSlot, 
  equipment, 
  jobs, 
  selectedDate,
  onJobSchedule,
  onJobUnschedule,
  onStageAdvance
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
        
        return (
          <div
            key={eq.id}
            className={cn(
              "border-r border-border p-2 min-h-[80px] relative",
              "hover:bg-blue-50 transition-colors",
              equipmentJobs.length > 0 && "bg-blue-100"
            )}
            onDrop={(e) => handleDrop(e, eq.id)}
            onDragOver={handleDragOver}
          >
            {equipmentJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                variant="scheduled"
                className="mb-1 last:mb-0 text-xs"
                onStageAdvance={() => onStageAdvance(job.id)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}