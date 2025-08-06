import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Target,
  Gauge
} from "lucide-react";
import { ProductionEquipment, ProductionJob, JobAnalysis } from "@/types/equipment";
import { getStoredProductionJobs } from "@/utils/productionJobUtils";
import { format, differenceInDays } from "date-fns";

interface JobRecommendation {
  job: ProductionJob;
  analysis: JobAnalysis;
  score: number;
}

interface EquipmentRecommendation {
  equipment: ProductionEquipment;
  suitabilityScore: number;
  reasons: string[];
  estimatedDuration: number;
  conflicts: string[];
}

// Enhanced equipment data for routing
const productionEquipment: ProductionEquipment[] = [
  {
    id: "emb-brother-1050x",
    name: "Brother PR-1050X",
    type: "embroidery",
    heads: 10,
    maxColors: 15,
    minQuantity: 1,
    maxQuantity: 1000,
    capacity: 480,
    currentLoad: 65,
    status: "available",
    setupTime: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "emb-brother-670e",
    name: "Brother PR-670E",
    type: "embroidery", 
    heads: 6,
    maxColors: 10,
    minQuantity: 1,
    maxQuantity: 500,
    capacity: 320,
    currentLoad: 40,
    status: "available",
    setupTime: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "screen-mr-sportsman",
    name: "M&R Sportsman EX",
    type: "screen_printing",
    screens: 8,
    isAutomatic: true,
    minQuantity: 50,
    maxQuantity: 5000,
    capacity: 1200,
    currentLoad: 80,
    status: "busy",
    setupTime: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "screen-manual-6color",
    name: "Manual 6-Color Press",
    type: "screen_printing",
    screens: 6,
    isAutomatic: false,
    minQuantity: 1,
    maxQuantity: 200,
    capacity: 400,
    currentLoad: 25,
    status: "available",
    setupTime: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "screen-mr-gauntlet",
    name: "M&R Gauntlet III",
    type: "screen_printing",
    screens: 12,
    isAutomatic: true,
    minQuantity: 100,
    maxQuantity: 10000,
    capacity: 2000,
    currentLoad: 45,
    status: "available",
    setupTime: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function SmartJobRouter() {
  const [productionJobs] = useState<ProductionJob[]>(getStoredProductionJobs());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Intelligent equipment recommendation algorithm
  const getEquipmentRecommendations = (job: ProductionJob): EquipmentRecommendation[] => {
    const compatibleEquipment = productionEquipment.filter(equipment => {
      // Check decoration method compatibility
      if (job.decorationMethod === "embroidery" && equipment.type !== "embroidery") return false;
      if (job.decorationMethod === "screen_printing" && equipment.type !== "screen_printing") return false;
      
      // Check quantity constraints
      if (job.quantity < equipment.minQuantity || job.quantity > equipment.maxQuantity) return false;
      
      return true;
    });

    return compatibleEquipment.map(equipment => {
      let score = 0;
      const reasons: string[] = [];
      const conflicts: string[] = [];

      // Base compatibility score
      score += 30;
      reasons.push("Compatible decoration method");

      // Quantity optimization
      const quantityRatio = job.quantity / equipment.capacity;
      if (quantityRatio >= 0.7 && quantityRatio <= 1.0) {
        score += 25;
        reasons.push("Optimal quantity for equipment capacity");
      } else if (quantityRatio >= 0.3 && quantityRatio < 0.7) {
        score += 15;
        reasons.push("Good quantity match");
      } else if (quantityRatio < 0.3) {
        score += 5;
        reasons.push("Small job - may be inefficient");
      }

      // Current load consideration
      if (equipment.currentLoad < 50) {
        score += 20;
        reasons.push("Low current workload");
      } else if (equipment.currentLoad < 80) {
        score += 10;
        reasons.push("Moderate workload");
      } else {
        score -= 10;
        conflicts.push("High current workload");
      }

      // Equipment status
      if (equipment.status === "available") {
        score += 15;
        reasons.push("Immediately available");
      } else if (equipment.status === "busy") {
        score -= 15;
        conflicts.push("Currently busy");
      } else {
        score -= 30;
        conflicts.push(`Equipment ${equipment.status}`);
      }

      // Setup time consideration
      if (equipment.setupTime <= 30) {
        score += 10;
        reasons.push("Quick setup time");
      } else if (equipment.setupTime <= 60) {
        score += 5;
      } else {
        score -= 5;
        conflicts.push("Long setup time required");
      }

      // Priority consideration
      if (job.priority === "rush" || job.priority === "high") {
        if (equipment.status === "available" && equipment.currentLoad < 70) {
          score += 15;
          reasons.push("Available for rush job");
        }
      }

      // Due date urgency
      const daysUntilDue = differenceInDays(job.dueDate, new Date());
      if (daysUntilDue <= 1) {
        if (equipment.status === "available") {
          score += 20;
          reasons.push("Available for urgent deadline");
        } else {
          conflicts.push("May not meet urgent deadline");
        }
      }

      // Efficiency calculation
      let efficiency = 1.0;
      if (equipment.type === "embroidery") {
        const embroidery = equipment as any;
        efficiency = Math.min(job.quantity / embroidery.heads, embroidery.capacity) / embroidery.capacity;
      } else if (equipment.type === "screen_printing") {
        const screenPrint = equipment as any;
        efficiency = job.quantity / equipment.capacity;
        if (screenPrint.isAutomatic && job.quantity >= 100) {
          score += 10;
          reasons.push("Automatic press suitable for large quantity");
        }
      }

      const estimatedDuration = Math.ceil((job.quantity / equipment.capacity) * 8 * 60) + equipment.setupTime;

      return {
        equipment,
        suitabilityScore: Math.max(0, Math.min(100, score)),
        reasons,
        estimatedDuration,
        conflicts
      };
    }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  };

  // Get job analysis with smart routing
  const jobAnalyses = useMemo((): JobRecommendation[] => {
    const unassignedJobs = productionJobs.filter(job => !job.assignedEquipmentId);
    
    return unassignedJobs.map(job => {
      const recommendations = getEquipmentRecommendations(job);
      const daysUntilDue = differenceInDays(job.dueDate, new Date());
      
      // Calculate urgency score
      let urgencyScore = 0;
      if (daysUntilDue <= 0) urgencyScore = 100;
      else if (daysUntilDue <= 1) urgencyScore = 90;
      else if (daysUntilDue <= 2) urgencyScore = 70;
      else if (daysUntilDue <= 7) urgencyScore = 50;
      else urgencyScore = 20;

      // Boost for priority
      if (job.priority === "rush") urgencyScore = Math.min(100, urgencyScore + 30);
      else if (job.priority === "high") urgencyScore = Math.min(100, urgencyScore + 15);

      const analysis: JobAnalysis = {
        jobId: job.id,
        recommendedEquipment: recommendations.slice(0, 3).map(r => r.equipment),
        conflicts: recommendations[0]?.conflicts.map(conflict => ({
          type: "equipment_unavailable",
          description: conflict,
          severity: "medium" as const,
          suggestedActions: ["Consider alternative equipment", "Adjust schedule"]
        })) || [],
        estimatedCompletion: new Date(Date.now() + (recommendations[0]?.estimatedDuration || 480) * 60000),
        urgencyScore
      };

      return {
        job,
        analysis,
        score: urgencyScore + (recommendations[0]?.suitabilityScore || 0) / 2
      };
    }).sort((a, b) => b.score - a.score);
  }, [productionJobs]);

  // Get the selected job's recommendations
  const selectedJobRecommendations = selectedJobId 
    ? getEquipmentRecommendations(jobAnalyses.find(ja => ja.job.id === selectedJobId)?.job!)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Smart Job Router</h2>
          <p className="text-sm text-muted-foreground">
            AI-powered production routing and equipment recommendations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Jobs Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Routing Queue
              <Badge variant="outline">{jobAnalyses.length} pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobAnalyses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>All jobs are assigned to equipment</p>
              </div>
            ) : (
              jobAnalyses.map((jobRec) => (
                <div
                  key={jobRec.job.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedJobId === jobRec.job.id 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setSelectedJobId(jobRec.job.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{jobRec.job.itemName}</div>
                      <div className="text-xs text-muted-foreground">
                        {jobRec.job.quantity} units • {jobRec.job.decorationMethod.replace("_", " ")}
                      </div>
                      <div className="text-xs">
                        Due: {format(jobRec.job.dueDate, "MMM d, yyyy")}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <Badge 
                        variant={
                          jobRec.analysis.urgencyScore >= 90 ? "destructive" :
                          jobRec.analysis.urgencyScore >= 70 ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {jobRec.analysis.urgencyScore}% urgent
                      </Badge>
                      
                      {jobRec.analysis.conflicts.length > 0 && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">{jobRec.analysis.conflicts.length} issues</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Equipment Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Equipment Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedJobId ? (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2" />
                <p>Select a job to see equipment recommendations</p>
              </div>
            ) : selectedJobRecommendations.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No compatible equipment found for this job. Check decoration method and quantity constraints.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {selectedJobRecommendations.map((rec, index) => (
                  <div
                    key={rec.equipment.id}
                    className={`p-4 border rounded-lg ${
                      index === 0 ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium">{rec.equipment.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rec.equipment.type.replace("_", " ")} • {rec.equipment.status}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          variant={
                            rec.suitabilityScore >= 80 ? "default" :
                            rec.suitabilityScore >= 60 ? "secondary" : "outline"
                          }
                          className="mb-1"
                        >
                          {rec.suitabilityScore}% match
                        </Badge>
                        {index === 0 && (
                          <div className="text-xs text-green-600 font-medium">
                            Best Match
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Suitability Score</span>
                        <span>{rec.suitabilityScore}/100</span>
                      </div>
                      <Progress value={rec.suitabilityScore} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Est. Duration:</span>
                          <div className="font-medium">{Math.floor(rec.estimatedDuration / 60)}h {rec.estimatedDuration % 60}m</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current Load:</span>
                          <div className="font-medium">{rec.equipment.currentLoad}%</div>
                        </div>
                      </div>

                      {rec.reasons.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-green-600">Advantages:</div>
                          <ul className="text-xs space-y-0.5">
                            {rec.reasons.slice(0, 3).map((reason, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.conflicts.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-yellow-600">Considerations:</div>
                          <ul className="text-xs space-y-0.5">
                            {rec.conflicts.slice(0, 2).map((conflict, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                {conflict}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        variant={index === 0 ? "default" : "outline"}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Assign & Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Production Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Production Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{jobAnalyses.length}</div>
              <div className="text-sm text-muted-foreground">Jobs in Queue</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {jobAnalyses.filter(ja => ja.analysis.urgencyScore >= 70).length}
              </div>
              <div className="text-sm text-muted-foreground">Urgent Jobs</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {productionEquipment.filter(eq => eq.status === "available").length}
              </div>
              <div className="text-sm text-muted-foreground">Available Equipment</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}