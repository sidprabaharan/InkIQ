import { HorizontalJobCard } from "./HorizontalJobCard";
import { ImprintJob } from "@/types/imprint-job";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface UnscheduledJobsPanelProps {
  jobs: ImprintJob[];
  allJobs: ImprintJob[]; // All jobs for dependency checking
  selectedDate: Date;
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: ImprintJob) => void;
}

export function UnscheduledJobsPanel({ jobs, allJobs, onStageAdvance, onJobClick }: UnscheduledJobsPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Sort jobs by due date and priority, then group related jobs together
  const sortedJobs = [...jobs].sort((a, b) => {
    // First sort by due date
    const dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    
    // Then by order ID (to group related jobs)
    if (a.orderId !== b.orderId) {
      return a.orderId.localeCompare(b.orderId);
    }
    
    // Finally by sequence order within the same parent order
    return (a.sequenceOrder || 0) - (b.sequenceOrder || 0);
  });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border bg-muted/30">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Unscheduled Jobs</h3>
          <span className="text-sm text-muted-foreground">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="px-4 pb-4">
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {sortedJobs.map(job => (
                <HorizontalJobCard
                  key={job.id}
                  job={job}
                  allJobs={allJobs}
                  variant="unscheduled"
                  draggable={true}
                  onStageAdvance={() => onStageAdvance(job.id)}
                  onClick={onJobClick ? () => onJobClick(job) : undefined}
                />
              ))}
            </div>
          </ScrollArea>
          
          {jobs.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No unscheduled jobs for this decoration method
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}