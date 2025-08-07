import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Edit, Settings, Clock, Factory, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

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

interface Equipment {
  id: string;
  name: string;
  type: string;
  decorationMethods: string[];
  capacity: number;
  workingHours: WorkingHours;
  status: 'active' | 'maintenance' | 'offline';
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

// Form schemas
const decorationMethodSchema = z.object({
  name: z.string().min(1, 'Method name is required'),
  label: z.string().min(1, 'Display label is required'),
});

const equipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  type: z.string().min(1, 'Equipment type is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  decorationMethods: z.array(z.string()).min(1, 'At least one decoration method required'),
});

const productionRulesSchema = z.object({
  autoScheduling: z.boolean(),
  setupBuffer: z.number().min(0, 'Setup buffer must be 0 or greater'),
  rushPriority: z.boolean(),
});

export function ProductionSettings() {
  const { toast } = useToast();
  const [decorationMethods, setDecorationMethods] = useState<DecorationMethod[]>([
    {
      id: 'screen_printing',
      name: 'screen_printing',
      label: 'Screen Printing',
      enabled: true,
      stages: [
        { id: 'art_prep', name: 'Art Preparation', color: 'bg-blue-500', order: 1 },
        { id: 'screen_making', name: 'Screen Making', color: 'bg-purple-500', order: 2 },
        { id: 'printing', name: 'Printing', color: 'bg-green-500', order: 3 },
        { id: 'curing', name: 'Curing', color: 'bg-orange-500', order: 4 },
      ]
    },
    {
      id: 'embroidery',
      name: 'embroidery',
      label: 'Embroidery',
      enabled: true,
      stages: [
        { id: 'digitizing', name: 'Digitizing', color: 'bg-blue-500', order: 1 },
        { id: 'hooping', name: 'Hooping', color: 'bg-purple-500', order: 2 },
        { id: 'embroidering', name: 'Embroidering', color: 'bg-green-500', order: 3 },
        { id: 'trimming', name: 'Trimming', color: 'bg-yellow-500', order: 4 },
      ]
    },
    {
      id: 'dtf',
      name: 'dtf',
      label: 'DTF',
      enabled: true,
      stages: [
        { id: 'printing', name: 'Printing', color: 'bg-blue-500', order: 1 },
        { id: 'powder', name: 'Powder Application', color: 'bg-purple-500', order: 2 },
        { id: 'curing', name: 'Curing', color: 'bg-orange-500', order: 3 },
        { id: 'pressing', name: 'Heat Pressing', color: 'bg-red-500', order: 4 },
      ]
    },
    {
      id: 'dtg',
      name: 'dtg',
      label: 'DTG',
      enabled: true,
      stages: [
        { id: 'pretreat', name: 'Pretreatment', color: 'bg-blue-500', order: 1 },
        { id: 'printing', name: 'Printing', color: 'bg-green-500', order: 2 },
        { id: 'curing', name: 'Curing', color: 'bg-orange-500', order: 3 },
      ]
    },
  ]);

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 'screen_press_1',
      name: 'Manual Screen Press #1',
      type: 'Screen Printing Press',
      decorationMethods: ['screen_printing'],
      capacity: 200,
      workingHours: defaultWorkingHours,
      status: 'active',
    },
    {
      id: 'embroidery_1',
      name: 'Brother 6-Head Embroidery',
      type: 'Embroidery Machine',
      decorationMethods: ['embroidery'],
      capacity: 150,
      workingHours: { ...defaultWorkingHours, saturday: { enabled: true, start: '09:00', end: '15:00' } },
      status: 'active',
    },
    {
      id: 'dtf_printer_1',
      name: 'DTF Printer Station',
      type: 'DTF Printer',
      decorationMethods: ['dtf'],
      capacity: 100,
      workingHours: defaultWorkingHours,
      status: 'active',
    },
  ]);

  const [globalWorkingHours, setGlobalWorkingHours] = useState<WorkingHours>(defaultWorkingHours);
  const [productionRules, setProductionRules] = useState({
    autoScheduling: true,
    setupBuffer: 15,
    rushPriority: true,
  });

  // Dialog states
  const [isAddMethodDialogOpen, setIsAddMethodDialogOpen] = useState(false);
  const [isAddEquipmentDialogOpen, setIsAddEquipmentDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<DecorationMethod | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [configuringHours, setConfiguringHours] = useState<Equipment | null>(null);

  // Form instances
  const methodForm = useForm<z.infer<typeof decorationMethodSchema>>({
    resolver: zodResolver(decorationMethodSchema),
    defaultValues: { name: '', label: '' },
  });

  const equipmentForm = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: { name: '', type: '', capacity: 100, decorationMethods: [] },
  });

  const rulesForm = useForm<z.infer<typeof productionRulesSchema>>({
    resolver: zodResolver(productionRulesSchema),
    defaultValues: productionRules,
  });

  // Method handlers
  const handleToggleMethod = (methodId: string) => {
    setDecorationMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
    toast({ title: 'Method updated', description: 'Decoration method status changed' });
  };

  const handleAddMethod = (data: z.infer<typeof decorationMethodSchema>) => {
    const newMethod: DecorationMethod = {
      id: data.name.toLowerCase().replace(/\s+/g, '_'),
      name: data.name.toLowerCase().replace(/\s+/g, '_'),
      label: data.label,
      enabled: true,
      stages: [
        { id: 'prep', name: 'Preparation', color: 'bg-blue-500', order: 1 },
        { id: 'production', name: 'Production', color: 'bg-green-500', order: 2 },
        { id: 'finishing', name: 'Finishing', color: 'bg-orange-500', order: 3 },
      ],
    };
    setDecorationMethods(prev => [...prev, newMethod]);
    setIsAddMethodDialogOpen(false);
    methodForm.reset();
    toast({ title: 'Method added', description: `${data.label} has been added successfully` });
  };

  const handleDeleteMethod = (methodId: string) => {
    setDecorationMethods(prev => prev.filter(method => method.id !== methodId));
    toast({ title: 'Method deleted', description: 'Decoration method has been removed' });
  };

  // Equipment handlers
  const handleAddEquipment = (data: z.infer<typeof equipmentSchema>) => {
    const newEquipment: Equipment = {
      id: data.name.toLowerCase().replace(/\s+/g, '_'),
      name: data.name,
      type: data.type,
      decorationMethods: data.decorationMethods,
      capacity: data.capacity,
      workingHours: defaultWorkingHours,
      status: 'active',
    };
    setEquipment(prev => [...prev, newEquipment]);
    setIsAddEquipmentDialogOpen(false);
    equipmentForm.reset();
    toast({ title: 'Equipment added', description: `${data.name} has been added successfully` });
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    setEquipment(prev => prev.filter(eq => eq.id !== equipmentId));
    toast({ title: 'Equipment deleted', description: 'Equipment has been removed' });
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    equipmentForm.reset({
      name: equipment.name,
      type: equipment.type,
      capacity: equipment.capacity,
      decorationMethods: equipment.decorationMethods,
    });
  };

  const handleUpdateEquipment = (data: z.infer<typeof equipmentSchema>) => {
    if (!editingEquipment) return;
    
    setEquipment(prev => 
      prev.map(eq => 
        eq.id === editingEquipment.id 
          ? { ...eq, ...data }
          : eq
      )
    );
    setEditingEquipment(null);
    toast({ title: 'Equipment updated', description: 'Equipment has been updated successfully' });
  };

  // Working hours handlers
  const handleGlobalHoursChange = (day: keyof WorkingHours, field: keyof WorkingHours[keyof WorkingHours], value: any) => {
    setGlobalWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleEquipmentHoursChange = (equipmentId: string, hours: WorkingHours) => {
    setEquipment(prev => 
      prev.map(eq => 
        eq.id === equipmentId 
          ? { ...eq, workingHours: hours }
          : eq
      )
    );
    setConfiguringHours(null);
    toast({ title: 'Hours updated', description: 'Equipment working hours have been updated' });
  };

  // Production rules handlers
  const handleRulesUpdate = (data: z.infer<typeof productionRulesSchema>) => {
    setProductionRules(data);
    toast({ title: 'Rules updated', description: 'Production rules have been updated' });
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
                <Dialog open={isAddMethodDialogOpen} onOpenChange={setIsAddMethodDialogOpen}>
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
                        Create a new decoration method with default stages
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...methodForm}>
                      <form onSubmit={methodForm.handleSubmit(handleAddMethod)} className="space-y-4">
                        <FormField
                          control={methodForm.control}
                          name="label"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Label</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Heat Transfer Vinyl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={methodForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Internal Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., heat_transfer_vinyl" {...field} />
                              </FormControl>
                              <FormDescription>
                                Used internally, should be lowercase with underscores
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddMethodDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Method</Button>
                        </div>
                      </form>
                    </Form>
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
                        <Button variant="outline" size="sm" onClick={() => setEditingMethod(method)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Decoration Method</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{method.label}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMethod(method.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                <Dialog open={isAddEquipmentDialogOpen} onOpenChange={setIsAddEquipmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Equipment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Equipment</DialogTitle>
                      <DialogDescription>
                        Add a new piece of production equipment
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...equipmentForm}>
                      <form onSubmit={equipmentForm.handleSubmit(handleAddEquipment)} className="space-y-4">
                        <FormField
                          control={equipmentForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipment Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Screen Press #2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={equipmentForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipment Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Screen Printing Press">Screen Printing Press</SelectItem>
                                  <SelectItem value="Embroidery Machine">Embroidery Machine</SelectItem>
                                  <SelectItem value="DTF Printer">DTF Printer</SelectItem>
                                  <SelectItem value="DTG Printer">DTG Printer</SelectItem>
                                  <SelectItem value="Heat Press">Heat Press</SelectItem>
                                  <SelectItem value="Vinyl Cutter">Vinyl Cutter</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={equipmentForm.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Daily Capacity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Items per day" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={equipmentForm.control}
                          name="decorationMethods"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compatible Methods</FormLabel>
                              <div className="grid grid-cols-2 gap-2">
                                {decorationMethods.map((method) => (
                                  <div key={method.id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={method.id}
                                      checked={field.value.includes(method.name)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          field.onChange([...field.value, method.name]);
                                        } else {
                                          field.onChange(field.value.filter(m => m !== method.name));
                                        }
                                      }}
                                    />
                                    <Label htmlFor={method.id} className="text-sm">{method.label}</Label>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddEquipmentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Equipment</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Capacity: {item.capacity}/day</span>
                          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditEquipment(item)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEquipment(item.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                    <Switch 
                      checked={hours.enabled} 
                      onCheckedChange={(checked) => handleGlobalHoursChange(day as keyof WorkingHours, 'enabled', checked)}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.start}
                        disabled={!hours.enabled}
                        className="w-32"
                        onChange={(e) => handleGlobalHoursChange(day as keyof WorkingHours, 'start', e.target.value)}
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours.end}
                        disabled={!hours.enabled}
                        className="w-32"
                        onChange={(e) => handleGlobalHoursChange(day as keyof WorkingHours, 'end', e.target.value)}
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
                      <Button variant="outline" size="sm" onClick={() => setConfiguringHours(item)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Hours
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Using global working hours (Mon-Fri 9:00 AM - 5:00 PM)
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
              <Form {...rulesForm}>
                <form onSubmit={rulesForm.handleSubmit(handleRulesUpdate)} className="space-y-6">
                  <FormField
                    control={rulesForm.control}
                    name="autoScheduling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auto-scheduling</FormLabel>
                        <div className="flex items-center gap-2 mt-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">
                            Automatically schedule jobs based on due dates and capacity
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={rulesForm.control}
                    name="setupBuffer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setup Time Buffer</FormLabel>
                        <div className="flex items-center gap-2 mt-2">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="15"
                              className="w-20"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">
                            minutes buffer between jobs for setup
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={rulesForm.control}
                    name="rushPriority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rush Job Priority</FormLabel>
                        <div className="flex items-center gap-2 mt-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">
                            Prioritize rush jobs in the production schedule
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit">Save Rules</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Equipment Dialog */}
      <Dialog open={!!editingEquipment} onOpenChange={() => setEditingEquipment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>
              Update equipment settings and capabilities
            </DialogDescription>
          </DialogHeader>
          {editingEquipment && (
            <Form {...equipmentForm}>
              <form onSubmit={equipmentForm.handleSubmit(handleUpdateEquipment)} className="space-y-4">
                <FormField
                  control={equipmentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={equipmentForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Screen Printing Press">Screen Printing Press</SelectItem>
                          <SelectItem value="Embroidery Machine">Embroidery Machine</SelectItem>
                          <SelectItem value="DTF Printer">DTF Printer</SelectItem>
                          <SelectItem value="DTG Printer">DTG Printer</SelectItem>
                          <SelectItem value="Heat Press">Heat Press</SelectItem>
                          <SelectItem value="Vinyl Cutter">Vinyl Cutter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={equipmentForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingEquipment(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Equipment</Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Configure Equipment Hours Dialog */}
      <Dialog open={!!configuringHours} onOpenChange={() => setConfiguringHours(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Working Hours</DialogTitle>
            <DialogDescription>
              Set custom working hours for {configuringHours?.name}
            </DialogDescription>
          </DialogHeader>
          {configuringHours && (
            <div className="space-y-4">
              {Object.entries(configuringHours.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24">
                    <Label className="capitalize">{day}</Label>
                  </div>
                  <Switch 
                    checked={hours.enabled} 
                    onCheckedChange={(checked) => {
                      const updated = {
                        ...configuringHours.workingHours,
                        [day]: { ...hours, enabled: checked }
                      };
                      setConfiguringHours({ ...configuringHours, workingHours: updated });
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={hours.start}
                      disabled={!hours.enabled}
                      className="w-32"
                      onChange={(e) => {
                        const updated = {
                          ...configuringHours.workingHours,
                          [day]: { ...hours, start: e.target.value }
                        };
                        setConfiguringHours({ ...configuringHours, workingHours: updated });
                      }}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={hours.end}
                      disabled={!hours.enabled}
                      className="w-32"
                      onChange={(e) => {
                        const updated = {
                          ...configuringHours.workingHours,
                          [day]: { ...hours, end: e.target.value }
                        };
                        setConfiguringHours({ ...configuringHours, workingHours: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setConfiguringHours(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEquipmentHoursChange(configuringHours.id, configuringHours.workingHours)}>
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