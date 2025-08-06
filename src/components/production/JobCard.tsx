import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrintavoJob } from "./PrintavoPowerScheduler";
import { Clock, Calendar, Package, FileCheck, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface JobCardProps {
  job: PrintavoJob;
  variant: "unscheduled" | "scheduled";
  draggable?: boolean;
  className?: string;
  onStageAdvance?: () => void;
  onClick?: () => void;
}

export function JobCard({ job, variant, draggable = false, className, onStageAdvance, onClick }: JobCardProps) {
  const isPriority = job.priority === "high";
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
        "bg-card border border-border rounded-lg p-3 transition-all hover:shadow-sm",
        variant === "scheduled" && "bg-muted/50 border-muted",
        isPriority && "border-orange-300 bg-orange-50",
        isOverdue && "border-red-300 bg-red-50",
        draggable && "cursor-grab active:cursor-grabbing",
        onClick && "cursor-pointer hover:border-primary/50",
        className
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">
              {job.jobNumber}
            </span>
            {isPriority && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                HIGH
              </Badge>
            )}
            {isOverdue && (
              <AlertCircle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {job.description}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{job.customerName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="h-3 w-3" />
          <span>{job.quantity} pieces</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{job.estimatedHours}h</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Due: {format(job.dueDate, "MMM d")}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1">
        {job.artworkApproved && (
          <FileCheck className="h-3 w-3 text-green-600" />
        )}
      </div>
      
      {onStageAdvance && variant === "scheduled" && (
        <div className="mt-2 pt-2 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={onStageAdvance}
            className="w-full text-xs"
          >
            <ChevronRight className="h-3 w-3 mr-1" />
            Next Stage
          </Button>
        </div>
      )}
    </div>
  );
}