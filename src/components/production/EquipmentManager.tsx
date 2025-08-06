import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Plus, Edit2, Trash2, Activity, Zap, Printer } from "lucide-react";
import { ProductionEquipment, EmbroideryMachine, ScreenPrintingPress } from "@/types/equipment";

const defaultEquipment: ProductionEquipment[] = [
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
    id: "emb-002", 
    name: "Tajima TMAR-1201C (Single Head)",
    type: "embroidery",
    heads: 1,
    maxColors: 12,
    minQuantity: 1,
    maxQuantity: 200,
    capacity: 100,
    currentLoad: 80,
    status: "busy",
    setupTime: 15,
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

export function EquipmentManager() {
  const [equipment, setEquipment] = useState<ProductionEquipment[]>(defaultEquipment);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("embroidery");
  const [editingEquipment, setEditingEquipment] = useState<ProductionEquipment | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "embroidery" as "embroidery" | "screen_printing",
    heads: "1",
    maxColors: "12",
    screens: "4",
    isAutomatic: false,
    minQuantity: "1",
    maxQuantity: "1000",
    capacity: "500",
    setupTime: "30",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseData = {
      id: editingEquipment?.id || `${formData.type}-${Date.now()}`,
      name: formData.name,
      minQuantity: parseInt(formData.minQuantity),
      maxQuantity: parseInt(formData.maxQuantity),
      capacity: parseInt(formData.capacity),
      currentLoad: editingEquipment?.currentLoad || 0,
      status: editingEquipment?.status || "available" as const,
      setupTime: parseInt(formData.setupTime),
      createdAt: editingEquipment?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    let newEquipment: ProductionEquipment;

    if (formData.type === "embroidery") {
      newEquipment = {
        ...baseData,
        type: "embroidery",
        heads: parseInt(formData.heads),
        maxColors: parseInt(formData.maxColors),
      } as EmbroideryMachine;
    } else {
      newEquipment = {
        ...baseData,
        type: "screen_printing",
        screens: parseInt(formData.screens),
        isAutomatic: formData.isAutomatic,
      } as ScreenPrintingPress;
    }

    if (editingEquipment) {
      setEquipment(equipment.map(eq => eq.id === editingEquipment.id ? newEquipment : eq));
    } else {
      setEquipment([...equipment, newEquipment]);
    }

    resetForm();
    setOpen(false);
  };

  const handleEdit = (eq: ProductionEquipment) => {
    setEditingEquipment(eq);
    setFormData({
      name: eq.name,
      type: eq.type,
      heads: eq.type === "embroidery" ? eq.heads.toString() : "1",
      maxColors: eq.type === "embroidery" ? eq.maxColors.toString() : "12",
      screens: eq.type === "screen_printing" ? eq.screens.toString() : "4",
      isAutomatic: eq.type === "screen_printing" ? eq.isAutomatic : false,
      minQuantity: eq.minQuantity.toString(),
      maxQuantity: eq.maxQuantity.toString(),
      capacity: eq.capacity.toString(),
      setupTime: eq.setupTime.toString(),
    });
    setActiveTab(eq.type);
    setOpen(true);
  };

  const handleDelete = (equipmentId: string) => {
    setEquipment(equipment.filter(eq => eq.id !== equipmentId));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "embroidery",
      heads: "1",
      maxColors: "12",
      screens: "4",
      isAutomatic: false,
      minQuantity: "1",
      maxQuantity: "1000",
      capacity: "500",
      setupTime: "30",
    });
    setEditingEquipment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "maintenance": return "bg-red-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 90) return "destructive";
    if (load >= 75) return "default";
    return "secondary";
  };

  const embroideryEquipment = equipment.filter(eq => eq.type === "embroidery") as EmbroideryMachine[];
  const screenPrintingEquipment = equipment.filter(eq => eq.type === "screen_printing") as ScreenPrintingPress[];

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage Equipment
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Production Equipment Management</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Equipment List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Current Equipment</h3>
              <Button 
                size="sm" 
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </div>

            <Tabs defaultValue="embroidery" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="embroidery" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Embroidery
                </TabsTrigger>
                <TabsTrigger value="screen_printing" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Screen Printing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="embroidery" className="space-y-3 max-h-[500px] overflow-y-auto">
                {embroideryEquipment.map((machine) => (
                  <Card key={machine.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`} />
                            <h4 className="font-medium">{machine.name}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>Heads: {machine.heads}</div>
                            <div>Colors: {machine.maxColors}</div>
                            <div>Min Qty: {machine.minQuantity}</div>
                            <div>Max Qty: {machine.maxQuantity}</div>
                            <div>Capacity: {machine.capacity}/day</div>
                            <div>Setup: {machine.setupTime}min</div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Current Load</span>
                              <span>{machine.currentLoad}%</span>
                            </div>
                            <Badge variant={getLoadColor(machine.currentLoad)} className="w-full mt-1">
                              {machine.currentLoad}% Utilization
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(machine)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(machine.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="screen_printing" className="space-y-3 max-h-[500px] overflow-y-auto">
                {screenPrintingEquipment.map((press) => (
                  <Card key={press.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(press.status)}`} />
                            <h4 className="font-medium">{press.name}</h4>
                            {press.isAutomatic && (
                              <Badge variant="secondary">Automatic</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>Screens: {press.screens}</div>
                            <div>Type: {press.isAutomatic ? "Auto" : "Manual"}</div>
                            <div>Min Qty: {press.minQuantity}</div>
                            <div>Max Qty: {press.maxQuantity}</div>
                            <div>Capacity: {press.capacity}/day</div>
                            <div>Setup: {press.setupTime}min</div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Current Load</span>
                              <span>{press.currentLoad}%</span>
                            </div>
                            <Badge variant={getLoadColor(press.currentLoad)} className="w-full mt-1">
                              {press.currentLoad}% Utilization
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(press)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(press.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Add/Edit Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Brother PR-1050X"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Equipment Type</Label>
                <Select value={formData.type} onValueChange={(value) => {
                  setFormData({ ...formData, type: value as "embroidery" | "screen_printing" });
                  setActiveTab(value);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embroidery">Embroidery Machine</SelectItem>
                    <SelectItem value="screen_printing">Screen Printing Press</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "embroidery" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heads">Number of Heads</Label>
                      <Input
                        id="heads"
                        type="number"
                        min="1"
                        value={formData.heads}
                        onChange={(e) => setFormData({ ...formData, heads: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxColors">Max Colors</Label>
                      <Input
                        id="maxColors"
                        type="number"
                        min="1"
                        value={formData.maxColors}
                        onChange={(e) => setFormData({ ...formData, maxColors: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="screens">Number of Screens</Label>
                    <Input
                      id="screens"
                      type="number"
                      min="1"
                      value={formData.screens}
                      onChange={(e) => setFormData({ ...formData, screens: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isAutomatic"
                      checked={formData.isAutomatic}
                      onCheckedChange={(checked) => setFormData({ ...formData, isAutomatic: checked })}
                    />
                    <Label htmlFor="isAutomatic">Automatic Press</Label>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Min Quantity</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    min="1"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxQuantity">Max Quantity</Label>
                  <Input
                    id="maxQuantity"
                    type="number"
                    min="1"
                    value={formData.maxQuantity}
                    onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Daily Capacity (items)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setupTime">Setup Time (minutes)</Label>
                  <Input
                    id="setupTime"
                    type="number"
                    min="0"
                    value={formData.setupTime}
                    onChange={(e) => setFormData({ ...formData, setupTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEquipment ? "Update Equipment" : "Add Equipment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}