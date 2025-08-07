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

  // Calculate job positions and heights based on their start time and duration
  const positionedJobs = jobs.map(job => {
    if (!job.scheduledStart) return null;
    
    const startMinutes = job.scheduledStart.getMinutes();
    const durationMinutes = job.estimatedHours * 60;
    
    // Position within the hour (0-100%)
    const topPercent = (startMinutes / 60) * 100;
    
    // Height based on full duration (allow spanning beyond current hour)
    const heightPercent = (durationMinutes / 60) * 100;
    
    return {
      job,
      topPercent,
      heightPercent,
      spansNextHour: durationMinutes > (60 - startMinutes)
    };
  }).filter(Boolean);

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
        
        {positionedJobs.map(({ job, topPercent, heightPercent, spansNextHour }) => (
          <div
            key={job.id}
            className="absolute left-2 right-2 z-10"
            style={{
              top: `${topPercent}%`,
              height: `${heightPercent}%`,
              minHeight: '20px'
            }}
          >
            <div 
              className={cn(
                "bg-card border border-border rounded shadow-sm h-full flex items-center px-1 cursor-grab active:cursor-grabbing hover:shadow-md transition-all text-xs",
                spansNextHour && "border-b-dashed border-b-primary",
                onJobClick && "cursor-pointer"
              )}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify({
                  ...job,
                  isScheduledMove: true
                }));
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={(e) => {
                if (onJobClick && !e.defaultPrevented) {
                  e.stopPropagation();
                  onJobClick(job);
                }
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">
                  {job.jobNumber} - {job.customerName}
                </div>
                {heightPercent > 30 && (
                  <div className="text-xs text-muted-foreground truncate">
                    {job.description}
                  </div>
                )}
              </div>
              
              {/* Duration indicator */}
              <div className="text-xs text-muted-foreground flex-shrink-0 ml-1">
                {job.estimatedHours}h
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                {onStageAdvance && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStageAdvance(job.id);
                    }}
                    className="text-xs px-0.5 py-0.5 rounded bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    →
                  </button>
                )}
                {onJobUnschedule && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onJobUnschedule(job.id);
                    }}
                    className="text-xs px-0.5 py-0.5 rounded text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {spansNextHour && (
              <div className="absolute -bottom-1 right-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                Continues...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}