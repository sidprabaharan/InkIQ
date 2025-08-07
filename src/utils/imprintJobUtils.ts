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

  // Enhanced customer details with order context
  const orderDetails = [
    { orderId: "ORD-24-1001", customerName: "TechCorp Solutions", dueDate: new Date(2024, 11, 20), isRush: false, customerApprovalStatus: "approved", artworkRevisions: 0 },
    { orderId: "ORD-24-1002", customerName: "Creative Studios", dueDate: new Date(2024, 11, 18), isRush: true, customerApprovalStatus: "pending_revision", artworkRevisions: 2 },
    { orderId: "ORD-24-1003", customerName: "Local Restaurant", dueDate: new Date(2024, 11, 25), isRush: false, customerApprovalStatus: "approved", artworkRevisions: 1 },
    { orderId: "ORD-24-1004", customerName: "Metro Sports Academy", dueDate: new Date(2024, 11, 15), isRush: true, customerApprovalStatus: "approved", artworkRevisions: 0 },
    { orderId: "ORD-24-1005", customerName: "Bistro & Grill Chain", dueDate: new Date(2024, 11, 22), isRush: false, customerApprovalStatus: "approved", artworkRevisions: 1 },
    { orderId: "ORD-24-1006", customerName: "SoundWave Festival", dueDate: new Date(2024, 11, 12), isRush: true, customerApprovalStatus: "approved", artworkRevisions: 3 },
    { orderId: "ORD-24-1007", customerName: "United Charity Foundation", dueDate: new Date(2024, 11, 28), isRush: false, customerApprovalStatus: "pending_customer", artworkRevisions: 0 },
    { orderId: "ORD-24-1008", customerName: "Wildcat High School", dueDate: new Date(2024, 11, 19), isRush: false, customerApprovalStatus: "approved", artworkRevisions: 1 },
    { orderId: "ORD-24-1009", customerName: "Global Trade Expo", dueDate: new Date(2024, 11, 14), isRush: true, customerApprovalStatus: "approved", artworkRevisions: 0 },
    { orderId: "ORD-24-1010", customerName: "Premium Embroidery Co", dueDate: new Date(2024, 11, 30), isRush: false, customerApprovalStatus: "pending_approval", artworkRevisions: 2 },
    { orderId: "ORD-24-1011", customerName: "Digital Design Studio", dueDate: new Date(2024, 11, 21), isRush: false, customerApprovalStatus: "approved", artworkRevisions: 0 },
    { orderId: "ORD-24-1012", customerName: "Elite Corporate Events", dueDate: new Date(2024, 11, 16), isRush: true, customerApprovalStatus: "approved", artworkRevisions: 1 },
    { orderId: "ORD-24-1013", customerName: "Mountain Brewing Co", dueDate: new Date(2024, 11, 24), isRush: false, customerApprovalStatus: "approved", artworkRevisions: 0 },
    { orderId: "ORD-24-1014", customerName: "Fitness Revolution", dueDate: new Date(2024, 11, 17), isRush: true, customerApprovalStatus: "approved", artworkRevisions: 2 },
    { orderId: "ORD-24-1015", customerName: "Urban Art Collective", dueDate: new Date(2024, 11, 26), isRush: false, customerApprovalStatus: "pending_revision", artworkRevisions: 3 }
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

      // Generate complex job dependencies and relationships
      const jobId = `imprint-job-${jobCounter++}`;
      const isScreenPrint = decorationMethod === "screen_printing";
      const shouldBeAtPrintStage = isScreenPrint && (groupIndex < 8 || orderDetail.customerApprovalStatus === "approved");
      
      // Determine dependencies and blocking relationships
      const dependencies = createJobDependencies(jobId, groupIndex, sectionIndex, decorationMethod, orderDetail);
      const relatedImprints = createRelatedImprints(jobId, lineItemGroup, sectionIndex);
      
      const imprintJob: ImprintJob = {
        id: jobId,
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
        files: createEnhancedFilesList(imprintSection.files || [], decorationMethod, orderDetail.artworkRevisions),
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
        priority: orderDetail.isRush ? "high" : priority,
        artworkApproved: orderDetail.customerApprovalStatus === "approved",
        setupRequired: true,
        sequenceOrder: sectionIndex,
        orderGroupColor: getOrderGroupColor(groupIndex),
        currentStage: shouldBeAtPrintStage ? "print" : getInitialStage(decorationMethod),
        
        // Enhanced job metadata (stored in notes for now since interface is limited)
        notes: createEnhancedNotes(imprintSection.notes, orderDetail, decorationMethod, totalQuantity) + 
               `\n\nDEPENDENCIES: ${dependencies.dependsOn.join(', ')}\n` +
               `BLOCKS: ${dependencies.blocks.join(', ')}\n` +
               `RELATED: ${relatedImprints.join(', ')}\n` +
               `EQUIPMENT: ${getEquipmentRequirements(decorationMethod, totalQuantity).join(', ')}\n` +
               `QC CHECKPOINTS: ${createQualityCheckpoints(decorationMethod, totalQuantity).join(', ')}\n` +
               `SETUP: ${createSetupInstructions(decorationMethod, imprintSection, orderDetail).join('; ')}\n` +
               `COLOR NOTES: ${createColorMatchingNotes(imprintSection.colours, decorationMethod).join('; ')}\n` +
               `SPECIAL REQ: ${createSpecialRequirements(orderDetail, decorationMethod).join('; ')}`,
        
        // Visual elements
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
        sizeBreakdown: createDetailedSizeBreakdown(lineItemGroup.products, totalQuantity),
        
        // Comprehensive routing instructions
        routingInstructions: createComprehensiveRoutingInstructions(groupIndex, sectionIndex, lineItemGroup, orderDetail, decorationMethod)
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

// Enhanced helper functions for comprehensive job creation
function createJobDependencies(jobId: string, groupIndex: number, sectionIndex: number, decorationMethod: string, orderDetail: any) {
  const dependencies = { dependsOn: [] as string[], blocks: [] as string[] };
  
  // Create cross-method dependencies
  if (decorationMethod === "screen_printing" && sectionIndex > 0) {
    dependencies.dependsOn.push(`artwork-approval-${orderDetail.orderId}`);
    if (groupIndex % 3 === 0) {
      dependencies.dependsOn.push(`embroidery-digitization-${orderDetail.orderId}`);
    }
  }
  
  // Create sequential dependencies within same order
  if (sectionIndex > 0) {
    dependencies.dependsOn.push(`imprint-job-${parseInt(jobId.split('-').pop()!) - 1}`);
  }
  
  // Some jobs block others
  if (decorationMethod === "screen_printing" && sectionIndex === 0) {
    dependencies.blocks.push(`quality-check-${orderDetail.orderId}`);
  }
  
  return dependencies;
}

function createRelatedImprints(jobId: string, lineItemGroup: any, sectionIndex: number) {
  const related: string[] = [];
  
  // Create relationships to other sections in same group
  lineItemGroup.imprintSections.forEach((_: any, index: number) => {
    if (index !== sectionIndex) {
      related.push(`${lineItemGroup.id}-section-${index}`);
    }
  });
  
  return related;
}

function createEnhancedNotes(originalNotes: string, orderDetail: any, decorationMethod: string, quantity: number) {
  let notes = originalNotes || "";
  
  // Add customer-specific notes
  if (orderDetail.isRush) {
    notes += " • RUSH ORDER - Priority production required";
  }
  
  if (orderDetail.artworkRevisions > 0) {
    notes += ` • ${orderDetail.artworkRevisions} artwork revision(s) completed`;
  }
  
  // Add decoration-specific notes
  if (decorationMethod === "screen_printing") {
    notes += " • Pre-check screen tension before setup";
    if (quantity > 100) {
      notes += " • High volume order - check ink supply";
    }
  }
  
  // Add quality notes
  notes += " • QC sample required before bulk production";
  
  return notes;
}

function createEnhancedFilesList(originalFiles: any[], decorationMethod: string, revisions: number) {
  const files = [...originalFiles];
  
  // Add revision files
  for (let i = 1; i <= revisions; i++) {
    files.push({
      id: `revision-${i}`,
      name: `artwork-revision-v${i}.ai`,
      type: 'revision',
      url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
    });
  }
  
  // Add production files
  if (decorationMethod === "screen_printing") {
    files.push(
      {
        id: 'screen-film',
        name: 'screen-film-positive.pdf',
        type: 'production_file',
        url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
      },
      {
        id: 'color-formula',
        name: 'ink-color-formula.pdf',
        type: 'production_file',
        url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
      }
    );
  }
  
  return files;
}

function getEquipmentRequirements(decorationMethod: string, quantity: number) {
  const requirements: string[] = [];
  
  if (decorationMethod === "screen_printing") {
    if (quantity > 200) {
      requirements.push("Automatic press required");
    } else {
      requirements.push("Manual press acceptable");
    }
    requirements.push("Screen mesh: 156 count");
    requirements.push("Squeegee: 70 durometer");
  }
  
  return requirements;
}

function createQualityCheckpoints(decorationMethod: string, quantity: number) {
  const checkpoints: string[] = [];
  
  checkpoints.push("First piece approval");
  if (quantity > 50) {
    checkpoints.push("Mid-run quality check");
  }
  checkpoints.push("Final inspection");
  
  if (decorationMethod === "screen_printing") {
    checkpoints.push("Ink adhesion test");
    checkpoints.push("Color consistency check");
  }
  
  return checkpoints;
}

function createSetupInstructions(decorationMethod: string, imprintSection: any, orderDetail: any) {
  const instructions: string[] = [];
  
  if (decorationMethod === "screen_printing") {
    instructions.push("1. Mount screens with proper registration");
    instructions.push("2. Mix inks according to color formula");
    instructions.push("3. Set proper off-contact distance");
    instructions.push("4. Test print on scrap material");
    instructions.push("5. Adjust squeegee pressure and speed");
  }
  
  if (orderDetail.isRush) {
    instructions.unshift("⚠️ RUSH ORDER - Expedite setup");
  }
  
  return instructions;
}

function createColorMatchingNotes(colours: string, decorationMethod: string) {
  const notes: string[] = [];
  
  if (colours.includes("PMS") || colours.includes("Pantone")) {
    notes.push("Exact PMS color match required");
    notes.push("Use color matching system");
  }
  
  if (decorationMethod === "screen_printing" && colours.includes("White")) {
    notes.push("High-opacity white base required");
  }
  
  return notes;
}

function createSpecialRequirements(orderDetail: any, decorationMethod: string) {
  const requirements: string[] = [];
  
  if (orderDetail.customerName.includes("Food") || orderDetail.customerName.includes("Restaurant") || orderDetail.customerName.includes("Bistro")) {
    requirements.push("Food-safe inks required");
    requirements.push("Commercial wash testing needed");
  }
  
  if (orderDetail.customerName.includes("Sports") || orderDetail.customerName.includes("Athletic")) {
    requirements.push("High-durability inks required");
    requirements.push("Moisture-wicking compatibility");
  }
  
  return requirements;
}

function createDetailedSizeBreakdown(products: any[], totalQuantity: number): { [productId: string]: { [size: string]: number } } {
  const breakdown: { [productId: string]: { [size: string]: number } } = {};
  
  products.forEach(product => {
    // Use actual size data if available, otherwise create realistic distribution
    if (product.sizes) {
      breakdown[product.id] = product.sizes;
    } else {
      breakdown[product.id] = {
        "XS": Math.floor(product.quantity * 0.05),
        "S": Math.floor(product.quantity * 0.15),
        "M": Math.floor(product.quantity * 0.30),
        "L": Math.floor(product.quantity * 0.30),
        "XL": Math.floor(product.quantity * 0.15),
        "XXL": Math.floor(product.quantity * 0.05)
      };
    }
  });
  
  return breakdown;
}

function createComprehensiveRoutingInstructions(groupIndex: number, sectionIndex: number, lineItemGroup: any, orderDetail: any, decorationMethod: string) {
  // Every screen printing job gets routing instructions
  if (decorationMethod !== "screen_printing") return undefined;
  
  const routingScenarios = [
    // Complex multi-stage production routing
    {
      id: `routing-${groupIndex}-${sectionIndex}-1`,
      type: "imprint_routing" as const,
      title: "Multi-Stage Production Routing",
      description: "Complex routing through multiple production stages with quality gates",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-1a`,
          destinationType: "next_imprint" as const,
          destinationId: "embroidery-station-1",
          destinationName: "Embroidery Station 1 - Left Chest Logo",
          criteria: {
            sizes: ["S", "M", "L"],
            quantities: { "S": 15, "M": 25, "L": 30 },
            conditions: "After print curing complete, min 24hr cure time"
          },
          instructions: "Route to embroidery for secondary decoration. Check print cure before handling. Use low-temp hooping to avoid print damage.",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-1b`,
          destinationType: "quality_check" as const,
          destinationName: "QC Station A - Print Quality",
          criteria: {
            sizes: ["XL", "XXL"],
            quantities: { "XL": 12, "XXL": 8 },
            conditions: "Large sizes require additional QC"
          },
          instructions: "Route larger sizes through enhanced QC process. Check for proper ink coverage on seams and pocket areas.",
          priority: 2
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-1c`,
          destinationType: "storage" as const,
          destinationName: "Curing Rack Section B",
          criteria: {
            sizes: ["XS"],
            quantities: { "XS": 5 },
            conditions: "Extended cure time needed"
          },
          instructions: "Small sizes need extended cure time due to garment thickness. Hold for 48 hours before next stage.",
          priority: 3
        }
      ]
    },
    // Regional distribution with customer-specific requirements
    {
      id: `routing-${groupIndex}-${sectionIndex}-2`,
      type: "shipping_routing" as const,
      title: "Multi-Location Distribution",
      description: "Route to different customer locations based on size and usage requirements",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-2a`,
          destinationType: "shipping_location" as const,
          destinationName: `${orderDetail.customerName} - Main Office`,
          criteria: {
            sizes: ["S", "M"],
            quantities: { "S": 20, "M": 35 },
            conditions: "Standard corporate sizes for office staff"
          },
          instructions: "Ship to main office location. Include size chart and care instructions. Use standard packaging with company branding.",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-2b`,
          destinationType: "shipping_location" as const,
          destinationName: `${orderDetail.customerName} - Warehouse Facility`,
          criteria: {
            sizes: ["L", "XL", "XXL"],
            quantities: { "L": 25, "XL": 15, "XXL": 10 },
            conditions: "Larger sizes for warehouse and field staff"
          },
          instructions: "Ship to warehouse facility. Include hang tags for inventory management. Pack in industrial-grade boxes.",
          priority: 2
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-2c`,
          destinationType: "shipping_location" as const,
          destinationName: `${orderDetail.customerName} - Trade Show Booth`,
          criteria: {
            sizes: ["M", "L"],
            quantities: { "M": 10, "L": 15 },
            conditions: "Display samples and giveaway items"
          },
          instructions: "Rush ship to trade show venue. Mark as 'HOLD FOR PICKUP' at venue loading dock. Include setup instructions.",
          priority: 3
        }
      ]
    },
    // Complex quality and finishing routing
    {
      id: `routing-${groupIndex}-${sectionIndex}-3`,
      type: "general_routing" as const,
      title: "Quality Assurance & Finishing",
      description: "Multi-step quality control and finishing process with conditional routing",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-3a`,
          destinationType: "quality_check" as const,
          destinationName: "Primary QC Station",
          criteria: {
            quantities: { "Sample": 5 },
            conditions: "Random sampling from each size run"
          },
          instructions: "Pull 5 random samples across all sizes. Perform wash test, ink adhesion test, and measurement verification. Document results.",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-3b`,
          destinationType: "finishing" as const,
          destinationName: "Finishing Station - Heat Press",
          criteria: {
            conditions: "Items requiring finishing touches"
          },
          instructions: "Apply heat press treatment to set inks. Check for any touch-ups needed. Apply hang tags and size labels.",
          priority: 2
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-3c`,
          destinationType: "storage" as const,
          destinationName: "Final Packaging Area",
          criteria: {
            conditions: "Items passed QC and finishing"
          },
          instructions: "Final packaging according to customer specifications. Include care cards and promotional materials. Prepare shipping labels.",
          priority: 3
        }
      ]
    },
    // Customer-specific routing with special handling
    {
      id: `routing-${groupIndex}-${sectionIndex}-4`,
      type: "imprint_routing" as const,
      title: "Custom Processing & Special Handling",
      description: "Specialized routing for custom requirements and special handling needs",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-4a`,
          destinationType: "custom_processing" as const,
          destinationName: "Special Finishing Department",
          criteria: {
            sizes: ["M", "L", "XL"],
            quantities: { "M": 20, "L": 25, "XL": 20 },
            conditions: "Items requiring special finishing"
          },
          instructions: "Apply special coating for stain resistance. Use food-grade materials for restaurant client. Test wash cycle compatibility.",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-4b`,
          destinationType: "individual_packaging" as const,
          destinationName: "Individual Pack Station",
          criteria: {
            sizes: ["S", "XS"],
            quantities: { "S": 15, "XS": 10 },
            conditions: "Individual packaging required"
          },
          instructions: "Package each item individually with size-specific hangers. Include individual care instruction cards. Barcode each package.",
          priority: 2
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-4c`,
          destinationType: "rush_shipping" as const,
          destinationName: "Express Shipping Dock",
          criteria: {
            conditions: orderDetail.isRush ? "Rush order priority" : "Standard processing"
          },
          instructions: orderDetail.isRush ? "RUSH ORDER - Process immediately for overnight shipping" : "Route to standard shipping queue",
          priority: orderDetail.isRush ? 1 : 3
        }
      ]
    },
    // Equipment and material routing
    {
      id: `routing-${groupIndex}-${sectionIndex}-5`,
      type: "general_routing" as const,
      title: "Equipment & Material Workflow",
      description: "Routing based on equipment availability and material requirements",
      splits: [
        {
          id: `split-${groupIndex}-${sectionIndex}-5a`,
          destinationType: "equipment_station" as const,
          destinationName: "Automatic Press Line A",
          criteria: {
            quantities: { "Bulk": 60 },
            conditions: "High volume items for automatic press"
          },
          instructions: "Route bulk quantity to automatic press for efficiency. Set up jigs for consistent placement. Monitor for equipment maintenance needs.",
          priority: 1
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-5b`,
          destinationType: "equipment_station" as const,
          destinationName: "Manual Press Station 3",
          criteria: {
            quantities: { "Specialty": 15 },
            conditions: "Items requiring manual handling"
          },
          instructions: "Route specialty items to manual press for precise control. Use experienced operator for complex placement requirements.",
          priority: 2
        },
        {
          id: `split-${groupIndex}-${sectionIndex}-5c`,
          destinationType: "maintenance_check" as const,
          destinationName: "Equipment Maintenance Bay",
          criteria: {
            conditions: "Equipment inspection and calibration"
          },
          instructions: "Route sample items through maintenance bay for equipment calibration verification. Document settings for production run.",
          priority: 3
        }
      ]
    }
  ];
  
  // Return multiple scenarios for comprehensive demo
  const numScenarios = Math.min(3, routingScenarios.length);
  const scenarios = [];
  
  for (let i = 0; i < numScenarios; i++) {
    const scenarioIndex = (groupIndex + sectionIndex + i) % routingScenarios.length;
    scenarios.push(routingScenarios[scenarioIndex]);
  }
  
  return scenarios;
}