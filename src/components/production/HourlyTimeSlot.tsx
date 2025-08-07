import { HorizontalJobCard } from "./HorizontalJobCard";
import { ImprintJob } from "@/types/imprint-job";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

interface HourlyTimeSlotProps {
  timeSlot: TimeSlot;
  equipment: Equipment;
  jobs: ImprintJob[];
  allJobs: ImprintJob[];
  selectedDate: Date;
  onJobSchedule: (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => void;
  onJobUnschedule: (jobId: string) => void;
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: ImprintJob) => void;
}

export function HourlyTimeSlot({ 
  timeSlot, 
  equipment, 
  jobs,
  allJobs,
  selectedDate,
  onJobSchedule,
  onJobUnschedule,
  onStageAdvance,
  onJobClick
}: HourlyTimeSlotProps) {
  const [draggedOverQuarter, setDraggedOverQuarter] = useState<number | null>(null);
  
  // Calculate drop position based on mouse position within the hour row
  const calculateDropTime = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height;
    const quarterHeight = hourHeight / 4;
    const quarter = Math.floor(y / quarterHeight);
    const clampedQuarter = Math.max(0, Math.min(3, quarter));
    return clampedQuarter * 15; // 0, 15, 30, or 45 minutes
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOverQuarter(null);
    
    const jobData = e.dataTransfer.getData("application/json");
    if (jobData) {
      const job = JSON.parse(jobData) as ImprintJob;
      const minuteOffset = calculateDropTime(e);
      
      const startTime = new Date(selectedDate);
      startTime.setHours(timeSlot.hour, minuteOffset, 0, 0);
      const endTime = new Date(startTime);
      endTime.setTime(endTime.getTime() + (job.estimatedHours * 60 * 60 * 1000));
      
      onJobSchedule(job.id, equipment.id, startTime, endTime);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const minuteOffset = calculateDropTime(e);
    const quarter = minuteOffset / 15;
    setDraggedOverQuarter(quarter);
  };

  const handleDragLeave = () => {
    setDraggedOverQuarter(null);
  };

  // Detect overlapping jobs and assign columns
  const detectOverlaps = (jobs: { job: ImprintJob; startMinutes: number; endMinutes: number }[]) => {
    const columns: { job: ImprintJob; startMinutes: number; endMinutes: number; column: number }[] = [];
    
    jobs.forEach(jobData => {
      let column = 0;
      // Find the first column where this job doesn't overlap with existing jobs
      while (columns.some(existing => 
        existing.column === column &&
        jobData.startMinutes < existing.endMinutes &&
        jobData.endMinutes > existing.startMinutes
      )) {
        column++;
      }
      columns.push({ ...jobData, column });
    });
    
    const maxColumns = Math.max(...columns.map(c => c.column), 0) + 1;
    return { columns, maxColumns };
  };

  // Calculate job positions and detect overlaps
  const jobsWithTiming = jobs.map(job => {
    if (!job.scheduledStart) return null;
    
    const startMinutes = job.scheduledStart.getMinutes();
    const durationMinutes = job.estimatedHours * 60;
    const endMinutes = startMinutes + durationMinutes;
    
    return { job, startMinutes, endMinutes };
  }).filter(Boolean);

  const { columns, maxColumns } = detectOverlaps(jobsWithTiming);

  // Calculate positioned jobs with column layout
  const positionedJobs = columns.map(({ job, startMinutes, endMinutes, column }) => {
    const durationMinutes = job.estimatedHours * 60;
    
    // Position within the hour (0-100%)
    const topPercent = (startMinutes / 60) * 100;
    
    // Height based on full duration (allow spanning beyond current hour)
    const heightPercent = (durationMinutes / 60) * 100;
    
    // Column positioning
    const columnWidth = 100 / maxColumns;
    const leftPercent = column * columnWidth;
    const widthPercent = columnWidth - 1; // Small gap between columns
    
    // Check if job visually extends beyond the displayed area
    // Only show "Continues..." if the job is visually cut off, not just because it's long
    const maxDisplayHeight = Math.min(heightPercent, 100);
    const spansNextHour = heightPercent > 100;
    
    return {
      job,
      topPercent,
      heightPercent,
      leftPercent,
      widthPercent,
      spansNextHour
    };
  });

  const hasJobs = jobs.length > 0;
  const totalHours = jobs.reduce((sum, job) => sum + job.estimatedHours, 0);
  const isOverUtilized = totalHours > 1; // More than 1 hour scheduled in this hour

  return (
    <div 
      className={cn(
        "relative h-12 flex border-b border-border/50 transition-colors",
        isOverUtilized && "bg-amber-50 border-l-2 border-amber-400",
        hasJobs && "hover:bg-muted/5"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Time label */}
      <div className="w-16 flex-shrink-0 px-2 py-1 border-r border-border/30 flex flex-col justify-center">
        <span className="text-xs font-medium text-foreground">
          {timeSlot.label}
        </span>
        {isOverUtilized && (
          <div className="text-xs text-amber-600">
            Busy
          </div>
        )}
      </div>

      {/* Drop zone quarters with visual feedback */}
      <div className="absolute left-16 right-0 top-0 bottom-0 pointer-events-none">
        {[0, 1, 2, 3].map(quarter => (
          <div
            key={quarter}
            className={cn(
              "absolute left-0 right-0 h-1/4 border-b border-dashed border-transparent transition-all",
              draggedOverQuarter === quarter && "bg-primary/10 border-primary/30"
            )}
            style={{ top: `${quarter * 25}%` }}
          />
        ))}
      </div>

      {/* Jobs container */}
      <div className="flex-1 relative">
        {!hasJobs && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/60 italic pointer-events-none">
            Drop jobs here to schedule
          </div>
        )}
        
        {positionedJobs.map(({ job, topPercent, heightPercent, leftPercent, widthPercent, spansNextHour }) => (
          <div
            key={job.id}
            className="absolute z-10"
            style={{
              top: `${topPercent}%`,
              left: `calc(${leftPercent}% + 8px)`,
              width: `calc(${widthPercent}% - 8px)`,
              height: `${Math.max(heightPercent, 50)}%`,
              minHeight: '48px'
            }}
          >
            <div 
              className={cn(
                "h-full transition-all",
                spansNextHour && "border-b-2 border-b-dashed border-b-primary"
              )}
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
                className="h-full min-h-[48px] text-xs"
              />
            </div>
            
            {spansNextHour && (
              <div className="absolute -bottom-1 right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded z-20">
                Continues...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}