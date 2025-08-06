import { useState } from "react";
import { SchedulerHeader } from "./SchedulerHeader";
import { DecorationMethodTabs } from "./DecorationMethodTabs";
import { ProductionStageTabs } from "./ProductionStageTabs";
import { UnscheduledJobsPanel } from "./UnscheduledJobsPanel";
import { SchedulingGrid } from "./SchedulingGrid";

export type DecorationMethod = "screen_printing" | "embroidery" | "dtf" | "dtg";

export type ProductionStage = 
  | "burn_screens" | "mix_ink" | "print" // Screen printing stages
  | "digitize" | "hoop" | "embroider" // Embroidery stages  
  | "design_file" | "dtf_print" | "powder" | "cure" // DTF stages
  | "pretreat" | "dtg_print" | "dtg_cure"; // DTG stages

export interface PrintavoJob {
  id: string;
  jobNumber: string;
  status: "unscheduled" | "scheduled" | "in_progress" | "completed";
  customerName: string;
  description: string;
  quantity: number;
  decorationMethod: DecorationMethod;
  estimatedHours: number;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  artworkApproved: boolean;
  currentStage?: ProductionStage;
  equipmentId?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
}

export default function PrintavoPowerScheduler() {
  const [selectedMethod, setSelectedMethod] = useState<DecorationMethod>("screen_printing");
  const [selectedStage, setSelectedStage] = useState<ProductionStage>("burn_screens");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Production stages by decoration method
  const stagesByMethod = {
    screen_printing: [
      { id: "burn_screens", name: "Burn Screens", color: "bg-orange-100 text-orange-800" },
      { id: "mix_ink", name: "Mix Ink", color: "bg-purple-100 text-purple-800" },
      { id: "print", name: "Print", color: "bg-green-100 text-green-800" }
    ],
    embroidery: [
      { id: "digitize", name: "Digitize", color: "bg-blue-100 text-blue-800" },
      { id: "hoop", name: "Hoop", color: "bg-yellow-100 text-yellow-800" },
      { id: "embroider", name: "Embroider", color: "bg-green-100 text-green-800" }
    ],
    dtf: [
      { id: "design_file", name: "Design File", color: "bg-indigo-100 text-indigo-800" },
      { id: "dtf_print", name: "Print", color: "bg-pink-100 text-pink-800" },
      { id: "powder", name: "Powder", color: "bg-amber-100 text-amber-800" },
      { id: "cure", name: "Cure", color: "bg-green-100 text-green-800" }
    ],
    dtg: [
      { id: "pretreat", name: "Pretreat", color: "bg-cyan-100 text-cyan-800" },
      { id: "dtg_print", name: "Print", color: "bg-emerald-100 text-emerald-800" },
      { id: "dtg_cure", name: "Cure", color: "bg-green-100 text-green-800" }
    ]
  };

  // Sample jobs data
  const [jobs, setJobs] = useState<PrintavoJob[]>([
    {
      id: "job-001",
      jobNumber: "24-1001",
      status: "unscheduled",
      customerName: "Acme Corp",
      description: "Company Polo Shirts",
      quantity: 48,
      decorationMethod: "screen_printing",
      estimatedHours: 2,
      dueDate: new Date(2024, 11, 15),
      priority: "high",
      artworkApproved: true,
      currentStage: "burn_screens"
    },
    {
      id: "job-002", 
      jobNumber: "24-1002",
      status: "scheduled",
      customerName: "Sports Club",
      description: "Team Jerseys",
      quantity: 24,
      decorationMethod: "screen_printing", 
      estimatedHours: 1.5,
      dueDate: new Date(2024, 11, 16),
      priority: "medium",
      artworkApproved: true,
      equipmentId: "screen-station-1",
      currentStage: "mix_ink",
      scheduledStart: new Date(2024, 11, 15, 10, 0),
      scheduledEnd: new Date(2024, 11, 15, 11, 30)
    },
    {
      id: "job-003",
      jobNumber: "24-1003", 
      status: "unscheduled",
      customerName: "Local Restaurant",
      description: "Staff T-Shirts",
      quantity: 12,
      decorationMethod: "embroidery",
      estimatedHours: 3,
      dueDate: new Date(2024, 11, 17),
      priority: "low",
      artworkApproved: false,
      currentStage: "digitize"
    }
  ]);

  // Update selected stage when method changes
  const handleMethodChange = (method: DecorationMethod) => {
    setSelectedMethod(method);
    const firstStage = stagesByMethod[method][0];
    setSelectedStage(firstStage.id as ProductionStage);
  };

  // Filter jobs by selected method and stage
  const filteredJobs = jobs.filter(job => 
    job.decorationMethod === selectedMethod && job.currentStage === selectedStage
  );
  
  const unscheduledJobs = filteredJobs.filter(job => job.status === "unscheduled");
  const scheduledJobs = filteredJobs.filter(job => job.status === "scheduled");
  
  const handleJobSchedule = (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => {
    setJobs(jobs => jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: "scheduled", equipmentId, scheduledStart: startTime, scheduledEnd: endTime }
        : job
    ));
  };

  const handleJobUnschedule = (jobId: string) => {
    setJobs(jobs => jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: "unscheduled", equipmentId: undefined, scheduledStart: undefined, scheduledEnd: undefined }
        : job
    ));
  };

  const handleStageAdvance = (jobId: string) => {
    const currentStages = stagesByMethod[selectedMethod];
    const currentIndex = currentStages.findIndex(stage => stage.id === selectedStage);
    
    if (currentIndex < currentStages.length - 1) {
      const nextStage = currentStages[currentIndex + 1];
      setJobs(jobs => jobs.map(job => 
        job.id === jobId 
          ? { ...job, currentStage: nextStage.id as ProductionStage, status: "unscheduled", equipmentId: undefined, scheduledStart: undefined, scheduledEnd: undefined }
          : job
      ));
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <SchedulerHeader 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedMethod={selectedMethod}
      />
      
      <DecorationMethodTabs 
        selectedMethod={selectedMethod}
        onMethodChange={handleMethodChange}
      />
      
      <ProductionStageTabs
        selectedMethod={selectedMethod}
        selectedStage={selectedStage}
        onStageChange={setSelectedStage}
        stages={stagesByMethod[selectedMethod]}
      />
      
      <UnscheduledJobsPanel 
        jobs={unscheduledJobs}
        selectedDate={selectedDate}
        onStageAdvance={handleStageAdvance}
      />
      
      <SchedulingGrid 
        jobs={scheduledJobs}
        selectedDate={selectedDate}
        selectedMethod={selectedMethod}
        selectedStage={selectedStage}
        onJobSchedule={handleJobSchedule}
        onJobUnschedule={handleJobUnschedule}
        onStageAdvance={handleStageAdvance}
      />
    </div>
  );
}