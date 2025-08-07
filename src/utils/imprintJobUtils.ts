import { LineItemGroupData } from "@/components/quotes/OrderBreakdown";
import { mockOrderBreakdownData } from "@/data/mockOrderBreakdown";
import { 
  ImprintJob, 
  getDecorationMethodFromType, 
  calculateEstimatedHours, 
  determineArtworkApproval, 
  determinePriority 
} from "@/types/imprint-job";
import { ProductionStage } from "@/components/production/PrintavoPowerScheduler";

// Import sample images
import tshirtWhite from "@/assets/mockups/tshirt-white.jpg";
import poloNavy from "@/assets/mockups/polo-navy.jpg";
import hoodieBlack from "@/assets/mockups/hoodie-black.jpg";
import capGray from "@/assets/mockups/cap-gray.jpg";
import companyLogo from "@/assets/logos/company-logo-1.jpg";
import outdoorLogo from "@/assets/logos/outdoor-logo-2.jpg";
import restaurantLogo from "@/assets/logos/restaurant-logo-3.jpg";
import techLogo from "@/assets/logos/tech-logo-4.jpg";

export function convertOrderBreakdownToImprintJobs(): ImprintJob[] {
  const imprintJobs: ImprintJob[] = [];
  let jobCounter = 1;

  // Sample customer names and order IDs for the mock data
  const orderDetails = [
    { orderId: "ORD-24-1001", customerName: "TechCorp Solutions", dueDate: new Date(2024, 11, 20) },
    { orderId: "ORD-24-1002", customerName: "Creative Studios", dueDate: new Date(2024, 11, 18) },
    { orderId: "ORD-24-1003", customerName: "Local Restaurant", dueDate: new Date(2024, 11, 25) },
    { orderId: "ORD-24-1004", customerName: "Metro Sports Academy", dueDate: new Date(2024, 11, 15) },
    { orderId: "ORD-24-1005", customerName: "Bistro & Grill Chain", dueDate: new Date(2024, 11, 22) },
    { orderId: "ORD-24-1006", customerName: "SoundWave Festival", dueDate: new Date(2024, 11, 12) },
    { orderId: "ORD-24-1007", customerName: "United Charity Foundation", dueDate: new Date(2024, 11, 28) },
    { orderId: "ORD-24-1008", customerName: "Wildcat High School", dueDate: new Date(2024, 11, 19) },
    { orderId: "ORD-24-1009", customerName: "Global Trade Expo", dueDate: new Date(2024, 11, 14) },
    { orderId: "ORD-24-1010", customerName: "Premium Embroidery Co", dueDate: new Date(2024, 11, 30) },
    { orderId: "ORD-24-1011", customerName: "Digital Design Studio", dueDate: new Date(2024, 11, 21) }
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

      // Determine if this should be a print-ready screen printing job
      const isScreenPrint = decorationMethod === "screen_printing";
      const shouldBeAtPrintStage = isScreenPrint && groupIndex < 7; // First 7 screen print groups
      
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
        orderGroupColor: getOrderGroupColor(groupIndex),
        currentStage: shouldBeAtPrintStage ? "print" : getInitialStage(decorationMethod),
        
        // Visual elements - placeholder images for now
        mockupImage: getMockupImageForProduct(lineItemGroup.products[0]?.itemNumber || ""),
        imprintLogo: getImprintLogoForMethod(decorationMethod),
        
        // Detailed imprint specifications
        imprintMethod: `${decorationMethod.replace('_', ' ').toUpperCase()} - ${imprintSection.type}`,
        imprintLocation: imprintSection.placement,
        imprintSize: imprintSection.size,
        imprintColors: imprintSection.colours,
        imprintNotes: imprintSection.notes,
        customerArt: imprintSection.files?.filter(f => f.type === 'customer_art') || [],
        productionFiles: imprintSection.files?.filter(f => f.type === 'production_file') || [],
        proofMockup: imprintSection.files?.filter(f => f.type === 'proof' || f.type === 'mockup') || [],
        
        // Product size breakdown
        sizeBreakdown: createSizeBreakdown(lineItemGroup.products),
        
        // Add sample routing instructions for demonstration
        routingInstructions: createSampleRoutingInstructions(groupIndex, sectionIndex, lineItemGroup, orderDetail)
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

function getInitialStage(decorationMethod: string): ProductionStage {
  const stageMap: Record<string, ProductionStage> = {
    "screen_printing": "burn_screens",
    "embroidery": "digitize", 
    "dtf": "design_file",
    "dtg": "pretreat"
  };
  return stageMap[decorationMethod] || "burn_screens";
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

function getMockupImageForProduct(itemNumber: string): string {
  // Return different mockup images based on item type
  const mockupImages = [
    tshirtWhite,
    poloNavy,
    hoodieBlack,
    capGray
  ];
  
  const index = itemNumber.length % mockupImages.length;
  return mockupImages[index];
}

function getImprintLogoForMethod(method: string): string {
  // Return different logo examples based on decoration method
  const logoImages = [
    companyLogo,    // screen_printing
    outdoorLogo,    // embroidery
    restaurantLogo, // dtf
    techLogo        // dtg
  ];
  
  const methodIndex = method === "screen_printing" ? 0 : method === "embroidery" ? 1 : method === "dtf" ? 2 : 3;
  return logoImages[methodIndex];
}

function createSizeBreakdown(products: any[]): { [productId: string]: { [size: string]: number } } {
  const breakdown: { [productId: string]: { [size: string]: number } } = {};
  
  products.forEach(product => {
    // Mock size distribution for demonstration
    breakdown[product.id] = {
      "S": Math.floor(product.quantity * 0.1),
      "M": Math.floor(product.quantity * 0.3),
      "L": Math.floor(product.quantity * 0.4),
      "XL": Math.floor(product.quantity * 0.15),
      "XXL": Math.floor(product.quantity * 0.05)
    };
  });
  
  return breakdown;
}

function createSampleRoutingInstructions(groupIndex: number, sectionIndex: number, lineItemGroup: any, orderDetail: any) {
  // Only add routing instructions to certain jobs for variety
  const shouldHaveRouting = (groupIndex + sectionIndex) % 3 === 0; // Every 3rd job gets routing
  
  if (!shouldHaveRouting) return undefined;
  
  const routingScenarios = [
    // Multi-imprint routing scenario
    {
      id: `routing-${groupIndex}-${sectionIndex}-1`,
      type: "imprint_routing" as const,
      title: "Multi-Imprint Routing",
      description: "After completion, route items to additional decoration stations",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-1a`,
          destinationType: "next_imprint" as const,
          destinationId: "embroidery-station-2",
          destinationName: "Embroidery Station 2",
          criteria: {
            sizes: ["L", "XL", "XXL"],
            quantities: { "L": 40, "XL": 15, "XXL": 5 }
          },
          instructions: "Route larger sizes to embroidery station for additional logo placement on sleeve",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-1b`,
          destinationType: "shipping_location" as const,
          destinationName: "Main Shipping Bay",
          criteria: {
            sizes: ["S", "M"],
            quantities: { "S": 10, "M": 30 }
          },
          instructions: "Route smaller sizes directly to shipping - no additional decoration needed",
          priority: 2
        }
      ]
    },
    // Size-based shipping split
    {
      id: `routing-${groupIndex}-${sectionIndex}-2`,
      type: "shipping_routing" as const,
      title: "Regional Shipping Split",
      description: "Split order based on size distribution for different shipping locations",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-2a`,
          destinationType: "shipping_location" as const,
          destinationName: "East Coast Distribution Center",
          criteria: {
            sizes: ["S", "M", "L"],
            quantities: { "S": 5, "M": 15, "L": 20 },
            conditions: "Pack in boxes of 20 max"
          },
          instructions: "Ship 40 units (S-L sizes) to East Coast center. Use priority shipping labels.",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-2b`,
          destinationType: "shipping_location" as const,
          destinationName: "West Coast Distribution Center",
          criteria: {
            sizes: ["XL", "XXL"],
            quantities: { "XL": 10, "XXL": 5 },
            conditions: "Separate packaging required"
          },
          instructions: "Ship remaining 15 units (XL-XXL) to West Coast center. Standard shipping.",
          priority: 2
        }
      ]
    },
    // Quality check routing
    {
      id: `routing-${groupIndex}-${sectionIndex}-3`,
      type: "general_routing" as const,
      title: "Quality Control Routing",
      description: "Route samples for quality inspection before bulk processing",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-3a`,
          destinationType: "quality_check" as const,
          destinationName: "QC Station 1",
          criteria: {
            quantities: { "Sample": 3 },
            conditions: "First 3 completed units"
          },
          instructions: "Send first 3 completed units to QC for approval before continuing with remaining quantity",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-3b`,
          destinationType: "storage" as const,
          destinationName: "Production Hold Area",
          criteria: {
            conditions: "Remaining quantity pending QC approval"
          },
          instructions: "Hold remaining units in production area until QC approval received",
          priority: 2
        }
      ]
    }
  ];
  
  // Return one scenario based on the job characteristics
  const scenarioIndex = (groupIndex + sectionIndex) % routingScenarios.length;
  return [routingScenarios[scenarioIndex]];
}