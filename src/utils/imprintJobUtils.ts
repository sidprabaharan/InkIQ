import { LineItemGroupData } from "@/components/quotes/OrderBreakdown";
import { mockOrderBreakdownData } from "@/data/mockOrderBreakdown";
import { 
  ImprintJob, 
  getDecorationMethodFromType, 
  calculateEstimatedHours, 
  determineArtworkApproval, 
  determinePriority 
} from "@/types/imprint-job";

export function convertOrderBreakdownToImprintJobs(): ImprintJob[] {
  const imprintJobs: ImprintJob[] = [];
  let jobCounter = 1;

  // Sample customer names and order IDs for the mock data
  const orderDetails = [
    { orderId: "ORD-24-1001", customerName: "TechCorp Solutions", dueDate: new Date(2024, 11, 20) },
    { orderId: "ORD-24-1002", customerName: "Creative Studios", dueDate: new Date(2024, 11, 18) },
    { orderId: "ORD-24-1003", customerName: "Local Restaurant", dueDate: new Date(2024, 11, 25) }
  ];

  mockOrderBreakdownData.forEach((lineItemGroup, groupIndex) => {
    const orderDetail = orderDetails[groupIndex] || orderDetails[0];
    
    lineItemGroup.imprintSections.forEach((imprintSection, sectionIndex) => {
      const decorationMethod = getDecorationMethodFromType(imprintSection.type);
      const totalQuantity = lineItemGroup.products.reduce((sum, product) => sum + product.quantity, 0);
      const estimatedHours = calculateEstimatedHours(decorationMethod, totalQuantity);
      const artworkApproved = determineArtworkApproval(lineItemGroup.products);
      const priority = determinePriority(orderDetail.dueDate);

      // Create job number with sequence
      const jobNumber = `${orderDetail.orderId.split('-').pop()}-${String.fromCharCode(65 + sectionIndex)}`;

      const imprintJob: ImprintJob = {
        id: `imprint-job-${jobCounter++}`,
        jobNumber,
        orderId: orderDetail.orderId,
        lineItemGroupId: lineItemGroup.id,
        imprintSectionId: `${lineItemGroup.id}-section-${sectionIndex}`,
        status: "unscheduled",
        customerName: orderDetail.customerName,
        description: `${imprintSection.type} - ${imprintSection.placement}`,
        decorationMethod,
        placement: imprintSection.placement,
        size: imprintSection.size,
        colours: imprintSection.colours,
        notes: imprintSection.notes,
        files: imprintSection.files || [],
        products: lineItemGroup.products.map(product => ({
          id: product.id,
          itemNumber: product.itemNumber,
          color: product.color,
          description: product.description,
          quantity: product.quantity,
          status: product.status
        })),
        totalQuantity,
        estimatedHours,
        dueDate: orderDetail.dueDate,
        priority,
        artworkApproved,
        setupRequired: true,
        sequenceOrder: sectionIndex,
        orderGroupColor: getOrderGroupColor(groupIndex)
      };

      imprintJobs.push(imprintJob);
    });
  });

  // Set up dependencies for jobs in the same order
  imprintJobs.forEach(job => {
    const relatedJobs = imprintJobs.filter(j => 
      j.orderId === job.orderId && j.id !== job.id
    );
    
    if (relatedJobs.length > 0) {
      // If this is a screen printing job, it might depend on digitization
      if (job.decorationMethod === "screen_printing") {
        const embroideryJob = relatedJobs.find(j => j.decorationMethod === "embroidery");
        if (embroideryJob) {
          job.dependsOnJobs = [embroideryJob.id];
        }
      }
    }
  });

  return imprintJobs;
}

function getOrderGroupColor(index: number): string {
  const colors = [
    "bg-blue-100 border-blue-300",
    "bg-green-100 border-green-300", 
    "bg-purple-100 border-purple-300",
    "bg-orange-100 border-orange-300",
    "bg-pink-100 border-pink-300",
    "bg-cyan-100 border-cyan-300"
  ];
  return colors[index % colors.length];
}

export function getJobsForMethod(jobs: ImprintJob[], method: string): ImprintJob[] {
  return jobs.filter(job => job.decorationMethod === method);
}

export function getJobsForStage(jobs: ImprintJob[], stage: string): ImprintJob[] {
  return jobs.filter(job => 
    job.currentStage === stage || 
    (!job.currentStage && job.status === "unscheduled")
  );
}

export function getUnscheduledJobs(jobs: ImprintJob[]): ImprintJob[] {
  return jobs.filter(job => job.status === "unscheduled");
}

export function getScheduledJobs(jobs: ImprintJob[]): ImprintJob[] {
  return jobs.filter(job => job.status === "scheduled" || job.status === "in_progress");
}