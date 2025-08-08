import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Plus, 
  Copy, 
  Trash2, 
  Save, 
  RefreshCw,
  Cog,
  Palette
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

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

  const updateConfiguration = (id: string, updates: Partial<ImprintMethodConfiguration>) => {
    setConfigurations(prev =>
      prev.map(config =>
        config.id === id ? { ...config, ...updates, updatedAt: new Date() } : config
      )
    );
  };

  const deleteConfiguration = (id: string) => {
    setConfigurations(prev => prev.filter(config => config.id !== id));
    if (activeTab === id && configurations.length > 1) {
      const remainingConfigs = configurations.filter(config => config.id !== id);
      setActiveTab(remainingConfigs[0]?.id || '');
    } else if (configurations.length === 1) {
      setActiveTab('');
    }
  };

  const duplicateConfiguration = (id: string) => {
    const configToDuplicate = configurations.find(config => config.id === id);
    if (!configToDuplicate) return;

    const duplicatedConfig: ImprintMethodConfiguration = {
      ...configToDuplicate,
      id: Date.now().toString(),
      label: `${configToDuplicate.label} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConfigurations(prev => [...prev, duplicatedConfig]);
    setActiveTab(duplicatedConfig.id);
  };

  const handleAddMethod = () => {
    if (selectedMethod) {
      createNewConfiguration(selectedMethod);
    }
  };

  const renderScreenPrintingForm = (config: ImprintMethodConfiguration) => {
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
                  <tr className="border-b">
                    <td className="p-3">Vectorizing</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Set Up</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Screens</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Colour Separations</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Print Sample</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                  <tr className="border-b">
                    <td className="p-3">Oversized Print</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Sleeve Print</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Print on Fleece</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Water Based Ink</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Discharge Ink</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Puff Ink</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">High Density</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Glitter</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Silicone</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Metallic</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Shimmer</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Foil</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Reflective</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Glow in the Dark</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Flocking</td>
                    <td className="p-3">
                      <Input type="number" placeholder="$0.00" className="w-24" />
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
              placeholder="Any additional notes or special considerations..."
              className="mt-1"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    );
  };

  const selectedConfig = configurations.find(config => config.id === activeTab);
  const availableMethods = IMPRINT_METHODS.filter(
    method => !configurations.find(config => config.method === method.value)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Imprint Method Configuration</h2>
          <p className="text-muted-foreground">Configure your available imprint methods and their settings</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Imprint Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Imprint Method</DialogTitle>
              <DialogDescription>
                Select an imprint method to configure for your business
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Select Imprint Method</Label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an imprint method" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center">
                          <Palette className="mr-2 h-4 w-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMethod} disabled={!selectedMethod}>
                Add Method
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {configurations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Imprint Methods Configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first imprint method. Configure pricing, capabilities, and constraints for each method you offer.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full grid-cols-auto gap-2">
              {configurations.map((config) => (
                <TabsTrigger
                  key={config.id}
                  value={config.id}
                  className="flex items-center space-x-2"
                >
                  <Palette className="h-4 w-4" />
                  <span>{config.label}</span>
                  <Badge variant={config.enabled ? 'default' : 'secondary'} className="ml-2">
                    {config.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {selectedConfig && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateConfiguration(selectedConfig.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteConfiguration(selectedConfig.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {configurations.map((config) => (
            <TabsContent key={config.id} value={config.id} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Palette className="h-6 w-6" />
                  <div>
                    <h1 className="text-2xl font-bold">{config.label}</h1>
                    <p className="text-muted-foreground">Configure your {config.label.toLowerCase()} settings</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(enabled) => updateConfiguration(config.id, { enabled })}
                  />
                  <Label>{config.enabled ? 'Active' : 'Inactive'}</Label>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {config.method === 'screenPrinting' && renderScreenPrintingForm(config)}
                  {config.method !== 'screenPrinting' && (
                    <div className="text-center py-12">
                      <Cog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Configuration Form Coming Soon</h3>
                      <p className="text-muted-foreground">
                        Detailed configuration forms for {config.label} will be added soon.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}