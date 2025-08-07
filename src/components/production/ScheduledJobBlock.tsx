import { ImprintJob } from "@/types/imprint-job";
import { HorizontalJobCard } from "./HorizontalJobCard";
import { cn } from "@/lib/utils";

interface ScheduledJobBlockProps {
  job: ImprintJob;
  allJobs: ImprintJob[];
  startTimeSlot: number; // Starting time slot index
  durationSlots: number; // Number of 15-minute slots to span
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: ImprintJob) => void;
  onUnschedule: (jobId: string) => void;
  onJobMove: (jobId: string, newStartSlot: number) => void;
}

export function ScheduledJobBlock({
  job,
  allJobs,
  startTimeSlot,
  durationSlots,
  onStageAdvance,
  onJobClick,
  onUnschedule,
  onJobMove
}: ScheduledJobBlockProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // Set data for moving scheduled jobs
    e.dataTransfer.setData("application/json", JSON.stringify({
      ...job,
      isScheduledMove: true,
      currentStartSlot: startTimeSlot
    }));
    e.dataTransfer.effectAllowed = "move";
  };

  const spanHeight = durationSlots * 60; // Each slot is ~60px height

  return (
    <div
      className={cn(
        "absolute left-20 right-3 bg-card border border-border rounded-lg shadow-sm",
        "flex items-center transition-all hover:shadow-md z-10"
      )}
      style={{
        top: 0,
        height: `${Math.max(spanHeight, 60)}px`, // Minimum height of 60px
      }}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="w-full">
        <HorizontalJobCard
          job={job}
          allJobs={allJobs}
          variant="scheduled"
          draggable={false} // Prevent double drag handling
          onStageAdvance={() => onStageAdvance(job.id)}
          onClick={onJobClick ? () => onJobClick(job) : undefined}
          onUnschedule={() => onUnschedule(job.id)}
          className="border-0 shadow-none bg-transparent hover:shadow-none"
        />
      </div>
      
      {/* Duration indicator */}
      {durationSlots > 1 && (
        <div className="absolute right-2 top-2 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
          {job.estimatedHours}h
        </div>
      )}
    </div>
  );
}