import { JobCard } from "./JobCard";
import { PrintavoJob } from "./PrintavoPowerScheduler";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

interface UnscheduledJobsPanelProps {
  jobs: PrintavoJob[];
  selectedDate: Date;
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: PrintavoJob) => void;
}

export function UnscheduledJobsPanel({ jobs, onStageAdvance, onJobClick }: UnscheduledJobsPanelProps) {
  // Group jobs by due date
  const jobsByDate = jobs.reduce((acc, job) => {
    const dateKey = format(job.dueDate, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(job);
    return acc;
  }, {} as Record<string, PrintavoJob[]>);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const sortedDates = Object.keys(jobsByDate).sort();

  const groupedJobs = sortedDates.map(dateKey => {
    const date = new Date(dateKey);
    const dateJobs = jobsByDate[dateKey];
    return {
      date: dateKey,
      label: getDateLabel(date),
      jobs: dateJobs,
      count: dateJobs.length,
      isToday: isToday(date),
      isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
    };
  });

  return (
    <div className="border-b border-border bg-muted/30 p-4">
      <h3 className="font-semibold text-foreground mb-4">Unscheduled Jobs</h3>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {groupedJobs.map(group => (
          <Collapsible key={group.date} defaultOpen={group.isToday || group.isPast}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-background rounded-md text-left">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium",
                  group.isPast && "text-red-600",
                  group.isToday && "text-blue-600"
                )}>
                  {group.label}
                </span>
                <Badge variant={group.isPast ? "destructive" : "secondary"} className="text-xs">
                  {group.count}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-1 pt-2">
              <div className="flex gap-2 flex-wrap">
                {group.jobs.map(job => (
                   <JobCard
                     key={job.id}
                     job={job}
                     variant="unscheduled"
                     draggable={true}
                     className="w-64 flex-shrink-0"
                     onStageAdvance={() => onStageAdvance(job.id)}
                     onClick={onJobClick ? () => onJobClick(job) : undefined}
                   />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      
      {groupedJobs.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No unscheduled jobs for this decoration method
        </p>
      )}
    </div>
  );
}