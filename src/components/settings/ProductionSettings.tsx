import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Settings, Clock, Factory, Palette, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IMPRINT_METHODS, getMethodConfig } from '@/types/imprint';
import { EquipmentConstraints } from '@/types/equipment';
import { EquipmentConstraintsForm } from '@/components/settings/EquipmentConstraintsForm';

interface DecorationMethod {
  id: string;
  name: string;
  label: string;
  enabled: boolean;
  stages: ProductionStage[];
}

interface ProductionStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface StageAssignment {
  decorationMethod: string;
  stageIds: string[];
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  stageAssignments: StageAssignment[];
  capacity: number;
  workingHours: WorkingHours;
  status: 'active' | 'maintenance' | 'offline';
  constraints: EquipmentConstraints;
}


interface WorkingHours {
  monday: { enabled: boolean; start: string; end: string };
  tuesday: { enabled: boolean; start: string; end: string };
  wednesday: { enabled: boolean; start: string; end: string };
  thursday: { enabled: boolean; start: string; end: string };
  friday: { enabled: boolean; start: string; end: string };
  saturday: { enabled: boolean; start: string; end: string };
  sunday: { enabled: boolean; start: string; end: string };
}

const defaultWorkingHours: WorkingHours = {
  monday: { enabled: true, start: '09:00', end: '17:00' },
  tuesday: { enabled: true, start: '09:00', end: '17:00' },
  wednesday: { enabled: true, start: '09:00', end: '17:00' },
  thursday: { enabled: true, start: '09:00', end: '17:00' },
  friday: { enabled: true, start: '09:00', end: '17:00' },
  saturday: { enabled: false, start: '09:00', end: '17:00' },
  sunday: { enabled: false, start: '09:00', end: '17:00' },
};

export function ProductionSettings() {
  const [decorationMethods, setDecorationMethods] = useState<DecorationMethod[]>(
    IMPRINT_METHODS.slice(0, 4).map((method, index) => ({
      id: method.value,
      name: method.value,
      label: method.label,
      enabled: true,
      stages: getDefaultStagesForMethod(method.value)
    }))
  );

  const [editingMethod, setEditingMethod] = useState<DecorationMethod | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  function getDefaultStagesForMethod(methodValue: string): ProductionStage[] {
    const stageMap: Record<string, ProductionStage[]> = {
      screenPrinting: [
        { id: 'art_prep', name: 'Art Preparation', color: 'bg-blue-500', order: 1 },
        { id: 'screen_making', name: 'Screen Making', color: 'bg-purple-500', order: 2 },
        { id: 'printing', name: 'Printing', color: 'bg-green-500', order: 3 },
        { id: 'curing', name: 'Curing', color: 'bg-orange-500', order: 4 },
      ],
      embroidery: [
        { id: 'digitizing', name: 'Digitizing', color: 'bg-blue-500', order: 1 },
        { id: 'hooping', name: 'Hooping', color: 'bg-purple-500', order: 2 },
        { id: 'embroidering', name: 'Embroidering', color: 'bg-green-500', order: 3 },
        { id: 'trimming', name: 'Trimming', color: 'bg-yellow-500', order: 4 },
      ],
      dtf: [
        { id: 'printing', name: 'Printing', color: 'bg-blue-500', order: 1 },
        { id: 'powder', name: 'Powder Application', color: 'bg-purple-500', order: 2 },
        { id: 'curing', name: 'Curing', color: 'bg-orange-500', order: 3 },
        { id: 'pressing', name: 'Heat Pressing', color: 'bg-red-500', order: 4 },
      ],
      dtg: [
        { id: 'pretreat', name: 'Pretreatment', color: 'bg-blue-500', order: 1 },
        { id: 'printing', name: 'Printing', color: 'bg-green-500', order: 2 },
        { id: 'curing', name: 'Curing', color: 'bg-orange-500', order: 3 },
      ],
    };
    
    return stageMap[methodValue] || [
      { id: 'preparation', name: 'Preparation', color: 'bg-blue-500', order: 1 },
      { id: 'production', name: 'Production', color: 'bg-green-500', order: 2 },
      { id: 'finishing', name: 'Finishing', color: 'bg-orange-500', order: 3 },
    ];
  }

  const handleEditMethod = (method: DecorationMethod) => {
    setEditingMethod({ ...method });
    setIsEditDialogOpen(true);
  };

  const handleSaveMethod = () => {
    if (!editingMethod) return;
    
    setDecorationMethods(prev => 
      prev.map(method => 
        method.id === editingMethod.id ? editingMethod : method
      )
    );
    setIsEditDialogOpen(false);
    setEditingMethod(null);
  };

  const handleToggleMethod = (methodId: string) => {
    setDecorationMethods(prev =>
      prev.map(method =>
        method.id === methodId ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleDeleteMethod = (methodId: string) => {
    setDecorationMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const handleAddStage = () => {
    if (!editingMethod) return;
    
    const newStage: ProductionStage = {
      id: `stage_${Date.now()}`,
      name: 'New Stage',
      color: 'bg-gray-500',
      order: editingMethod.stages.length + 1
    };
    
    setEditingMethod({
      ...editingMethod,
      stages: [...editingMethod.stages, newStage]
    });
  };

  const handleUpdateStage = (stageId: string, updates: Partial<ProductionStage>) => {
    if (!editingMethod) return;
    
    setEditingMethod({
      ...editingMethod,
      stages: editingMethod.stages.map(stage =>
        stage.id === stageId ? { ...stage, ...updates } : stage
      )
    });
  };

  const handleDeleteStage = (stageId: string) => {
    if (!editingMethod) return;
    
    setEditingMethod({
      ...editingMethod,
      stages: editingMethod.stages.filter(stage => stage.id !== stageId)
    });
  };

  const stageColors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const defaultConstraints: EquipmentConstraints = {
    supportedSizes: ['S', 'M', 'L', 'XL'],
    maxImprintWidth: 12,
    maxImprintHeight: 14,
    supportedGarmentTypes: ['tshirt', 'polo', 'hoodie'],
    supportedPlacements: ['front_center', 'back_center'],
    minQuantityPerRun: 1,
    maxQuantityPerRun: 1000,
  };

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 'screen_press_1',
      name: 'Manual Screen Press #1',
      type: 'Screen Printing Press',
      stageAssignments: [
        { decorationMethod: 'screenPrinting', stageIds: ['printing', 'curing'] }
      ],
      capacity: 200,
      workingHours: defaultWorkingHours,
      status: 'active',
      constraints: { ...defaultConstraints, maxColors: 6, maxScreens: 8 },
    },
    {
      id: 'embroidery_1',
      name: 'Brother 6-Head Embroidery',
      type: 'Embroidery Machine',
      stageAssignments: [
        { decorationMethod: 'embroidery', stageIds: ['hooping', 'embroidering', 'trimming'] }
      ],
      capacity: 150,
      workingHours: { ...defaultWorkingHours, saturday: { enabled: true, start: '09:00', end: '15:00' } },
      status: 'active',
      constraints: { ...defaultConstraints, maxColors: 15, supportedGarmentTypes: ['tshirt', 'polo', 'hoodie', 'cap'] },
    },
    {
      id: 'dtf_printer_1',
      name: 'DTF Printer Station',
      type: 'DTF Printer',
      stageAssignments: [
        { decorationMethod: 'dtf', stageIds: ['printing', 'powder'] }
      ],
      capacity: 100,
      workingHours: defaultWorkingHours,
      status: 'active',
      constraints: { ...defaultConstraints, unlimitedColors: true },
    },
  ]);

  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    type: '',
    stageAssignments: [],
    capacity: 100,
    workingHours: defaultWorkingHours,
    status: 'active',
    constraints: defaultConstraints,
  });

  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  const [isEditingEquipment, setIsEditingEquipment] = useState(false);
  
  const [editingEquipmentHours, setEditingEquipmentHours] = useState<Equipment | null>(null);
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);

  const [globalWorkingHours, setGlobalWorkingHours] = useState<WorkingHours>(defaultWorkingHours);

  // Equipment handlers
  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.type) return;
    
    const equipment: Equipment = {
      id: `equipment_${Date.now()}`,
      name: newEquipment.name,
      type: newEquipment.type,
      stageAssignments: newEquipment.stageAssignments || [],
      capacity: newEquipment.capacity || 100,
      workingHours: newEquipment.workingHours || defaultWorkingHours,
      status: newEquipment.status || 'active',
      constraints: newEquipment.constraints || defaultConstraints,
    };
    
    setEquipment(prev => [...prev, equipment]);
    setNewEquipment({
      name: '',
      type: '',
      stageAssignments: [],
      capacity: 100,
      workingHours: defaultWorkingHours,
      status: 'active',
      constraints: defaultConstraints,
    });
    setIsEquipmentDialogOpen(false);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment({ ...equipment });
    setIsEditingEquipment(true);
    setIsEquipmentDialogOpen(true);
  };

  const handleSaveEquipment = () => {
    if (!editingEquipment) return;
    
    setEquipment(prev => 
      prev.map(eq => 
        eq.id === editingEquipment.id ? editingEquipment : eq
      )
    );
    setIsEquipmentDialogOpen(false);
    setEditingEquipment(null);
    setIsEditingEquipment(false);
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    setEquipment(prev => prev.filter(eq => eq.id !== equipmentId));
  };

  const handleAddStageAssignment = (equipmentToEdit: Equipment | Partial<Equipment>) => {
    const newAssignment: StageAssignment = {
      decorationMethod: '',
      stageIds: []
    };
    
    if (isEditingEquipment && editingEquipment) {
      setEditingEquipment({
        ...editingEquipment,
        stageAssignments: [...editingEquipment.stageAssignments, newAssignment]
      });
    } else {
      setNewEquipment({
        ...newEquipment,
        stageAssignments: [...(newEquipment.stageAssignments || []), newAssignment]
      });
    }
  };

  const handleUpdateStageAssignment = (index: number, updates: Partial<StageAssignment>) => {
    if (isEditingEquipment && editingEquipment) {
      const updatedAssignments = editingEquipment.stageAssignments.map((assignment, i) =>
        i === index ? { ...assignment, ...updates } : assignment
      );
      setEditingEquipment({
        ...editingEquipment,
        stageAssignments: updatedAssignments
      });
    } else {
      const updatedAssignments = (newEquipment.stageAssignments || []).map((assignment, i) =>
        i === index ? { ...assignment, ...updates } : assignment
      );
      setNewEquipment({
        ...newEquipment,
        stageAssignments: updatedAssignments
      });
    }
  };

  const handleRemoveStageAssignment = (index: number) => {
    if (isEditingEquipment && editingEquipment) {
      setEditingEquipment({
        ...editingEquipment,
        stageAssignments: editingEquipment.stageAssignments.filter((_, i) => i !== index)
      });
    } else {
      setNewEquipment({
        ...newEquipment,
        stageAssignments: (newEquipment.stageAssignments || []).filter((_, i) => i !== index)
      });
    }
  };

  const getStagesForMethod = (methodId: string) => {
    const method = decorationMethods.find(m => m.id === methodId);
    return method?.stages || [];
  };

  // Working hours handlers
  const handleEditEquipmentHours = (equipment: Equipment) => {
    setEditingEquipmentHours({ ...equipment });
    setIsHoursDialogOpen(true);
  };

  const handleSaveEquipmentHours = () => {
    if (!editingEquipmentHours) return;
    
    setEquipment(prev => 
      prev.map(eq => 
        eq.id === editingEquipmentHours.id 
          ? { ...eq, workingHours: editingEquipmentHours.workingHours }
          : eq
      )
    );
    setIsHoursDialogOpen(false);
    setEditingEquipmentHours(null);
  };

  const handleUpdateEquipmentWorkingHours = (day: keyof WorkingHours, updates: Partial<WorkingHours[keyof WorkingHours]>) => {
    if (!editingEquipmentHours) return;
    
    setEditingEquipmentHours({
      ...editingEquipmentHours,
      workingHours: {
        ...editingEquipmentHours.workingHours,
        [day]: {
          ...editingEquipmentHours.workingHours[day],
          ...updates
        }
      }
    });
  };

  const formatWorkingHoursDisplay = (workingHours: WorkingHours): string => {
    const enabledDays = Object.entries(workingHours)
      .filter(([_, hours]) => hours.enabled)
      .map(([day, hours]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1, 3),
        start: hours.start,
        end: hours.end
      }));
    
    if (enabledDays.length === 0) return 'No working hours set';
    
    const groupedHours = enabledDays.reduce((acc, { day, start, end }) => {
      const timeRange = `${start}-${end}`;
      if (!acc[timeRange]) acc[timeRange] = [];
      acc[timeRange].push(day);
      return acc;
    }, {} as Record<string, string[]>);
    
    return Object.entries(groupedHours)
      .map(([timeRange, days]) => `${days.join(', ')}: ${timeRange}`)
      .join(' | ');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="methods">Decoration Methods</TabsTrigger>
          <TabsTrigger value="equipment">Equipment & Stations</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="rules">Production Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Decoration Methods
                  </CardTitle>
                  <CardDescription>
                    Configure the decoration methods available in your shop
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Decoration Method</DialogTitle>
                      <DialogDescription>
                        Create a new decoration method with custom stages
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="method-name">Method Name</Label>
                        <Input id="method-name" placeholder="e.g., Heat Transfer Vinyl" />
                      </div>
                      <div>
                        <Label htmlFor="method-stages">Production Stages</Label>
                        <div className="text-sm text-muted-foreground mt-1">
                          Add stages for this decoration method (coming soon)
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Add Method</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decorationMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={method.enabled} 
                          onCheckedChange={() => handleToggleMethod(method.id)}
                        />
                        <div>
                          <h4 className="font-medium">{method.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {method.stages.length} production stages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditMethod(method)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {method.stages.map((stage) => (
                        <Badge key={stage.id} variant="secondary" className="gap-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          {stage.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit Method Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Decoration Method</DialogTitle>
              <DialogDescription>
                Customize the stages and settings for {editingMethod?.label}
              </DialogDescription>
            </DialogHeader>
            
            {editingMethod && (
              <div className="space-y-6">
                {/* Method Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-method-name">Method Name</Label>
                    <Input
                      id="edit-method-name"
                      value={editingMethod.label}
                      onChange={(e) => setEditingMethod({
                        ...editingMethod,
                        label: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingMethod.enabled}
                      onCheckedChange={(checked) => setEditingMethod({
                        ...editingMethod,
                        enabled: checked
                      })}
                    />
                    <Label>Enable this decoration method</Label>
                  </div>
                </div>

                <Separator />

                {/* Production Stages */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Production Stages</h4>
                    <Button onClick={handleAddStage} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stage
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {editingMethod.stages.map((stage, index) => (
                      <div key={stage.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">#{index + 1}</span>
                          </div>
                          
                          <div className="flex-1">
                            <Input
                              value={stage.name}
                              onChange={(e) => handleUpdateStage(stage.id, { name: e.target.value })}
                              placeholder="Stage name"
                            />
                          </div>
                          
                          <Select
                            value={stage.color}
                            onValueChange={(color) => handleUpdateStage(stage.id, { color })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                                  Color
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {stageColors.map((color) => (
                                <SelectItem key={color} value={color}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${color}`} />
                                    {color.replace('bg-', '').replace('-500', '')}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStage(stage.id)}
                            disabled={editingMethod.stages.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Method Info from IMPRINT_METHODS */}
                {getMethodConfig(editingMethod.name) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium">Method Requirements</h4>
                      <div className="text-sm text-muted-foreground">
                        {getMethodConfig(editingMethod.name)?.instructions}
                      </div>
                      {getMethodConfig(editingMethod.name)?.requirements && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Requirements:</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            {getMethodConfig(editingMethod.name)?.requirements?.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveMethod}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5" />
                    Equipment & Stations
                  </CardTitle>
                  <CardDescription>
                    Manage your production equipment and their capabilities
                  </CardDescription>
                </div>
                <Dialog open={isEquipmentDialogOpen} onOpenChange={setIsEquipmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setIsEditingEquipment(false);
                      setNewEquipment({
                        name: '',
                        type: '',
                        stageAssignments: [],
                        capacity: 100,
                        workingHours: defaultWorkingHours,
                        status: 'active',
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Equipment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {isEditingEquipment ? 'Edit Equipment' : 'Add Equipment'}
                      </DialogTitle>
                      <DialogDescription>
                        {isEditingEquipment 
                          ? 'Update equipment configuration and stage assignments'
                          : 'Add new production equipment and assign it to production stages'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Basic Equipment Info */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="equipment-name">Equipment Name</Label>
                          <Input 
                            id="equipment-name" 
                            placeholder="e.g., Screen Press #2"
                            value={isEditingEquipment ? editingEquipment?.name || '' : newEquipment.name || ''}
                            onChange={(e) => {
                              if (isEditingEquipment && editingEquipment) {
                                setEditingEquipment({ ...editingEquipment, name: e.target.value });
                              } else {
                                setNewEquipment({ ...newEquipment, name: e.target.value });
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="equipment-type">Equipment Type</Label>
                          <Input
                            id="equipment-type"
                            placeholder="e.g., Screen Printing Press"
                            value={isEditingEquipment ? editingEquipment?.type || '' : newEquipment.type || ''}
                            onChange={(e) => {
                              if (isEditingEquipment && editingEquipment) {
                                setEditingEquipment({ ...editingEquipment, type: e.target.value });
                              } else {
                                setNewEquipment({ ...newEquipment, type: e.target.value });
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="capacity">Daily Capacity</Label>
                          <Input 
                            id="capacity" 
                            type="number" 
                            placeholder="Items per day"
                            value={isEditingEquipment ? editingEquipment?.capacity || 100 : newEquipment.capacity || 100}
                            onChange={(e) => {
                              const capacity = parseInt(e.target.value) || 100;
                              if (isEditingEquipment && editingEquipment) {
                                setEditingEquipment({ ...editingEquipment, capacity });
                              } else {
                                setNewEquipment({ ...newEquipment, capacity });
                              }
                            }}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Stage Assignments */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Stage Assignments</h4>
                          <Button 
                            onClick={() => handleAddStageAssignment(isEditingEquipment ? editingEquipment! : newEquipment)} 
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Assignment
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {((isEditingEquipment ? editingEquipment?.stageAssignments : newEquipment.stageAssignments) || []).map((assignment, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <Label>Decoration Method</Label>
                                    <Select
                                      value={assignment.decorationMethod}
                                      onValueChange={(value) => handleUpdateStageAssignment(index, { decorationMethod: value, stageIds: [] })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select decoration method" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {decorationMethods.filter(m => m.enabled).map((method) => (
                                          <SelectItem key={method.id} value={method.id}>
                                            {method.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveStageAssignment(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                {assignment.decorationMethod && (
                                  <div>
                                    <Label>Production Stages</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      {getStagesForMethod(assignment.decorationMethod).map((stage) => (
                                        <div key={stage.id} className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            id={`stage-${index}-${stage.id}`}
                                            checked={assignment.stageIds.includes(stage.id)}
                                            onChange={(e) => {
                                              const updatedStageIds = e.target.checked
                                                ? [...assignment.stageIds, stage.id]
                                                : assignment.stageIds.filter(id => id !== stage.id);
                                              handleUpdateStageAssignment(index, { stageIds: updatedStageIds });
                                            }}
                                            className="rounded border-gray-300"
                                          />
                                          <label 
                                            htmlFor={`stage-${index}-${stage.id}`}
                                            className="text-sm flex items-center gap-2"
                                          >
                                            <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                                            {stage.name}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {((isEditingEquipment ? editingEquipment?.stageAssignments : newEquipment.stageAssignments) || []).length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                              <Factory className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No stage assignments yet</p>
                              <p className="text-sm">Click "Add Assignment" to configure which stages this equipment handles</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Equipment Constraints */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Equipment Constraints</h4>
                        <EquipmentConstraintsForm
                          constraints={isEditingEquipment ? editingEquipment?.constraints || defaultConstraints : newEquipment.constraints || defaultConstraints}
                          onChange={(constraints) => {
                            if (isEditingEquipment && editingEquipment) {
                              setEditingEquipment({ ...editingEquipment, constraints });
                            } else {
                              setNewEquipment({ ...newEquipment, constraints });
                            }
                          }}
                          equipmentType={isEditingEquipment ? editingEquipment?.type || '' : newEquipment.type || ''}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEquipmentDialogOpen(false);
                            setEditingEquipment(null);
                            setIsEditingEquipment(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={isEditingEquipment ? handleSaveEquipment : handleAddEquipment}>
                          {isEditingEquipment ? 'Save Changes' : 'Add Equipment'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Capacity: {item.capacity}/day</span>
                          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        {/* Constraints Summary */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.constraints.maxColors && (
                            <Badge variant="outline" className="text-xs">
                              Max {item.constraints.maxColors} Colors
                            </Badge>
                          )}
                          {item.constraints.maxScreens && (
                            <Badge variant="outline" className="text-xs">
                              {item.constraints.maxScreens} Screens
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {item.constraints.supportedGarmentTypes.length} Garment Types
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.constraints.supportedSizes.length} Sizes
                          </Badge>
                          {item.constraints.supportedPlacements.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {item.constraints.supportedPlacements.length} Placements
                            </Badge>
                          )}
                        </div>
                        
                        {/* Stage Assignments Display */}
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Assigned Stages:</p>
                          {item.stageAssignments.length > 0 ? (
                            <div className="space-y-2">
                              {item.stageAssignments.map((assignment, index) => {
                                const method = decorationMethods.find(m => m.id === assignment.decorationMethod);
                                return (
                                  <div key={index} className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{method?.label}:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {assignment.stageIds.map(stageId => {
                                        const stage = method?.stages.find(s => s.id === stageId);
                                        return stage ? (
                                          <Badge key={stageId} variant="outline" className="gap-1 text-xs">
                                            <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                            {stage.name}
                                          </Badge>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No stages assigned</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditEquipment(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteEquipment(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Global Working Hours
              </CardTitle>
              <CardDescription>
                Set default working hours for your shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(globalWorkingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <Switch checked={hours.enabled} />
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.start}
                        disabled={!hours.enabled}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours.end}
                        disabled={!hours.enabled}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment-Specific Hours</CardTitle>
              <CardDescription>
                Override working hours for specific equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{item.name}</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditEquipmentHours(item)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Hours
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatWorkingHoursDisplay(item.workingHours)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Rules</CardTitle>
              <CardDescription>
                Configure automation and scheduling rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="auto-schedule">Auto-scheduling</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Switch id="auto-schedule" />
                    <span className="text-sm text-muted-foreground">
                      Automatically schedule jobs based on due dates and capacity
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="setup-buffer">Setup Time Buffer</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="setup-buffer"
                      type="number"
                      placeholder="15"
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">
                      minutes buffer between jobs for setup
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="rush-priority">Rush Job Priority</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Switch id="rush-priority" />
                    <span className="text-sm text-muted-foreground">
                      Automatically prioritize rush jobs in scheduling
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Equipment Working Hours Dialog */}
      <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Working Hours</DialogTitle>
            <DialogDescription>
              Set custom working hours for {editingEquipmentHours?.name}
            </DialogDescription>
          </DialogHeader>
          
          {editingEquipmentHours && (
            <div className="space-y-4">
              {Object.entries(editingEquipmentHours.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24">
                    <Label className="capitalize">{day}</Label>
                  </div>
                  <Switch 
                    checked={hours.enabled}
                    onCheckedChange={(enabled) => 
                      handleUpdateEquipmentWorkingHours(day as keyof WorkingHours, { enabled })
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={hours.start}
                      disabled={!hours.enabled}
                      className="w-32"
                      onChange={(e) => 
                        handleUpdateEquipmentWorkingHours(day as keyof WorkingHours, { start: e.target.value })
                      }
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={hours.end}
                      disabled={!hours.enabled}
                      className="w-32"
                      onChange={(e) => 
                        handleUpdateEquipmentWorkingHours(day as keyof WorkingHours, { end: e.target.value })
                      }
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsHoursDialogOpen(false);
                    setEditingEquipmentHours(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEquipmentHours}>
                  Save Hours
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}