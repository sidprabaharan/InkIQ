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
  onItemsScheduled?: (scheduledItems: any[]) => void;
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
  quoteItems = [],
  onItemsScheduled
}: ProductionSchedulingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, string | null>>({});
  const [isRushOrder, setIsRushOrder] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Helper function to get item quantity
  const getItemQuantity = (item: any): number => {
    if (item.sizes) {
      return Object.values(item.sizes).reduce((sum: number, qty: any) => {
        const quantity = typeof qty === 'number' ? qty : parseInt(String(qty) || "0");
        const validQuantity = isNaN(quantity) ? 0 : quantity;
        return sum + validQuantity;
      }, 0);
    }
    const itemQuantity = parseInt(String(item.quantity || "0"));
    return isNaN(itemQuantity) ? 0 : itemQuantity;
  };

  // Helper function to determine decoration method
  const getDecorationMethod = (item: any) => {
    if (item.category?.toLowerCase().includes("embroid")) return "embroidery";
    if (item.description?.toLowerCase().includes("embroid")) return "embroidery";
    const quantity = getItemQuantity(item);
    return quantity > 50 ? "screen_printing" : "screen_printing";
  };

  // Analyze individual items
  const analyzeItems = () => {
    return quoteItems.map(item => {
      const quantity = getItemQuantity(item);
      const decorationMethod = getDecorationMethod(item);
      
      const recommendedEquipment = mockEquipment.filter(eq => {
        const matchesMethod = 
          (decorationMethod === "embroidery" && eq.type === "embroidery") ||
          (decorationMethod === "screen_printing" && eq.type === "screen_printing");
        
        const matchesCapacity = quantity >= eq.minQuantity && quantity <= eq.maxQuantity;
        return matchesMethod && matchesCapacity && eq.status === "available";
      });

      const conflicts: SchedulingConflict[] = [];
      
      if (recommendedEquipment.length === 0) {
        conflicts.push({
          type: "equipment_unavailable",
          description: `No suitable equipment for ${quantity} units with ${decorationMethod}`,
          severity: "high",
          suggestedActions: ["Split into smaller batches", "Use alternative equipment", "Schedule for later"]
        });
      }

      return {
        item,
        quantity,
        decorationMethod,
        recommendedEquipment,
        conflicts,
        estimatedDuration: Math.ceil(quantity * (decorationMethod === "embroidery" ? 2 : 0.5) + 30), // minutes
        priority: isRushOrder ? "rush" as const : quantity > 1000 ? "high" as const : "medium" as const
      };
    });
  };

  const itemAnalyses = analyzeItems();
  const totalQuantity = itemAnalyses.reduce((sum, analysis) => sum + analysis.quantity, 0);
  const allConflicts = itemAnalyses.flatMap(analysis => analysis.conflicts);

  const handleScheduleProduction = () => {
    const itemsToSchedule = itemAnalyses.filter(analysis => 
      selectedItems.has(analysis.item.id)
    );

    if (itemsToSchedule.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to schedule for production",
        variant: "destructive"
      });
      return;
    }

    // Check if all selected items have equipment assigned
    const unassignedItems = itemsToSchedule.filter(analysis => 
      !selectedEquipment[analysis.item.id]
    );

    if (unassignedItems.length > 0) {
      toast({
        title: "Equipment Not Selected",
        description: "Please select equipment for all selected items",
        variant: "destructive"
      });
      return;
    }

    // Create production jobs for selected items
    const scheduledJobs = itemsToSchedule.map(analysis => ({
      id: `job-${analysis.item.id}-${Date.now()}`,
      quoteId,
      quoteName: `Quote #${quoteId}`,
      itemId: analysis.item.id,
      itemName: analysis.item.description,
      description: `${analysis.item.description} - ${analysis.item.color}`,
      quantity: analysis.quantity,
      decorationMethod: analysis.decorationMethod,
      dueDate: new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from selected date
      priority: analysis.priority,
      assignedEquipmentId: selectedEquipment[analysis.item.id],
      status: "scheduled" as const,
      estimatedDuration: analysis.estimatedDuration,
      scheduledStartTime: selectedDate,
      scheduledEndTime: new Date(selectedDate.getTime() + analysis.estimatedDuration * 60 * 1000),
      artworkCompleted: true,
      setupRequired: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Save to localStorage
    const existingJobs = JSON.parse(localStorage.getItem('productionJobs') || '[]');
    const allJobs = [...existingJobs, ...scheduledJobs];
    localStorage.setItem('productionJobs', JSON.stringify(allJobs));

    // Notify parent component
    if (onItemsScheduled) {
      onItemsScheduled(itemsToSchedule.map(analysis => ({
        ...analysis.item,
        productionStatus: 'scheduled'
      })));
    }

    toast({
      title: "Production Scheduled",
      description: `${itemsToSchedule.length} items scheduled for ${selectedDate.toLocaleDateString()}`,
    });

    onOpenChange(false);
  };

  const handleItemSelection = (itemId: string, selected: boolean) => {
    const newSelection = new Set(selectedItems);
    if (selected) {
      newSelection.add(itemId);
    } else {
      newSelection.delete(itemId);
      // Remove equipment selection for unselected items
      const newEquipment = { ...selectedEquipment };
      delete newEquipment[itemId];
      setSelectedEquipment(newEquipment);
    }
    setSelectedItems(newSelection);
  };

  const handleEquipmentSelection = (itemId: string, equipmentId: string) => {
    setSelectedEquipment(prev => ({
      ...prev,
      [itemId]: equipmentId
    }));
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
          {/* Individual Items Analysis */}
          <div className="col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Items to Schedule ({quoteItems.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Quantity</div>
                    <div className="text-2xl font-bold">{totalQuantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Selected Items</div>
                    <div className="text-2xl font-bold">{selectedItems.size}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Rush Order</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="rushOrder"
                        checked={isRushOrder}
                        onChange={(e) => setIsRushOrder(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="rushOrder" className="text-sm font-medium">
                        Priority scheduling
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Schedule Individual Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {itemAnalyses.map((analysis, index) => (
                  <Card key={analysis.item.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(analysis.item.id)}
                          onChange={(e) => handleItemSelection(analysis.item.id, e.target.checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium">{analysis.item.description}</div>
                              <div className="text-sm text-muted-foreground">
                                {analysis.item.category} • {analysis.item.color} • Qty: {analysis.quantity}
                              </div>
                              <Badge variant="secondary" className="mt-1">
                                {analysis.decorationMethod}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Est. Duration</div>
                              <div className="font-medium">{analysis.estimatedDuration} min</div>
                            </div>
                          </div>

                          {selectedItems.has(analysis.item.id) && (
                            <div className="space-y-3 border-t pt-3">
                              <div className="text-sm font-medium">Select Equipment:</div>
                              {analysis.recommendedEquipment.length === 0 ? (
                                <Alert>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    No suitable equipment found for this item
                                  </AlertDescription>
                                </Alert>
                              ) : (
                                <div className="grid grid-cols-1 gap-2">
                                  {analysis.recommendedEquipment.map((equipment) => (
                                    <div
                                      key={equipment.id}
                                      className={`p-2 border rounded cursor-pointer transition-colors ${
                                        selectedEquipment[analysis.item.id] === equipment.id
                                          ? "border-primary bg-primary/5"
                                          : "hover:border-primary/50"
                                      }`}
                                      onClick={() => handleEquipmentSelection(analysis.item.id, equipment.id)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {getEquipmentIcon(equipment.type)}
                                          <div>
                                            <div className="font-medium text-sm">{equipment.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                              Load: {equipment.currentLoad}%
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {equipment.minQuantity}-{equipment.maxQuantity} items
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {analysis.conflicts.length > 0 && (
                                <div className="space-y-2">
                                  {analysis.conflicts.map((conflict, conflictIndex) => (
                                    <Alert key={conflictIndex} variant="destructive">
                                      <AlertTriangle className="h-4 w-4" />
                                      <AlertDescription className="text-sm">
                                        {conflict.description}
                                      </AlertDescription>
                                    </Alert>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Global Conflicts */}
            {allConflicts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Scheduling Conflicts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {allConflicts.map((conflict, index) => (
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
                    <span>Start Date:</span>
                    <span className="font-medium">
                      {selectedDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Selected Items:</span>
                    <span className="font-medium">
                      {selectedItems.size} of {quoteItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rush Priority:</span>
                    <span className="font-medium">
                      {isRushOrder ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleScheduleProduction}
                disabled={selectedItems.size === 0}
                className="w-full"
              >
                Schedule Selected Items ({selectedItems.size})
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