import { ImprintJob } from "@/types/imprint-job";
import { ProductionStage, DecorationMethod } from "@/components/production/PrintavoPowerScheduler";

// Define stage dependencies for each decoration method
const STAGE_DEPENDENCIES: Record<DecorationMethod, Partial<Record<ProductionStage, ProductionStage[]>>> = {
  screen_printing: {
    burn_screens: [], // No dependencies
    mix_ink: [], // No dependencies - can be done parallel to burn_screens
    print: ["burn_screens", "mix_ink"] // Depends on both burn_screens and mix_ink
  },
  embroidery: {
    digitize: [], // No dependencies
    hoop: ["digitize"], // Depends on digitize
    embroider: ["digitize", "hoop"] // Depends on both digitize and hoop
  },
  dtf: {
    design_file: [], // No dependencies
    dtf_print: ["design_file"], // Depends on design_file
    powder: ["dtf_print"], // Depends on dtf_print
    cure: ["powder"] // Depends on powder
  },
  dtg: {
    pretreat: [], // No dependencies
    dtg_print: ["pretreat"], // Depends on pretreat
    dtg_cure: ["dtg_print"] // Depends on dtg_print
  }
};

// Get all jobs for the same order and decoration method
function getRelatedJobs(job: ImprintJob, allJobs: ImprintJob[]): ImprintJob[] {
  return allJobs.filter(j => 
    j.orderId === job.orderId && 
    j.decorationMethod === job.decorationMethod &&
    j.id !== job.id
  );
}

// Check if a specific stage has been completed for any job in the order
function isStageCompleted(stage: ProductionStage, job: ImprintJob, allJobs: ImprintJob[]): boolean {
  const relatedJobs = getRelatedJobs(job, allJobs);
  const allOrderJobs = [job, ...relatedJobs];
  
  return allOrderJobs.some(j => {
    // If job has passed this stage (current stage is later in sequence or completed)
    if (j.status === "completed") return true;
    
    const stages = Object.keys(STAGE_DEPENDENCIES[j.decorationMethod as DecorationMethod]);
    const stageIndex = stages.indexOf(stage);
    const currentStageIndex = j.currentStage ? stages.indexOf(j.currentStage) : -1;
    
    return currentStageIndex > stageIndex;
  });
}

// Check if a job is ready for its current stage (all dependencies met)
export function isJobReadyForStage(job: ImprintJob, allJobs: ImprintJob[]): boolean {
  // If job is already scheduled or completed, it's considered "ready"
  if (job.status === "scheduled" || job.status === "in_progress" || job.status === "completed") {
    return true;
  }
  
  // If no current stage is set, assume it's ready for the first stage
  if (!job.currentStage) {
    return true;
  }
  
  const dependencies = STAGE_DEPENDENCIES[job.decorationMethod]?.[job.currentStage] || [];
  
  // If no dependencies, job is ready
  if (dependencies.length === 0) {
    return true;
  }
  
  // Check if all dependencies are completed
  return dependencies.every(depStage => isStageCompleted(depStage, job, allJobs));
}

// Get the readiness status for display
export function getJobReadinessStatus(job: ImprintJob, allJobs: ImprintJob[]): {
  isReady: boolean;
  reason?: string;
  missingDependencies?: ProductionStage[];
} {
  const isReady = isJobReadyForStage(job, allJobs);
  
  if (isReady || !job.currentStage) {
    return { isReady: true };
  }
  
  const dependencies = STAGE_DEPENDENCIES[job.decorationMethod]?.[job.currentStage] || [];
  const missingDependencies = dependencies.filter(depStage => 
    !isStageCompleted(depStage, job, allJobs)
  );
  
  return {
    isReady: false,
    reason: `Waiting for: ${missingDependencies.join(", ")}`,
    missingDependencies
  };
}

// Get the next available stages that can be worked on
export function getAvailableStages(job: ImprintJob, allJobs: ImprintJob[]): ProductionStage[] {
  const stages = Object.keys(STAGE_DEPENDENCIES[job.decorationMethod]) as ProductionStage[];
  
  return stages.filter(stage => {
    const dependencies = STAGE_DEPENDENCIES[job.decorationMethod]?.[stage] || [];
    return dependencies.every(depStage => isStageCompleted(depStage, job, allJobs));
  });
}