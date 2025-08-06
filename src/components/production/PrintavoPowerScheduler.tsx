import { useState } from "react";
import { SchedulerHeader } from "./SchedulerHeader";
import { UnscheduledJobsPanel } from "./UnscheduledJobsPanel";
import { SchedulingGrid } from "./SchedulingGrid";
import { DecorationMethodTabs } from "./DecorationMethodTabs";
import { ProductionJob } from "@/types/equipment";

export type DecorationMethod = "screen_printing" | "embroidery" | "dtf" | "dtg";

export interface PrintavoJob {
  id: string;
  jobNumber: string;
  customer: string;
  description: string;
  quantity: number;
  dueDate: Date;
  decorationMethod: DecorationMethod;
  priority: "normal" | "rush";
  status: "unscheduled" | "scheduled" | "in_progress" | "completed";
  estimatedHours: number;
  specialRequirements?: string;
  colors?: string[];
  artworkStatus: "pending" | "approved" | "in_progress";
  scheduledStart?: Date;
  scheduledEnd?: Date;
  equipmentId?: string;
}

export default function PrintavoPowerScheduler() {
  const [selectedMethod, setSelectedMethod] = useState<DecorationMethod>("screen_printing");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<PrintavoJob[]>([
    {
      id: "1",
      jobNumber: "24-001",
      customer: "Acme Corp",
      description: "Company Logo T-Shirts",
      quantity: 144,
      dueDate: new Date(Date.now() + 86400000 * 2),
      decorationMethod: "screen_printing",
      priority: "normal",
      status: "unscheduled",
      estimatedHours: 3,
      colors: ["PMS 186", "Black"],
      artworkStatus: "approved"
    },
    {
      id: "2", 
      jobNumber: "24-002",
      customer: "Tech Solutions",
      description: "Polo Shirt Embroidery",
      quantity: 75,
      dueDate: new Date(Date.now() + 86400000 * 3),
      decorationMethod: "embroidery",
      priority: "rush",
      status: "unscheduled",
      estimatedHours: 4,
      artworkStatus: "approved"
    }
  ]);

  const unscheduledJobs = jobs.filter(job => 
    job.status === "unscheduled" && job.decorationMethod === selectedMethod
  );

  const scheduledJobs = jobs.filter(job => 
    job.status === "scheduled" && job.decorationMethod === selectedMethod
  );

  const handleJobSchedule = (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              status: "scheduled" as const,
              equipmentId,
              scheduledStart: startTime,
              scheduledEnd: endTime
            }
          : job
      )
    );
  };

  const handleJobUnschedule = (jobId: string) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              status: "unscheduled" as const,
              equipmentId: undefined,
              scheduledStart: undefined,
              scheduledEnd: undefined
            }
          : job
      )
    );
  };

  return (
    <div className="flex h-full bg-background">
      <div className="flex flex-col flex-1 overflow-hidden">
        <SchedulerHeader 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedMethod={selectedMethod}
        />
        
        <DecorationMethodTabs 
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <UnscheduledJobsPanel 
            jobs={unscheduledJobs}
            selectedDate={selectedDate}
          />
          
          <SchedulingGrid 
            jobs={scheduledJobs}
            selectedDate={selectedDate}
            selectedMethod={selectedMethod}
            onJobSchedule={handleJobSchedule}
            onJobUnschedule={handleJobUnschedule}
          />
        </div>
      </div>
    </div>
  );
}