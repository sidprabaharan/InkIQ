import { useState } from "react";
import { SchedulerHeader } from "./SchedulerHeader";
import { DecorationMethodTabs } from "./DecorationMethodTabs";
import { ProductionStageTabs } from "./ProductionStageTabs";
import { UnscheduledJobsPanel } from "./UnscheduledJobsPanel";
import { SchedulingGrid } from "./SchedulingGrid";
import { JobDetailModal } from "./JobDetailModal";

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
  // Enhanced fields for detailed tracking
  quoteId?: string;
  lineItemId?: string;
  imprintId?: string;
  orderId?: string;
  setupRequired?: boolean;
  specialInstructions?: string;
  // Multi-decoration job relationships
  parentOrderId: string;
  relatedJobIds: string[];
  sequenceOrder?: number;
  imprintLocation: string;
  dependsOnJobs?: string[];
  blocksJobs?: string[];
  garmentType: string;
  garmentColors: string[];
  orderGroupColor?: string; // For visual grouping
}

export default function PrintavoPowerScheduler() {
  const [selectedMethod, setSelectedMethod] = useState<DecorationMethod>("screen_printing");
  const [selectedStage, setSelectedStage] = useState<ProductionStage>("burn_screens");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedJob, setSelectedJob] = useState<PrintavoJob | null>(null);
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

  // Sample jobs data with multi-decoration orders
  const [jobs, setJobs] = useState<PrintavoJob[]>([
    // Order #24-1001 - Acme Corp (Screen + Embroidery combo)
    {
      id: "job-001a",
      jobNumber: "24-1001A",
      status: "unscheduled",
      customerName: "Acme Corp",
      description: "Company Polo - Logo Embroidery",
      quantity: 48,
      decorationMethod: "embroidery",
      estimatedHours: 2.5,
      dueDate: new Date(2024, 11, 15),
      priority: "high",
      artworkApproved: true,
      currentStage: "digitize",
      parentOrderId: "order-1001",
      relatedJobIds: ["job-001b"],
      sequenceOrder: 1,
      imprintLocation: "Left Chest",
      garmentType: "Polo Shirt",
      garmentColors: ["Navy", "White"],
      orderGroupColor: "border-blue-200 bg-blue-50"
    },
    {
      id: "job-001b",
      jobNumber: "24-1001B",
      status: "unscheduled",
      customerName: "Acme Corp",
      description: "Company Polo - Back Print",
      quantity: 48,
      decorationMethod: "screen_printing",
      estimatedHours: 2,
      dueDate: new Date(2024, 11, 15),
      priority: "high",
      artworkApproved: true,
      currentStage: "burn_screens",
      parentOrderId: "order-1001",
      relatedJobIds: ["job-001a"],
      sequenceOrder: 2,
      imprintLocation: "Back",
      dependsOnJobs: ["job-001a"],
      garmentType: "Polo Shirt",
      garmentColors: ["Navy", "White"],
      orderGroupColor: "border-blue-200 bg-blue-50"
    },

    // Order #24-1002 - Sports Club (Single decoration)
    {
      id: "job-002",
      jobNumber: "24-1002",
      status: "scheduled",
      customerName: "Sports Club",
      description: "Team Jerseys - Number & Name",
      quantity: 24,
      decorationMethod: "screen_printing",
      estimatedHours: 1.5,
      dueDate: new Date(2024, 11, 16),
      priority: "medium",
      artworkApproved: true,
      equipmentId: "screen-station-1",
      currentStage: "mix_ink",
      scheduledStart: new Date(2024, 11, 15, 10, 0),
      scheduledEnd: new Date(2024, 11, 15, 11, 30),
      parentOrderId: "order-1002",
      relatedJobIds: [],
      imprintLocation: "Back",
      garmentType: "Jersey",
      garmentColors: ["Red", "Black"],
      orderGroupColor: "border-red-200 bg-red-50"
    },

    // Order #24-1003 - Local Restaurant (Multi-location embroidery)
    {
      id: "job-003a",
      jobNumber: "24-1003A",
      status: "unscheduled",
      customerName: "Local Restaurant",
      description: "Staff Shirts - Logo",
      quantity: 12,
      decorationMethod: "embroidery",
      estimatedHours: 1.5,
      dueDate: new Date(2024, 11, 17),
      priority: "low",
      artworkApproved: false,
      currentStage: "digitize",
      parentOrderId: "order-1003",
      relatedJobIds: ["job-003b"],
      sequenceOrder: 1,
      imprintLocation: "Left Chest",
      garmentType: "T-Shirt",
      garmentColors: ["Black"],
      orderGroupColor: "border-green-200 bg-green-50"
    },
    {
      id: "job-003b",
      jobNumber: "24-1003B",
      status: "unscheduled",
      customerName: "Local Restaurant",
      description: "Staff Shirts - Name",
      quantity: 12,
      decorationMethod: "embroidery",
      estimatedHours: 2,
      dueDate: new Date(2024, 11, 17),
      priority: "low",
      artworkApproved: false,
      currentStage: "digitize",
      parentOrderId: "order-1003",
      relatedJobIds: ["job-003a"],
      sequenceOrder: 2,
      imprintLocation: "Right Chest",
      garmentType: "T-Shirt",
      garmentColors: ["Black"],
      orderGroupColor: "border-green-200 bg-green-50"
    },

    // Order #24-1004 - Tech Startup (DTF)
    {
      id: "job-004",
      jobNumber: "24-1004",
      status: "unscheduled",
      customerName: "Tech Startup",
      description: "Hoodie - Full Color Logo",
      quantity: 30,
      decorationMethod: "dtf",
      estimatedHours: 3,
      dueDate: new Date(2024, 11, 18),
      priority: "medium",
      artworkApproved: true,
      currentStage: "design_file",
      parentOrderId: "order-1004",
      relatedJobIds: [],
      imprintLocation: "Center Chest",
      garmentType: "Hoodie",
      garmentColors: ["Charcoal", "Navy"],
      orderGroupColor: "border-purple-200 bg-purple-50"
    },

    // Order #24-1005 - School District (Multiple garments, multiple decorations)
    {
      id: "job-005a",
      jobNumber: "24-1005A",
      status: "unscheduled",
      customerName: "School District",
      description: "Teacher Polos - School Logo",
      quantity: 75,
      decorationMethod: "embroidery",
      estimatedHours: 4,
      dueDate: new Date(2024, 11, 20),
      priority: "high",
      artworkApproved: true,
      currentStage: "digitize",
      parentOrderId: "order-1005",
      relatedJobIds: ["job-005b", "job-005c"],
      sequenceOrder: 1,
      imprintLocation: "Left Chest",
      garmentType: "Polo Shirt",
      garmentColors: ["Navy", "Gray"],
      orderGroupColor: "border-yellow-200 bg-yellow-50"
    },
    {
      id: "job-005b",
      jobNumber: "24-1005B",
      status: "unscheduled",
      customerName: "School District",
      description: "Student T-Shirts - Mascot",
      quantity: 200,
      decorationMethod: "screen_printing",
      estimatedHours: 3,
      dueDate: new Date(2024, 11, 20),
      priority: "high",
      artworkApproved: true,
      currentStage: "burn_screens",
      parentOrderId: "order-1005",
      relatedJobIds: ["job-005a", "job-005c"],
      imprintLocation: "Front",
      garmentType: "T-Shirt",
      garmentColors: ["White", "Gray"],
      orderGroupColor: "border-yellow-200 bg-yellow-50"
    },
    {
      id: "job-005c",
      jobNumber: "24-1005C",
      status: "unscheduled",
      customerName: "School District",
      description: "Teacher Polos - Department",
      quantity: 75,
      decorationMethod: "embroidery",
      estimatedHours: 2,
      dueDate: new Date(2024, 11, 20),
      priority: "medium",
      artworkApproved: false,
      currentStage: "digitize",
      parentOrderId: "order-1005",
      relatedJobIds: ["job-005a", "job-005b"],
      sequenceOrder: 2,
      imprintLocation: "Right Sleeve",
      dependsOnJobs: ["job-005a"],
      garmentType: "Polo Shirt",
      garmentColors: ["Navy", "Gray"],
      orderGroupColor: "border-yellow-200 bg-yellow-50"
    },

    // Order #24-1006 - Fitness Center (DTG)
    {
      id: "job-006",
      jobNumber: "24-1006",
      status: "unscheduled",
      customerName: "Fitness Center",
      description: "Performance Shirts - Gradient Logo",
      quantity: 40,
      decorationMethod: "dtg",
      estimatedHours: 2.5,
      dueDate: new Date(2024, 11, 19),
      priority: "medium",
      artworkApproved: true,
      currentStage: "pretreat",
      parentOrderId: "order-1006",
      relatedJobIds: [],
      imprintLocation: "Front",
      garmentType: "Performance Shirt",
      garmentColors: ["Black", "Navy"],
      orderGroupColor: "border-cyan-200 bg-cyan-50"
    },

    // Order #24-1007 - Construction Company (Heavy duty)
    {
      id: "job-007a",
      jobNumber: "24-1007A",
      status: "unscheduled",
      customerName: "Construction Co",
      description: "Work Shirts - Company Logo",
      quantity: 60,
      decorationMethod: "embroidery",
      estimatedHours: 3.5,
      dueDate: new Date(2024, 11, 21),
      priority: "low",
      artworkApproved: true,
      currentStage: "digitize",
      parentOrderId: "order-1007",
      relatedJobIds: ["job-007b"],
      sequenceOrder: 1,
      imprintLocation: "Left Chest",
      garmentType: "Work Shirt",
      garmentColors: ["Hi-Vis Yellow"],
      orderGroupColor: "border-orange-200 bg-orange-50"
    },
    {
      id: "job-007b",
      jobNumber: "24-1007B",
      status: "unscheduled",
      customerName: "Construction Co",
      description: "Work Shirts - Safety Text",
      quantity: 60,
      decorationMethod: "screen_printing",
      estimatedHours: 2,
      dueDate: new Date(2024, 11, 21),
      priority: "low",
      artworkApproved: true,
      currentStage: "burn_screens",
      parentOrderId: "order-1007",
      relatedJobIds: ["job-007a"],
      sequenceOrder: 2,
      imprintLocation: "Back",
      dependsOnJobs: ["job-007a"],
      garmentType: "Work Shirt",
      garmentColors: ["Hi-Vis Yellow"],
      orderGroupColor: "border-orange-200 bg-orange-50"
    },

    // Order #24-1008 - Event Company (Rush job)
    {
      id: "job-008",
      jobNumber: "24-1008",
      status: "unscheduled",
      customerName: "Event Company",
      description: "Staff Tees - Event Logo",
      quantity: 25,
      decorationMethod: "dtf",
      estimatedHours: 1.5,
      dueDate: new Date(2024, 11, 14), // Tomorrow - rush
      priority: "high",
      artworkApproved: true,
      currentStage: "design_file",
      parentOrderId: "order-1008",
      relatedJobIds: [],
      imprintLocation: "Front",
      garmentType: "T-Shirt",
      garmentColors: ["Black"],
      orderGroupColor: "border-pink-200 bg-pink-50",
      specialInstructions: "RUSH - Needed for event tomorrow"
    },

    // Order #24-1009 - Medical Practice (Professional)
    {
      id: "job-009",
      jobNumber: "24-1009",
      status: "unscheduled",
      customerName: "Medical Practice",
      description: "Scrubs - Practice Logo",
      quantity: 18,
      decorationMethod: "embroidery",
      estimatedHours: 2,
      dueDate: new Date(2024, 11, 22),
      priority: "medium",
      artworkApproved: false,
      currentStage: "digitize",
      parentOrderId: "order-1009",
      relatedJobIds: [],
      imprintLocation: "Left Chest",
      garmentType: "Scrub Top",
      garmentColors: ["Navy", "Ceil Blue"],
      orderGroupColor: "border-indigo-200 bg-indigo-50"
    },

    // Order #24-1010 - Band Merch (Multiple items)
    {
      id: "job-010a",
      jobNumber: "24-1010A",
      status: "unscheduled",
      customerName: "Rock Band",
      description: "Band Tees - Album Art",
      quantity: 100,
      decorationMethod: "screen_printing",
      estimatedHours: 2.5,
      dueDate: new Date(2024, 11, 25),
      priority: "medium",
      artworkApproved: true,
      currentStage: "burn_screens",
      parentOrderId: "order-1010",
      relatedJobIds: ["job-010b"],
      imprintLocation: "Front",
      garmentType: "T-Shirt",
      garmentColors: ["Black", "White"],
      orderGroupColor: "border-slate-200 bg-slate-50"
    },
    {
      id: "job-010b",
      jobNumber: "24-1010B",
      status: "unscheduled",
      customerName: "Rock Band",
      description: "Hoodies - Band Logo",
      quantity: 50,
      decorationMethod: "dtf",
      estimatedHours: 3,
      dueDate: new Date(2024, 11, 25),
      priority: "medium",
      artworkApproved: true,
      currentStage: "design_file",
      parentOrderId: "order-1010",
      relatedJobIds: ["job-010a"],
      imprintLocation: "Front",
      garmentType: "Hoodie",
      garmentColors: ["Black", "Charcoal"],
      orderGroupColor: "border-slate-200 bg-slate-50"
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
    setIsJobDetailModalOpen(false);
  };

  const handleJobClick = (job: PrintavoJob) => {
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
        selectedDate={selectedDate}
        onStageAdvance={handleStageAdvance}
        onJobClick={handleJobClick}
      />
      
      <SchedulingGrid 
        jobs={scheduledJobs}
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