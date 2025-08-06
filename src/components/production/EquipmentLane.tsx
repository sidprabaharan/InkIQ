import { JobCard } from "./JobCard";
import { CapacityBadge } from "./CapacityBadge";
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

interface EquipmentLaneProps {
  equipment: Equipment;
  jobs: PrintavoJob[];
  timeSlots: TimeSlot[];
  selectedDate: Date;
  onJobSchedule: (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => void;
  onJobUnschedule: (jobId: string) => void;
}

export function EquipmentLane({ 
  equipment, 
  jobs, 
  timeSlots, 
  selectedDate,
  onJobSchedule,
  onJobUnschedule 
}: EquipmentLaneProps) {
  // Calculate current capacity usage
  const totalScheduled = jobs.reduce((sum, job) => sum + job.quantity, 0);
  const utilizationPercentage = Math.round((totalScheduled / equipment.capacity) * 100);
  
  const handleDrop = (e: React.DragEvent, timeSlot: TimeSlot) => {
    e.preventDefault();
    const jobData = e.dataTransfer.getData("application/json");
    if (jobData) {
      const job = JSON.parse(jobData) as PrintavoJob;
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

  // Get jobs for specific time slots
  const getJobsForSlot = (timeSlot: TimeSlot) => {
    return jobs.filter(job => {
      if (!job.scheduledStart) return false;
      const jobHour = job.scheduledStart.getHours();
      return jobHour === timeSlot.hour;
    });
  };

  return (
    <div className="grid grid-cols-[200px_1fr] min-h-[80px] hover:bg-muted/20">
      {/* Equipment info */}
      <div className="border-r border-border p-4 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm text-foreground">{equipment.name}</h4>
            <p className="text-xs text-muted-foreground">{equipment.type}</p>
          </div>
          <CapacityBadge 
            current={totalScheduled}
            total={equipment.capacity}
            utilizationPercentage={utilizationPercentage}
          />
        </div>
      </div>

      {/* Time slots */}
      <div className="grid grid-cols-10">
        {timeSlots.map(slot => {
          const slotJobs = getJobsForSlot(slot);
          
          return (
            <div
              key={slot.hour}
              className={cn(
                "border-r border-border p-2 min-h-[80px] relative",
                "hover:bg-blue-50 transition-colors",
                slotJobs.length > 0 && "bg-blue-100"
              )}
              onDrop={(e) => handleDrop(e, slot)}
              onDragOver={handleDragOver}
            >
              {slotJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  variant="scheduled"
                  className="mb-1 last:mb-0 text-xs"
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}