import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ChevronDown, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Save, 
  RefreshCw,
  Settings,
  DollarSign,
  Palette,
  Ruler,
  Package,
  Shirt,
  Cog,
  Clock,
  CheckCircle
} from 'lucide-react';
import { IMPRINT_METHODS } from '@/types/imprint';
import { 
  ImprintMethodConfiguration, 
  PricingTier, 
  calculatePrice, 
  validateConstraints 
} from '@/types/imprint-config';
import { GarmentType, GarmentSize, ImprintPlacement } from '@/types/equipment';

export function ImprintSettings() {
  const [configurations, setConfigurations] = useState<ImprintMethodConfiguration[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'pricing', 'constraints']);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const createNewConfiguration = (methodValue: string) => {
    const method = IMPRINT_METHODS.find(m => m.value === methodValue);
    if (!method) return;

    const newConfig: ImprintMethodConfiguration = {
      id: Date.now().toString(),
      method: methodValue,
      label: method.label,
      enabled: true,
      description: '',
      pricingTiers: [
        { minQuantity: 1, maxQuantity: 24, basePrice: 5.00, setupFee: 50.00 },
        { minQuantity: 25, maxQuantity: 99, basePrice: 4.00, setupFee: 50.00 },
        { minQuantity: 100, maxQuantity: 499, basePrice: 3.00, setupFee: 50.00 },
        { minQuantity: 500, maxQuantity: 9999, basePrice: 2.50, setupFee: 50.00 }
      ],
      sizeCapabilities: {
        maxWidth: 12,
        maxHeight: 16,
        minWidth: 1,
        minHeight: 1
      },
      colorConstraints: {
        maxColors: methodValue === 'embroidery' ? 15 : 4,
        unlimitedColors: methodValue === 'dtg' || methodValue === 'sublimation',
        additionalColorFee: 1.00,
        supportedInkTypes: ['Standard', 'Metallic', 'Glow-in-Dark']
      },
      quantityConstraints: {
        minimumQuantity: 1,
        maximumQuantity: 10000,
        optimalQuantityRange: { min: 25, max: 500 }
      },
      garmentCompatibility: {
        supportedGarmentTypes: ['tshirt', 'polo', 'hoodie'] as GarmentType[],
        supportedSizes: ['S', 'M', 'L', 'XL', 'XXL'] as GarmentSize[],
        supportedPlacements: ['front_center', 'back_center', 'front_left_chest'] as ImprintPlacement[]
      },
      equipmentMapping: {
        secondaryEquipmentIds: [],
        preferredEquipmentType: methodValue,
        setupRequirements: []
      },
      qualityStandards: {
        artworkRequirements: method.requirements || [],
        proofingRequired: true,
        qualityCheckpoints: ['Pre-production approval', 'First piece inspection'],
        tolerances: {
          positionTolerance: 0.125,
          sizeTolerance: 5,
          colorTolerance: 'Delta E <3'
        }
      },
      turnaroundTimes: {
        standardTurnaround: 7,
        rushTurnaround: 3,
        rushFee: 50,
        expeditedOptions: [
          { days: 1, surcharge: 100 },
          { days: 2, surcharge: 75 }
        ]
      },
      customerArtTypes: method.customerArtTypes,
      productionFileTypes: method.productionFileTypes,
      artworkInstructions: method.instructions,
      technicalRequirements: method.requirements || [],
      specialOptions: {
        oversizeCapable: false,
        oversizeSurcharge: 25,
        difficultPlacementSurcharge: 15
      },
      aiPricingEnabled: true,
      constraintValidationEnabled: true,
      autoEquipmentSelection: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConfigurations(prev => [...prev, newConfig]);
    setActiveTab(newConfig.id);
    setIsAddDialogOpen(false);
    setSelectedMethod('');
  };

  const handleAddMethod = () => {
    if (selectedMethod) {
      createNewConfiguration(selectedMethod);
    }
  };

  const getMethodSpecificFields = (methodValue: string) => {
    switch (methodValue) {
      case 'screen_printing':
        return (
          <div className="space-y-8">
            {/* Screen Printing Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Screen Printing Information</h3>
                <p className="text-sm text-muted-foreground">Fill out this page if you offer screen printing. Skip if you don't.</p>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Select the screen printing inks / specialties you offer.</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Plastisol (Industry Standard)',
                    'Water Based',
                    'Discharge',
                    'Puff Ink',
                    'High Density',
                    'Glitter',
                    'Silicone',
                    'Metallic',
                    'Shimmer',
                    'Foil',
                    'Reflective',
                    'Glow in the Dark',
                    'Flocking',
                    'Other'
                  ].map((ink) => (
                    <div key={ink} className="flex items-center space-x-2">
                      <Checkbox id={ink} />
                      <Label htmlFor={ink} className="text-sm">{ink}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Capability Questions */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Are you good at simulated process screen printing?</Label>
                  <RadioGroup defaultValue="no" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sim-yes" />
                      <Label htmlFor="sim-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sim-no" />
                      <Label htmlFor="sim-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {[
                  'Do you print over zippers?',
                  'Do you print over hoodie pockets?',
                  'Do you print off the bottom edge of shirts?',
                  'Do you print on t-shirt pockets?',
                  'Do you print on sleeves?',
                  'Do you print neck labels?',
                  'Do you offer over sized / all over prints?',
                  'Do you print on foam trucker caps?',
                  'Do you print on kid or infant shirts?'
                ].map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-sm font-medium">{question}</Label>
                    <RadioGroup defaultValue="no" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`q${index}-yes`} />
                        <Label htmlFor={`q${index}-yes`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`q${index}-no`} />
                        <Label htmlFor={`q${index}-no`}>No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxColors" className="text-sm font-medium">Maximum Colors (Screens)</Label>
                <Input
                  id="maxColors"
                  type="number"
                  placeholder="Enter maximum colors"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">What's the max number of colors / screens you can print?</p>
              </div>

              <div>
                <Label htmlFor="inkColorNotes" className="text-sm font-medium">Ink Color Additional Notes</Label>
                <Textarea
                  id="inkColorNotes"
                  placeholder="Any additional notes about ink colors..."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxWidth" className="text-sm font-medium">Maximum Width in Inches</Label>
                  <Input
                    id="maxWidth"
                    type="number"
                    placeholder="Width"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxHeight" className="text-sm font-medium">Maximum Height in Inches</Label>
                  <Input
                    id="maxHeight"
                    type="number"
                    placeholder="Height"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxSleeveWidth" className="text-sm font-medium">Maximum Sleeve Width</Label>
                  <Input
                    id="maxSleeveWidth"
                    type="number"
                    placeholder="Sleeve Width"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxSleeveHeight" className="text-sm font-medium">Maximum Sleeve Height</Label>
                  <Input
                    id="maxSleeveHeight"
                    type="number"
                    placeholder="Sleeve Height"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logoSizeNotes" className="text-sm font-medium">Logo size additional notes</Label>
                <Textarea
                  id="logoSizeNotes"
                  placeholder="Any additional notes about logo sizing..."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minOrderQty" className="text-sm font-medium">Minimum Order Quantity</Label>
                  <Input
                    id="minOrderQty"
                    type="number"
                    placeholder="Min quantity"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxOrderQty" className="text-sm font-medium">Maximum Order Quantity</Label>
                  <Input
                    id="maxOrderQty"
                    type="number"
                    placeholder="Max quantity"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dailyCapacity" className="text-sm font-medium">Daily Capacity</Label>
                  <Input
                    id="dailyCapacity"
                    type="number"
                    placeholder="Daily capacity"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="damageRate" className="text-sm font-medium">Damage Rate %</Label>
                  <Input
                    id="damageRate"
                    type="number"
                    placeholder="Damage rate"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Turnaround Times */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Screen Printing Production Turnaround Times</h3>
                <p className="text-sm text-muted-foreground">
                  How many business days does it take you to produce screen printing orders? Don't include shipping time here - 
                  that's handled elsewhere. If you don't offer rush, you can delete those rows.
                </p>
              </div>
              
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Days</th>
                      <th className="text-left p-3 font-medium">Extra Charge %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Standard</td>
                      <td className="p-3">
                        <Input type="number" placeholder="Days" className="w-20" />
                      </td>
                      <td className="p-3">0%</td>
                    </tr>
                    {['Rush 1', 'Rush 2', 'Rush 3'].map((type) => (
                      <tr key={type} className="border-b last:border-b-0">
                        <td className="p-3">{type}</td>
                        <td className="p-3">
                          <Input type="number" placeholder="Days" className="w-20" />
                        </td>
                        <td className="p-3">
                          <Input type="number" placeholder="%" className="w-20" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing Grid</h3>
              
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Add Quantity Range</Button>
                  <Button variant="outline" size="sm">Add Color Count</Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="border p-2 text-left">Quantity</th>
                        <th className="border p-2 text-center">1 Color</th>
                        <th className="border p-2 text-center">2 Colors</th>
                        <th className="border p-2 text-center">3 Colors</th>
                        <th className="border p-2 text-center">4+ Colors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['12-23', '24-47', '48-71', '72-143', '144-287', '288+'].map((qty) => (
                        <tr key={qty}>
                          <td className="border p-2 font-medium">{qty}</td>
                          {[1, 2, 3, 4].map((color) => (
                            <td key={color} className="border p-1">
                              <Input type="number" placeholder="$0.00" className="text-center" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Fees and Extra Charges */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Fees</h3>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Price</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3" colSpan={3}>
                          <p className="text-sm text-muted-foreground">No fees added yet</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button variant="outline" size="sm" className="mt-2">Add Fee</Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Extra Charges</h3>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Price</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3" colSpan={3}>
                          <p className="text-sm text-muted-foreground">No extra charges added yet</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button variant="outline" size="sm" className="mt-2">Add Extra Charge</Button>
              </div>

              <div>
                <Label htmlFor="extraNotes" className="text-sm font-medium">Extra Notes</Label>
                <Textarea
                  id="extraNotes"
                  placeholder="Any additional notes..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );
      case 'embroidery':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thread Weight</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="40wt">40wt (Standard)</SelectItem>
                    <SelectItem value="60wt">60wt (Fine Detail)</SelectItem>
                    <SelectItem value="12wt">12wt (Bold/Heavy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Stitch Density</Label>
                <Input placeholder="e.g., 4.5mm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hoop Sizes Available</Label>
              <Textarea placeholder="4x4, 5x7, 6x10..." />
            </div>
          </div>
        );
      case 'dtg':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pretreatment Required</Label>
              <Switch />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Print Resolution</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select DPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1200">1200 DPI</SelectItem>
                    <SelectItem value="1440">1440 DPI</SelectItem>
                    <SelectItem value="2880">2880 DPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fabric Limitations</Label>
                <Textarea placeholder="100% cotton, cotton blends..." />
              </div>
            </div>
          </div>
        );
      case 'heat_transfer':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Temperature (°F)</Label>
                <Input placeholder="e.g., 350" />
              </div>
              <div className="space-y-2">
                <Label>Pressure (PSI)</Label>
                <Input placeholder="e.g., 40" />
              </div>
              <div className="space-y-2">
                <Label>Time (seconds)</Label>
                <Input placeholder="e.g., 15" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Material Types</Label>
              <Textarea placeholder="Vinyl, flex, flock..." />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const updateConfiguration = (id: string, updates: Partial<ImprintMethodConfiguration>) => {
    setConfigurations(prev => 
      prev.map(config => 
        config.id === id 
          ? { ...config, ...updates, updatedAt: new Date() }
          : config
      )
    );
  };

  const selectedConfig = configurations.find(c => c.id === activeTab);
  const availableMethods = IMPRINT_METHODS.filter(method => 
    !configurations.some(config => config.method === method.value)
  );

  const deleteConfiguration = (id: string) => {
    setConfigurations(prev => prev.filter(config => config.id !== id));
    if (activeTab === id) {
      setActiveTab(configurations.length > 1 ? configurations[0].id : '');
    }
  };

  const duplicateConfiguration = (id: string) => {
    const configToDuplicate = configurations.find(c => c.id === id);
    if (configToDuplicate) {
      const newConfig = {
        ...configToDuplicate,
        id: Date.now().toString(),
        label: `${configToDuplicate.label} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setConfigurations(prev => [...prev, newConfig]);
      setActiveTab(newConfig.id);
    }
  };

  return (
    <div className="space-y-6">

      {/* Add Method Button */}
      {availableMethods.length > 0 && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Imprint Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Imprint Method</DialogTitle>
              <DialogDescription>
                Select an imprint method and configure its specific settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Imprint Method</Label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an imprint method" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg z-50">
                    {availableMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedMethod && (
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-4">Method-Specific Configuration</h4>
                    {getMethodSpecificFields(selectedMethod)}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedMethod('');
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddMethod}
                disabled={!selectedMethod}
              >
                Add Method
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Configured Methods Tabs */}
      {configurations.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              {configurations.slice(0, 4).map(config => (
                <TabsTrigger key={config.id} value={config.id} className="relative">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{config.label}</span>
                    <Badge 
                      variant={config.enabled ? 'default' : 'secondary'} 
                      className="h-4 w-4 p-0 text-xs"
                    >
                      {config.enabled ? '●' : '○'}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {selectedConfig && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => duplicateConfiguration(selectedConfig.id)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteConfiguration(selectedConfig.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {configurations.map(config => (
            <TabsContent key={config.id} value={config.id} className="space-y-6">
              <div className="space-y-6">
              {/* Basic Settings */}
              <Collapsible 
                open={expandedSections.includes('basic')}
                onOpenChange={() => toggleSection('basic')}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          <CardTitle>Basic Settings</CardTitle>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Method Name</Label>
                          <Input 
                            value={config.label}
                            onChange={(e) => updateConfiguration(config.id, { label: e.target.value })}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={config.enabled}
                            onCheckedChange={(enabled) => updateConfiguration(config.id, { enabled })}
                          />
                          <Label>Method Enabled</Label>
                        </div>
                      </div>
                        <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={config.description}
                          onChange={(e) => updateConfiguration(config.id, { description: e.target.value })}
                          placeholder="Brief description of this imprint method..."
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Pricing Configuration */}
              <Collapsible 
                open={expandedSections.includes('pricing')}
                onOpenChange={() => toggleSection('pricing')}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          <CardTitle>Pricing Matrix</CardTitle>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Quantity Pricing Tiers</h4>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tier
                          </Button>
                        </div>
                         <div className="overflow-x-auto">
                           <table className="w-full border rounded-lg text-sm">
                             <thead>
                               <tr className="border-b bg-muted/50">
                                 <th className="text-left p-4 w-32">Quantity Range</th>
                                 <th className="text-left p-4 w-28">Base Price</th>
                                 <th className="text-left p-4 w-28">Setup Fee</th>
                                 <th className="text-left p-4 w-32">Additional Color</th>
                                 <th className="text-left p-4 w-32">Rush Fee (%)</th>
                                 <th className="text-left p-4 w-20">Actions</th>
                               </tr>
                             </thead>
                             <tbody>
                               {config.pricingTiers.map((tier, index) => (
                                 <tr key={index} className="border-b hover:bg-muted/25">
                                   <td className="p-4">
                                     <div className="flex gap-2 items-center">
                                       <Input 
                                         className="w-16 h-8" 
                                         type="number" 
                                         value={tier.minQuantity}
                                         onChange={(e) => {
                                           const newTiers = [...config.pricingTiers];
                                           newTiers[index].minQuantity = parseInt(e.target.value);
                                           updateConfiguration(config.id, { pricingTiers: newTiers });
                                         }}
                                       />
                                       <span className="text-muted-foreground">-</span>
                                       <Input 
                                         className="w-16 h-8" 
                                         type="number" 
                                         value={tier.maxQuantity}
                                         onChange={(e) => {
                                           const newTiers = [...config.pricingTiers];
                                           newTiers[index].maxQuantity = parseInt(e.target.value);
                                           updateConfiguration(config.id, { pricingTiers: newTiers });
                                         }}
                                       />
                                     </div>
                                   </td>
                                   <td className="p-4">
                                     <div className="flex items-center gap-1">
                                       <span className="text-muted-foreground">$</span>
                                       <Input 
                                         className="w-20 h-8" 
                                         type="number" 
                                         step="0.01"
                                         value={tier.basePrice}
                                         onChange={(e) => {
                                           const newTiers = [...config.pricingTiers];
                                           newTiers[index].basePrice = parseFloat(e.target.value);
                                           updateConfiguration(config.id, { pricingTiers: newTiers });
                                         }}
                                       />
                                     </div>
                                   </td>
                                   <td className="p-4">
                                     <div className="flex items-center gap-1">
                                       <span className="text-muted-foreground">$</span>
                                       <Input 
                                         className="w-20 h-8" 
                                         type="number" 
                                         step="0.01"
                                         value={tier.setupFee}
                                         onChange={(e) => {
                                           const newTiers = [...config.pricingTiers];
                                           newTiers[index].setupFee = parseFloat(e.target.value);
                                           updateConfiguration(config.id, { pricingTiers: newTiers });
                                         }}
                                       />
                                     </div>
                                   </td>
                                   <td className="p-4">
                                     <div className="flex items-center gap-1">
                                       <span className="text-muted-foreground">$</span>
                                       <Input 
                                         className="w-20 h-8" 
                                         type="number" 
                                         step="0.01"
                                         value={tier.additionalColorPrice || 0}
                                         onChange={(e) => {
                                           const newTiers = [...config.pricingTiers];
                                           newTiers[index].additionalColorPrice = parseFloat(e.target.value);
                                           updateConfiguration(config.id, { pricingTiers: newTiers });
                                         }}
                                       />
                                     </div>
                                   </td>
                                   <td className="p-4">
                                     <div className="flex items-center gap-1">
                                       <Input 
                                         className="w-16 h-8" 
                                         type="number" 
                                         value={tier.rushSurcharge || 0}
                                         onChange={(e) => {
                                           const newTiers = [...config.pricingTiers];
                                           newTiers[index].rushSurcharge = parseFloat(e.target.value);
                                           updateConfiguration(config.id, { pricingTiers: newTiers });
                                         }}
                                       />
                                       <span className="text-muted-foreground">%</span>
                                     </div>
                                   </td>
                                   <td className="p-4">
                                     <Button 
                                       size="sm" 
                                       variant="ghost"
                                       onClick={() => {
                                         const newTiers = config.pricingTiers.filter((_, i) => i !== index);
                                         updateConfiguration(config.id, { pricingTiers: newTiers });
                                       }}
                                     >
                                       <Trash2 className="h-4 w-4" />
                                     </Button>
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Size & Color Constraints */}
              <Collapsible 
                open={expandedSections.includes('constraints')}
                onOpenChange={() => toggleSection('constraints')}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-5 w-5" />
                          <CardTitle>Size & Color Constraints</CardTitle>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Size Capabilities</h4>
                        <div className="grid grid-cols-4 gap-4">
                           <div className="space-y-2">
                             <Label>Max Width (inches)</Label>
                             <Input 
                               type="number"
                               value={config.sizeCapabilities.maxWidth}
                               onChange={(e) => updateConfiguration(config.id, {
                                 sizeCapabilities: {
                                   ...config.sizeCapabilities,
                                   maxWidth: parseFloat(e.target.value)
                                 }
                               })}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label>Max Height (inches)</Label>
                             <Input 
                               type="number"
                               value={config.sizeCapabilities.maxHeight}
                               onChange={(e) => updateConfiguration(config.id, {
                                 sizeCapabilities: {
                                   ...config.sizeCapabilities,
                                   maxHeight: parseFloat(e.target.value)
                                 }
                               })}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label>Min Width (inches)</Label>
                             <Input 
                               type="number"
                               value={config.sizeCapabilities.minWidth}
                               onChange={(e) => updateConfiguration(config.id, {
                                 sizeCapabilities: {
                                   ...config.sizeCapabilities,
                                   minWidth: parseFloat(e.target.value)
                                 }
                               })}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label>Min Height (inches)</Label>
                             <Input 
                               type="number"
                               value={config.sizeCapabilities.minHeight}
                               onChange={(e) => updateConfiguration(config.id, {
                                 sizeCapabilities: {
                                   ...config.sizeCapabilities,
                                   minHeight: parseFloat(e.target.value)
                                 }
                               })}
                             />
                           </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Color Constraints</h4>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="space-y-2">
                             <div className="flex items-center space-x-2">
                               <Switch 
                                 checked={config.colorConstraints.unlimitedColors}
                                 onCheckedChange={(unlimitedColors) => updateConfiguration(config.id, {
                                   colorConstraints: {
                                     ...config.colorConstraints,
                                     unlimitedColors
                                   }
                                 })}
                               />
                               <Label>Unlimited Colors</Label>
                             </div>
                           </div>
                           {!config.colorConstraints.unlimitedColors && (
                             <div className="space-y-2">
                               <Label>Max Colors</Label>
                               <Input 
                                 type="number"
                                 value={config.colorConstraints.maxColors}
                                 onChange={(e) => updateConfiguration(config.id, {
                                   colorConstraints: {
                                     ...config.colorConstraints,
                                     maxColors: parseInt(e.target.value)
                                   }
                                 })}
                               />
                             </div>
                           )}
                           <div className="space-y-2">
                             <Label>Additional Color Fee</Label>
                             <Input 
                               type="number"
                               step="0.01"
                               value={config.colorConstraints.additionalColorFee}
                               onChange={(e) => updateConfiguration(config.id, {
                                 colorConstraints: {
                                   ...config.colorConstraints,
                                   additionalColorFee: parseFloat(e.target.value)
                                 }
                               })}
                             />
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </CollapsibleContent>
                 </Card>
               </Collapsible>

               {/* Save Button */}
               <div className="flex justify-end gap-2">
                 <Button variant="outline">
                   <RefreshCw className="h-4 w-4 mr-2" />
                   Reset to Defaults
                 </Button>
                 <Button>
                   <Save className="h-4 w-4 mr-2" />
                   Save Configuration
                 </Button>
               </div>
               </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {configurations.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Settings className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Get Started</h3>
              <p className="text-muted-foreground">
                Add your first imprint method using the buttons above
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}