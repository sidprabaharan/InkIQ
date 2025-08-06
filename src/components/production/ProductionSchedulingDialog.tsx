import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Clock, AlertTriangle, CheckCircle, Zap, Printer, Package, TrendingUp } from "lucide-react";
import { ProductionEquipment, JobAnalysis, SchedulingConflict } from "@/types/equipment";
import { useToast } from "@/hooks/use-toast";

interface ProductionSchedulingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  quoteItems: any[];
}

// Mock equipment data - in real app this would come from context/API
const mockEquipment: ProductionEquipment[] = [
  {
    id: "emb-001",
    name: "Brother PR-1050X (Multi-Head)",
    type: "embroidery",
    heads: 10,
    maxColors: 15,
    minQuantity: 50,
    maxQuantity: 5000,
    capacity: 500,
    currentLoad: 65,
    status: "available",
    setupTime: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-001",
    name: "M&R Sportsman (Automatic)",
    type: "screen_printing",
    screens: 8,
    isAutomatic: true,
    minQuantity: 100,
    maxQuantity: 10000,
    capacity: 1200,
    currentLoad: 45,
    status: "available",
    setupTime: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sp-002",
    name: "Workhorse Manual Press",
    type: "screen_printing",
    screens: 4,
    isAutomatic: false,
    minQuantity: 1,
    maxQuantity: 100,
    capacity: 200,
    currentLoad: 70,
    status: "available",
    setupTime: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function ProductionSchedulingDialog({ 
  open, 
  onOpenChange, 
  quoteId, 
  quoteItems = [] 
}: ProductionSchedulingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isRushOrder, setIsRushOrder] = useState(false);
  const { toast } = useToast();

  // Mock job analysis - in real app this would be calculated
  const analyzeJob = () => {
    const totalQuantity = quoteItems.reduce((sum, item) => sum + parseInt(item.quantity || "0"), 0);
    const decorationMethods = quoteItems.map(item => {
      // Simple decoration method detection based on item properties
      if (item.category?.toLowerCase().includes("embroid")) return "embroidery";
      if (item.color && totalQuantity > 100) return "screen_printing";
      return "screen_printing"; // default
    });

    const recommendedEquipment = mockEquipment.filter(eq => {
      const matchesMethod = decorationMethods.some(method => {
        if (method === "embroidery" && eq.type === "embroidery") return true;
        if (method === "screen_printing" && eq.type === "screen_printing") return true;
        return false;
      });
      
      const matchesCapacity = totalQuantity >= eq.minQuantity && totalQuantity <= eq.maxQuantity;
      return matchesMethod && matchesCapacity && eq.status === "available";
    });

    const conflicts: SchedulingConflict[] = [];
    
    if (recommendedEquipment.length === 0) {
      conflicts.push({
        type: "equipment_unavailable",
        description: "No suitable equipment available for this job quantity and decoration method",
        severity: "high",
        suggestedActions: ["Split the job into smaller batches", "Use multiple machines", "Schedule for later date"]
      });
    }

    if (isRushOrder) {
      conflicts.push({
        type: "due_date_risk",
        description: "Rush order may conflict with existing production schedule",
        severity: "medium",
        suggestedActions: ["Extend operating hours", "Prioritize over non-rush jobs", "Consider outsourcing"]
      });
    }

    return {
      totalQuantity,
      decorationMethods,
      recommendedEquipment,
      conflicts,
      estimatedCompletion: new Date(Date.now() + (isRushOrder ? 3 : 7) * 24 * 60 * 60 * 1000),
      urgencyScore: isRushOrder ? 90 : totalQuantity > 1000 ? 70 : 40
    };
  };

  const analysis = analyzeJob();

  const handleScheduleProduction = () => {
    const equipment = selectedEquipment 
      ? analysis.recommendedEquipment.find(eq => eq.id === selectedEquipment)
      : analysis.recommendedEquipment[0];

    if (!equipment) {
      toast({
        title: "No Equipment Selected",
        description: "Please select equipment for production scheduling",
        variant: "destructive"
      });
      return;
    }

    // Mock scheduling logic
    toast({
      title: "Production Scheduled",
      description: `Job scheduled on ${equipment.name} for ${selectedDate.toLocaleDateString()}`,
    });

    onOpenChange(false);
  };

  const getConflictColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "embroidery": return <Zap className="h-4 w-4" />;
      case "screen_printing": return <Printer className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Production - Quote #{quoteId}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Job Analysis */}
          <div className="col-span-2 space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Job Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Quantity</div>
                    <div className="text-2xl font-bold">{analysis.totalQuantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Decoration Methods</div>
                    <div className="flex gap-2 mt-1">
                      {analysis.decorationMethods.map((method, index) => (
                        <Badge key={index} variant="secondary">{method}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Urgency Score</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{analysis.urgencyScore}%</div>
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rushOrder"
                    checked={isRushOrder}
                    onChange={(e) => setIsRushOrder(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="rushOrder" className="text-sm font-medium">
                    Mark as Rush Order (Priority scheduling)
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recommended Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.recommendedEquipment.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No suitable equipment found for current job requirements. Check conflicts below.
                    </AlertDescription>
                  </Alert>
                ) : (
                  analysis.recommendedEquipment.map((equipment) => (
                    <Card 
                      key={equipment.id}
                      className={`cursor-pointer transition-colors ${
                        selectedEquipment === equipment.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedEquipment(equipment.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getEquipmentIcon(equipment.type)}
                            <div>
                              <div className="font-medium">{equipment.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {equipment.type === "embroidery" 
                                  ? `${equipment.heads} heads, ${equipment.maxColors} colors`
                                  : `${equipment.screens} screens, ${equipment.isAutomatic ? 'Auto' : 'Manual'}`
                                }
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Capacity Range</div>
                            <div className="font-medium">
                              {equipment.minQuantity} - {equipment.maxQuantity}
                            </div>
                            <Badge variant={equipment.currentLoad > 75 ? "default" : "secondary"} className="mt-1">
                              {equipment.currentLoad}% Load
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Conflicts & Warnings */}
            {analysis.conflicts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Conflicts & Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.conflicts.map((conflict, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium">{conflict.description}</div>
                          <Badge variant={getConflictColor(conflict.severity)}>
                            {conflict.severity}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <strong>Suggested Actions:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {conflict.suggestedActions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Schedule Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Schedule Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Completion:</span>
                    <span className="font-medium">
                      {analysis.estimatedCompletion.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Selected Equipment:</span>
                    <span className="font-medium">
                      {selectedEquipment 
                        ? analysis.recommendedEquipment.find(eq => eq.id === selectedEquipment)?.name.split(' ')[0] || 'None'
                        : 'Auto-select'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleScheduleProduction}
                disabled={analysis.recommendedEquipment.length === 0}
                className="w-full"
              >
                Schedule Production
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}