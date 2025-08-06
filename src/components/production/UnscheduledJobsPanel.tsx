import { JobCard } from "./JobCard";
import { PrintavoJob } from "./PrintavoPowerScheduler";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface UnscheduledJobsPanelProps {
  jobs: PrintavoJob[];
  selectedDate: Date;
}

export function UnscheduledJobsPanel({ jobs, selectedDate }: UnscheduledJobsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["today"]));

  // Group jobs by due date
  const jobsByDate = jobs.reduce((acc, job) => {
    const dateKey = format(job.dueDate, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(job);
    return acc;
  }, {} as Record<string, PrintavoJob[]>);

  const toggleSection = (dateKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedSections(newExpanded);
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const sortedDates = Object.keys(jobsByDate).sort();

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Unscheduled Jobs</h2>
        <p className="text-sm text-muted-foreground">
          {jobs.length} jobs waiting to be scheduled
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sortedDates.map(dateKey => {
          const date = new Date(dateKey);
          const dateJobs = jobsByDate[dateKey];
          const isExpanded = expandedSections.has(dateKey);
          
          return (
            <Collapsible 
              key={dateKey} 
              open={isExpanded}
              onOpenChange={() => toggleSection(dateKey)}
            >
              <CollapsibleTrigger className="w-full p-3 border-b border-border hover:bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium text-foreground">
                    {getDateLabel(date)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  {dateJobs.length}
                </span>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="space-y-2 p-3">
                  {dateJobs.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      variant="unscheduled"
                      draggable={true}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
        
        {jobs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p>No unscheduled jobs</p>
            <p className="text-sm mt-1">All jobs are scheduled or completed</p>
          </div>
        )}
      </div>
    </div>
  );
}