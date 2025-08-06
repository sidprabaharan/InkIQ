import { Badge } from "@/components/ui/badge";
import { PrintavoJob } from "./PrintavoPowerScheduler";
import { format } from "date-fns";
import { Clock, User, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: PrintavoJob;
  variant: "unscheduled" | "scheduled";
  draggable?: boolean;
  className?: string;
}

export function JobCard({ job, variant, draggable = false, className }: JobCardProps) {
  const isPriority = job.priority === "rush";
  const isOverdue = job.dueDate < new Date() && job.status !== "completed";

  const handleDragStart = (e: React.DragEvent) => {
    if (draggable) {
      e.dataTransfer.setData("application/json", JSON.stringify(job));
      e.dataTransfer.effectAllowed = "move";
    }
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm",
        variant === "scheduled" && "bg-blue-50 border-blue-200",
        isPriority && "border-orange-300 bg-orange-50",
        isOverdue && "border-red-300 bg-red-50",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">
              {job.jobNumber}
            </span>
            {isPriority && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                RUSH
              </Badge>
            )}
            {isOverdue && (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {job.description}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span className="truncate">{job.customer}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="h-3 w-3" />
          <span>{job.quantity} pieces</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{job.estimatedHours}h estimated</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Due: {format(job.dueDate, "MMM d")}
          </span>
          <Badge 
            variant={job.artworkStatus === "approved" ? "default" : "secondary"}
            className="text-xs px-2 py-0"
          >
            {job.artworkStatus}
          </Badge>
        </div>
        
        {job.colors && job.colors.length > 0 && (
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">
              Colors: {job.colors.join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}