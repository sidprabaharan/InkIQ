import { useState } from "react";
import { SchedulerHeader } from "./SchedulerHeader";
import { DecorationMethodTabs } from "./DecorationMethodTabs";
import { ProductionStageTabs } from "./ProductionStageTabs";
import { UnscheduledJobsPanel } from "./UnscheduledJobsPanel";
import { SchedulingGrid } from "./SchedulingGrid";
import { JobDetailModal } from "./JobDetailModal";
import { ImprintJob } from "@/types/imprint-job";
import { convertOrderBreakdownToImprintJobs, getJobsForMethod, getJobsForStage, getUnscheduledJobs, getScheduledJobs } from "@/utils/imprintJobUtils";

export type DecorationMethod = "screen_printing" | "embroidery" | "dtf" | "dtg";

export type ProductionStage = 
  | "burn_screens" | "mix_ink" | "print" // Screen printing stages
  | "digitize" | "hoop" | "embroider" // Embroidery stages  
  | "design_file" | "dtf_print" | "powder" | "cure" // DTF stages
  | "pretreat" | "dtg_print" | "dtg_cure"; // DTG stages

// Keep PrintavoJob for backward compatibility but prefer ImprintJob
export interface PrintavoJob extends ImprintJob {
  // Legacy fields for compatibility
  quantity: number;
  imprintLocation: string;
  parentOrderId: string;
  relatedJobIds: string[];
  garmentType: string;
  garmentColors: string[];
}

export default function PrintavoPowerScheduler() {
  const [selectedMethod, setSelectedMethod] = useState<DecorationMethod>("screen_printing");
  const [selectedStage, setSelectedStage] = useState<ProductionStage>("burn_screens");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedJob, setSelectedJob] = useState<ImprintJob | null>(null);
  const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false);
  
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

  // Convert order breakdown data to imprint jobs
  const [jobs, setJobs] = useState<ImprintJob[]>(convertOrderBreakdownToImprintJobs());

  // Update selected stage when method changes
  const handleMethodChange = (method: DecorationMethod) => {
    setSelectedMethod(method);
    const firstStage = stagesByMethod[method][0];
    setSelectedStage(firstStage.id as ProductionStage);
  };

  // Filter jobs by selected method and stage
  const filteredJobs = jobs.filter(job => 
    job.decorationMethod === selectedMethod && 
    (!job.currentStage || job.currentStage === selectedStage)
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
    setIsJobDetailModalOpen(false);
  };

  const handleJobClick = (job: ImprintJob) => {
    setSelectedJob(job);
    setIsJobDetailModalOpen(true);
  };

  const handleJobUnscheduleFromModal = (jobId: string) => {
    handleJobUnschedule(jobId);
    setIsJobDetailModalOpen(false);
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
        allJobs={jobs}
        selectedDate={selectedDate}
        onStageAdvance={handleStageAdvance}
        onJobClick={handleJobClick}
      />
      
      <SchedulingGrid 
        jobs={scheduledJobs}
        allJobs={jobs}
        selectedDate={selectedDate}
        selectedMethod={selectedMethod}
        selectedStage={selectedStage}
        onJobSchedule={handleJobSchedule}
        onJobUnschedule={handleJobUnschedule}
        onStageAdvance={handleStageAdvance}
        onJobClick={handleJobClick}
      />

      <JobDetailModal
        job={selectedJob}
        open={isJobDetailModalOpen}
        onOpenChange={setIsJobDetailModalOpen}
        onStageAdvance={selectedJob ? () => handleStageAdvance(selectedJob.id) : undefined}
        onUnschedule={selectedJob ? () => handleJobUnscheduleFromModal(selectedJob.id) : undefined}
        allJobs={jobs}
      />
    </div>
  );
}
