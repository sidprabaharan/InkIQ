import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Workflow, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Target
} from "lucide-react";
import { ProductionJob } from "@/types/equipment";
import { getStoredProductionJobs, updateProductionJob } from "@/utils/productionJobUtils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ProductionStage {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedDuration: number; // minutes
  dependencies: string[];
  quality_checks: boolean;
}

interface StageProgress {
  stageId: string;
  status: "not_started" | "in_progress" | "completed" | "blocked" | "on_hold";
  startedAt?: Date;
  completedAt?: Date;
  assignedTo?: string;
  notes?: string;
  qualityCheckPassed?: boolean;
}

// Enhanced production workflow stages
const productionStages: ProductionStage[] = [
  {
    id: "artwork_approval",
    name: "Artwork Approval",
    description: "Customer artwork review and approval",
    color: "#3b82f6",
    icon: CheckCircle,
    estimatedDuration: 30,
    dependencies: [],
    quality_checks: false
  },
  {
    id: "file_preparation", 
    name: "File Preparation",
    description: "Convert artwork to production files",
    color: "#8b5cf6",
    icon: Settings,
    estimatedDuration: 60,
    dependencies: ["artwork_approval"],
    quality_checks: true
  },
  {
    id: "material_procurement",
    name: "Material Procurement", 
    description: "Source and prepare garments/materials",
    color: "#10b981",
    icon: Target,
    estimatedDuration: 120,
    dependencies: ["artwork_approval"],
    quality_checks: false
  },
  {
    id: "setup_preparation",
    name: "Setup & Preparation",
    description: "Equipment setup and testing",
    color: "#f59e0b",
    icon: Settings,
    estimatedDuration: 45,
    dependencies: ["file_preparation", "material_procurement"],
    quality_checks: true
  },
  {
    id: "production",
    name: "Production",
    description: "Actual printing/embroidery process", 
    color: "#ef4444",
    icon: Play,
    estimatedDuration: 240,
    dependencies: ["setup_preparation"],
    quality_checks: true
  },
  {
    id: "quality_control",
    name: "Quality Control",
    description: "Inspection and quality verification",
    color: "#6366f1",
    icon: CheckCircle,
    estimatedDuration: 30,
    dependencies: ["production"],
    quality_checks: true
  },
  {
    id: "finishing", 
    name: "Finishing & Packaging",
    description: "Final touches and packaging",
    color: "#ec4899",
    icon: Target,
    estimatedDuration: 60,
    dependencies: ["quality_control"],
    quality_checks: false
  },
  {
    id: "shipping_prep",
    name: "Shipping Preparation",
    description: "Pack and label for shipment",
    color: "#06b6d4",
    icon: CheckCircle,
    estimatedDuration: 30,
    dependencies: ["finishing"],
    quality_checks: false
  }
];

interface EnhancedProductionJob extends ProductionJob {
  stageProgress: StageProgress[];
  currentStage: string;
  overallProgress: number;
  blockers: string[];
  assignedOperators: string[];
}

export function ProductionFlowManager() {
  const [productionJobs, setProductionJobs] = useState<ProductionJob[]>(getStoredProductionJobs());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Convert production jobs to enhanced format with stage tracking
  const enhancedJobs = useMemo((): EnhancedProductionJob[] => {
    return productionJobs.map(job => {
      // Initialize stage progress if not exists
      const stageProgress: StageProgress[] = productionStages.map(stage => ({
        stageId: stage.id,
        status: stage.id === "artwork_approval" ? "in_progress" : "not_started",
        startedAt: stage.id === "artwork_approval" ? new Date() : undefined
      }));

      // Determine current stage
      const currentStageIndex = stageProgress.findIndex(sp => sp.status === "in_progress" || sp.status === "not_started");
      const currentStage = currentStageIndex >= 0 ? productionStages[currentStageIndex].id : "completed";

      // Calculate overall progress
      const completedStages = stageProgress.filter(sp => sp.status === "completed").length;
      const overallProgress = (completedStages / productionStages.length) * 100;

      return {
        ...job,
        stageProgress,
        currentStage,
        overallProgress,
        blockers: [],
        assignedOperators: ["Operator A", "Operator B"] // Mock data
      };
    });
  }, [productionJobs]);

  // Get jobs by status for different views
  const jobsByStatus = useMemo(() => {
    return {
      active: enhancedJobs.filter(job => job.overallProgress > 0 && job.overallProgress < 100),
      pending: enhancedJobs.filter(job => job.overallProgress === 0),
      completed: enhancedJobs.filter(job => job.overallProgress === 100),
      blocked: enhancedJobs.filter(job => job.blockers.length > 0)
    };
  }, [enhancedJobs]);

  // Stage statistics
  const stageStats = useMemo(() => {
    return productionStages.map(stage => {
      const jobsInStage = enhancedJobs.filter(job => job.currentStage === stage.id);
      const avgTimeInStage = jobsInStage.length > 0 ? stage.estimatedDuration : 0;
      
      return {
        stage,
        jobCount: jobsInStage.length,
        avgDuration: avgTimeInStage,
        capacity: Math.max(1, Math.floor(jobsInStage.length * 1.2)) // Mock capacity calculation
      };
    });
  }, [enhancedJobs]);

  const handleStageUpdate = (jobId: string, stageId: string, newStatus: StageProgress["status"]) => {
    const job = enhancedJobs.find(j => j.id === jobId);
    if (!job) return;

    // Update stage progress logic here
    toast({
      title: "Stage Updated",
      description: `${job.itemName} stage "${productionStages.find(s => s.id === stageId)?.name}" updated to ${newStatus}`
    });
  };

  const selectedJob = selectedJobId ? enhancedJobs.find(job => job.id === selectedJobId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Workflow className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Production Flow Manager</h2>
          <p className="text-sm text-muted-foreground">
            End-to-end production workflow tracking and optimization
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow View</TabsTrigger>
          <TabsTrigger value="stages">Stage Analysis</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{jobsByStatus.active.length}</div>
                    <div className="text-sm text-muted-foreground">Active Jobs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Pause className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{jobsByStatus.pending.length}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{jobsByStatus.completed.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{jobsByStatus.blocked.length}</div>
                    <div className="text-sm text-muted-foreground">Blocked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Jobs List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Production Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobsByStatus.active.map((job) => (
                  <div 
                    key={job.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedJobId === job.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium">{job.itemName}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.quantity} units • Due: {format(job.dueDate, "MMM d")}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          style={{ backgroundColor: productionStages.find(s => s.id === job.currentStage)?.color }}
                          className="text-white mb-1"
                        >
                          {productionStages.find(s => s.id === job.currentStage)?.name}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {job.overallProgress.toFixed(0)}% complete
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{job.overallProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={job.overallProgress} className="h-2" />
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Assigned: {job.assignedOperators.join(", ")}</span>
                        <span>{job.priority} priority</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          {selectedJob ? (
            <JobWorkflowView job={selectedJob} onStageUpdate={handleStageUpdate} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Workflow className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Select a Job</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a job from the overview to view its detailed workflow
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          <StageAnalysisView stageStats={stageStats} />
        </TabsContent>

        <TabsContent value="bottlenecks" className="space-y-6">
          <BottleneckAnalysisView enhancedJobs={enhancedJobs} stageStats={stageStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Individual job workflow visualization
function JobWorkflowView({ 
  job, 
  onStageUpdate 
}: { 
  job: EnhancedProductionJob;
  onStageUpdate: (jobId: string, stageId: string, status: StageProgress["status"]) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{job.itemName} Workflow</span>
          <Badge variant="outline">{job.overallProgress.toFixed(0)}% Complete</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{job.overallProgress.toFixed(0)}%</span>
            </div>
            <Progress value={job.overallProgress} className="h-3" />
          </div>

          {/* Workflow Stages */}
          <div className="space-y-4">
            {productionStages.map((stage, index) => {
              const stageProgress = job.stageProgress.find(sp => sp.stageId === stage.id);
              const isCompleted = stageProgress?.status === "completed";
              const isActive = stageProgress?.status === "in_progress";
              const isBlocked = stageProgress?.status === "blocked";
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="relative">
                  {/* Connection Line */}
                  {index < productionStages.length - 1 && (
                    <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                      isCompleted ? "bg-green-500" : "bg-muted"
                    }`} />
                  )}
                  
                  <div className={`flex items-start gap-4 p-4 rounded-lg border ${
                    isActive ? "border-primary bg-primary/5" :
                    isCompleted ? "border-green-500 bg-green-50 dark:bg-green-950/20" :
                    isBlocked ? "border-red-500 bg-red-50 dark:bg-red-950/20" :
                    "border-muted"
                  }`}>
                    <div className={`p-2 rounded-full ${
                      isCompleted ? "bg-green-500 text-white" :
                      isActive ? "bg-primary text-primary-foreground" :
                      isBlocked ? "bg-red-500 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{stage.name}</div>
                          <div className="text-sm text-muted-foreground">{stage.description}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              isCompleted ? "default" :
                              isActive ? "default" :
                              isBlocked ? "destructive" : "secondary"
                            }
                          >
                            {stageProgress?.status?.replace("_", " ")}
                          </Badge>
                          
                          <div className="text-sm text-muted-foreground">
                            {stage.estimatedDuration}min
                          </div>
                        </div>
                      </div>

                      {stageProgress?.startedAt && (
                        <div className="text-xs text-muted-foreground">
                          Started: {format(stageProgress.startedAt, "MMM d, HH:mm")}
                          {stageProgress.completedAt && (
                            <span> • Completed: {format(stageProgress.completedAt, "MMM d, HH:mm")}</span>
                          )}
                        </div>
                      )}

                      {stageProgress?.notes && (
                        <div className="text-sm mt-2 p-2 bg-muted rounded">
                          {stageProgress.notes}
                        </div>
                      )}

                      {/* Stage Actions */}
                      {isActive && (
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => onStageUpdate(job.id, stage.id, "completed")}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onStageUpdate(job.id, stage.id, "on_hold")}
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Hold
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stage analysis view
function StageAnalysisView({ stageStats }: { stageStats: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {stageStats.map((stat) => (
        <Card key={stat.stage.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <stat.stage.icon className="h-5 w-5" style={{ color: stat.stage.color }} />
              {stat.stage.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stat.jobCount}</div>
                <div className="text-xs text-muted-foreground">Jobs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.avgDuration}m</div>
                <div className="text-xs text-muted-foreground">Avg Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.capacity}</div>
                <div className="text-xs text-muted-foreground">Capacity</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilization</span>
                <span>{Math.min(100, (stat.jobCount / stat.capacity) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(100, (stat.jobCount / stat.capacity) * 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Bottleneck analysis
function BottleneckAnalysisView({ 
  enhancedJobs, 
  stageStats 
}: { 
  enhancedJobs: EnhancedProductionJob[];
  stageStats: any[];
}) {
  const bottlenecks = stageStats
    .filter(stat => stat.jobCount / stat.capacity > 0.8)
    .sort((a, b) => (b.jobCount / b.capacity) - (a.jobCount / a.capacity));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Production Bottlenecks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bottlenecks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-medium mb-2">No Bottlenecks Detected</h3>
              <p className="text-sm text-muted-foreground">
                All production stages are operating within capacity
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bottlenecks.map((bottleneck) => (
                <div key={bottleneck.stage.id} className="p-4 border rounded-lg border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{bottleneck.stage.name}</h4>
                    <Badge variant="destructive">
                      {((bottleneck.jobCount / bottleneck.capacity) * 100).toFixed(0)}% Over Capacity
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {bottleneck.stage.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Jobs:</span>
                      <div className="font-medium">{bottleneck.jobCount}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <div className="font-medium">{bottleneck.capacity}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Overflow:</span>
                      <div className="font-medium text-red-600">
                        +{bottleneck.jobCount - bottleneck.capacity}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-background rounded border">
                    <div className="text-sm font-medium mb-2">Suggested Actions:</div>
                    <ul className="text-sm space-y-1">
                      <li>• Add additional operators to this stage</li>
                      <li>• Consider outsourcing overflow work</li>
                      <li>• Implement overtime shifts</li>
                      <li>• Review and optimize stage processes</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}