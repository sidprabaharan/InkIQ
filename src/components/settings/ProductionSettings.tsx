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
import { Plus, Trash2, Edit, Settings, Clock, Factory, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

export function ProductionSettings() {
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
                        <Switch checked={method.enabled} />
                        <div>
                          <h4 className="font-medium">{method.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {method.stages.length} production stages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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
                <Dialog>
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
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="equipment-name">Equipment Name</Label>
                        <Input id="equipment-name" placeholder="e.g., Screen Press #2" />
                      </div>
                      <div>
                        <Label htmlFor="equipment-type">Equipment Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="screen_printing">Screen Printing Press</SelectItem>
                            <SelectItem value="embroidery">Embroidery Machine</SelectItem>
                            <SelectItem value="dtf">DTF Printer</SelectItem>
                            <SelectItem value="dtg">DTG Printer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="capacity">Daily Capacity</Label>
                        <Input id="capacity" type="number" placeholder="Items per day" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Add Equipment</Button>
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
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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
                      <Button variant="outline" size="sm">
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
    </div>
  );
}