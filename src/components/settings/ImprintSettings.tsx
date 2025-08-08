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
  Palette,
  Printer,
  Ruler,
  Package,
  Clock,
  DollarSign,
  Receipt,
  Settings,
  HelpCircle,
  Minus,
  Trash
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [customInkSpecialties, setCustomInkSpecialties] = useState<string[]>([]);
  const [newInkSpecialty, setNewInkSpecialty] = useState('');
  const [customThreadSpecialties, setCustomThreadSpecialties] = useState<string[]>([]);
  const [newThreadSpecialty, setNewThreadSpecialty] = useState('');
  const [extraCharges, setExtraCharges] = useState<Array<{name: string, price: string}>>([
    { name: 'Oversized Print', price: '' },
    { name: 'Sleeve Print', price: '' },
    { name: 'Print on Fleece', price: '' },
    { name: 'Water Based Ink', price: '' },
    { name: 'Discharge Ink', price: '' },
    { name: 'Puff Ink', price: '' },
    { name: 'High Density', price: '' },
    { name: 'Glitter', price: '' },
    { name: 'Silicone', price: '' },
    { name: 'Metallic', price: '' },
    { name: 'Shimmer', price: '' },
    { name: 'Foil', price: '' },
    { name: 'Reflective', price: '' },
    { name: 'Glow in the Dark', price: '' },
    { name: 'Flocking', price: '' }
  ]);

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

  const addCustomInkSpecialty = () => {
    if (newInkSpecialty.trim() && !customInkSpecialties.includes(newInkSpecialty.trim())) {
      const specialty = newInkSpecialty.trim();
      setCustomInkSpecialties(prev => [...prev, specialty]);
      
      // Automatically add to extra charges if not already there
      const existsInExtraCharges = extraCharges.some(charge => charge.name.toLowerCase() === specialty.toLowerCase());
      if (!existsInExtraCharges) {
        setExtraCharges(prev => [...prev, { name: specialty, price: '' }]);
      }
      
      setNewInkSpecialty('');
    }
  };

  const removeCustomInkSpecialty = (specialty: string) => {
    setCustomInkSpecialties(prev => prev.filter(s => s !== specialty));
  };

  const addCustomThreadSpecialty = () => {
    if (newThreadSpecialty.trim() && !customThreadSpecialties.includes(newThreadSpecialty.trim())) {
      const specialty = newThreadSpecialty.trim();
      setCustomThreadSpecialties(prev => [...prev, specialty]);
      
      // Automatically add to extra charges if not already there
      const existsInExtraCharges = extraCharges.some(charge => charge.name.toLowerCase() === specialty.toLowerCase());
      if (!existsInExtraCharges) {
        setExtraCharges(prev => [...prev, { name: specialty, price: '' }]);
      }
      
      setNewThreadSpecialty('');
    }
  };

  const removeCustomThreadSpecialty = (specialty: string) => {
    setCustomThreadSpecialties(prev => prev.filter(s => s !== specialty));
  };

  const handleAddMethod = () => {
    if (selectedMethod) {
      createNewConfiguration(selectedMethod);
    }
  };

  const renderScreenPrintingForm = (config: ImprintMethodConfiguration) => {
    const standardInkTypes = [
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
      'Flocking'
    ];

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
              {standardInkTypes.map((ink) => (
                <div key={ink} className="flex items-center space-x-2">
                  <Checkbox id={ink} />
                  <Label htmlFor={ink} className="text-sm">{ink}</Label>
                </div>
              ))}
              
              {/* Custom ink specialties */}
              {customInkSpecialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox id={specialty} />
                  <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomInkSpecialty(specialty)}
                    className="h-6 w-6 p-0 ml-auto"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Add custom ink specialty */}
            <div className="flex items-center space-x-2 mt-3">
              <Input
                placeholder="Add custom ink specialty..."
                value={newInkSpecialty}
                onChange={(e) => setNewInkSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomInkSpecialty();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={addCustomInkSpecialty}
                variant="outline"
                size="sm"
                disabled={!newInkSpecialty.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
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
                  {extraCharges.map((charge, index) => (
                    <tr key={charge.name} className="border-b">
                      <td className="p-3">{charge.name}</td>
                      <td className="p-3">
                        <Input 
                          type="number" 
                          placeholder="$0.00" 
                          className="w-24"
                          value={charge.price}
                          onChange={(e) => {
                            const newCharges = [...extraCharges];
                            newCharges[index].price = e.target.value;
                            setExtraCharges(newCharges);
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setExtraCharges(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                const chargeName = prompt('Enter charge name:');
                if (chargeName && chargeName.trim()) {
                  setExtraCharges(prev => [...prev, { name: chargeName.trim(), price: '' }]);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Charge
            </Button>
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

  const renderEmbroideryForm = (config: ImprintMethodConfiguration) => {
    const standardThreadTypes = [
      'Rayon',
      'Cotton',
      'Polyester',
      'Metallic',
      '3D Puff',
      'Appliqué',
      'Glow in the Dark Thread',
      'Reflective Thread'
    ];

    return (
      <div className="space-y-8">
        {/* Embroidery Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Embroidery Information</h3>
            <p className="text-sm text-muted-foreground">Fill out this page if you offer embroidery. Skip if you don't.</p>
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-medium">Select the embroidery thread types / specialties you offer.</Label>
            <div className="grid grid-cols-2 gap-3">
              {standardThreadTypes.map((thread) => (
                <div key={thread} className="flex items-center space-x-2">
                  <Checkbox id={thread} />
                  <Label htmlFor={thread} className="text-sm">{thread}</Label>
                </div>
              ))}
              
              {/* Custom thread specialties */}
              {customThreadSpecialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox id={specialty} />
                  <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomThreadSpecialty(specialty)}
                    className="h-6 w-6 p-0 ml-auto"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Add custom thread specialty */}
            <div className="flex items-center space-x-2 mt-3">
              <Input
                placeholder="Add custom thread specialty..."
                value={newThreadSpecialty}
                onChange={(e) => setNewThreadSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomThreadSpecialty();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={addCustomThreadSpecialty}
                variant="outline"
                size="sm"
                disabled={!newThreadSpecialty.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Capability Questions */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Do you embroider individual sleeve names?</Label>
              <RadioGroup defaultValue="no" className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="sleeve-names-yes" />
                  <Label htmlFor="sleeve-names-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="sleeve-names-no" />
                  <Label htmlFor="sleeve-names-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="maxLogoColors" className="text-sm font-medium">Maximum Logo Colors</Label>
            <Input
              id="maxLogoColors"
              type="number"
              placeholder="Enter maximum colors"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">What's the max number of colors you can embroider?</p>
          </div>

          <div>
            <Label htmlFor="threadColorNotes" className="text-sm font-medium">Thread Colors Additional Notes</Label>
            <Textarea
              id="threadColorNotes"
              placeholder="Any additional notes about thread colors..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxEmbWidth" className="text-sm font-medium">Maximum Width in Inches</Label>
              <Input
                id="maxEmbWidth"
                type="number"
                placeholder="Width"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxEmbHeight" className="text-sm font-medium">Maximum Height in Inches</Label>
              <Input
                id="maxEmbHeight"
                type="number"
                placeholder="Height"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxEmbSleeveWidth" className="text-sm font-medium">Maximum Sleeve Width</Label>
              <Input
                id="maxEmbSleeveWidth"
                type="number"
                placeholder="Sleeve Width"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxEmbSleeveHeight" className="text-sm font-medium">Maximum Sleeve Height</Label>
              <Input
                id="maxEmbSleeveHeight"
                type="number"
                placeholder="Sleeve Height"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="embLogoSizeNotes" className="text-sm font-medium">Logo size additional notes</Label>
            <Textarea
              id="embLogoSizeNotes"
              placeholder="Any additional notes about logo sizing..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="embMinOrderQty" className="text-sm font-medium">Minimum Order Quantity</Label>
              <Input
                id="embMinOrderQty"
                type="number"
                placeholder="Min quantity"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="embMaxOrderQty" className="text-sm font-medium">Maximum Order Quantity</Label>
              <Input
                id="embMaxOrderQty"
                type="number"
                placeholder="Max quantity"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="embDailyCapacity" className="text-sm font-medium">Daily Capacity</Label>
              <Input
                id="embDailyCapacity"
                type="number"
                placeholder="Daily capacity"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="embDamageRate" className="text-sm font-medium">Damage Rate %</Label>
              <Input
                id="embDamageRate"
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
            <h3 className="text-lg font-semibold">Embroidery Production Turnaround Times</h3>
            <p className="text-sm text-muted-foreground">
              How many business days does it take you to produce embroidery orders? Don't include shipping time here - 
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

        {/* Embroidery Pricing Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Embroidery Pricing Grid</h3>
          
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Add Quantity Range</Button>
              <Button variant="outline" size="sm">Add Stitch Range</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="border p-2 text-left">Stitch Count</th>
                    <th className="border p-2 text-center">0-7000</th>
                    <th className="border p-2 text-center">7001-8000</th>
                    <th className="border p-2 text-center">8001-9000</th>
                    <th className="border p-2 text-center">9001-10000</th>
                    <th className="border p-2 text-center">10001+</th>
                  </tr>
                </thead>
                <tbody>
                  {['12-24', '25-50', '51-100', '101-250', '251-500', '501+'].map((stitches) => (
                    <tr key={stitches}>
                      <td className="border p-2 font-medium">{stitches}</td>
                      {['0-7000', '7001-8000', '8001-9000', '9001-10000', '10001+'].map((qty) => (
                        <td key={qty} className="border p-1">
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
                    <td className="p-3">Digitizing</td>
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
                    <td className="p-3">Sew Out Sample</td>
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
                    <td className="p-3">Artwork Adjustments</td>
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
                    <td className="p-3">Names</td>
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
                  {/* Default embroidery-specific extra charges */}
                  {[
                    'Metallic Thread',
                    '3D Puff', 
                    'Appliqué',
                    'Glow in the Dark Thread',
                    'Rayon Thread',
                    'Reflective Thread'
                  ].map((charge) => (
                    <tr key={charge} className="border-b">
                      <td className="p-3">{charge}</td>
                      <td className="p-3">
                        <Input type="number" placeholder="$0.00" className="w-24" />
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Custom thread specialties that were added */}
                  {customThreadSpecialties.map((specialty) => (
                    <tr key={specialty} className="border-b">
                      <td className="p-3">{specialty}</td>
                      <td className="p-3">
                        <Input type="number" placeholder="$0.00" className="w-24" />
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                const chargeName = prompt('Enter charge name:');
                if (chargeName && chargeName.trim()) {
                  setExtraCharges(prev => [...prev, { name: chargeName.trim(), price: '' }]);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Charge
            </Button>
          </div>

          <div>
            <Label htmlFor="embExtraNotes" className="text-sm font-medium">Extra Notes</Label>
            <Textarea
              id="embExtraNotes"
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

  const renderDTGForm = (config: ImprintMethodConfiguration) => {
    const currentMethod = IMPRINT_METHODS.find(method => method.value === config.method);
    if (!currentMethod) return null;

    return (
      <div className="space-y-8">
        {/* DTG Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">DTG Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Do you print over zippers?</Label>
              <RadioGroup
                value={config.capabilities?.printOverZippers ? 'yes' : 'no'}
                onValueChange={(value) => updateConfiguration(config.id!, {
                  capabilities: { ...config.capabilities, printOverZippers: value === 'yes' }
                })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="zippers-yes" />
                  <Label htmlFor="zippers-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="zippers-no" />
                  <Label htmlFor="zippers-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Do you print over hoodie pockets?</Label>
              <RadioGroup
                value={config.capabilities?.printOverPockets ? 'yes' : 'no'}
                onValueChange={(value) => updateConfiguration(config.id!, {
                  capabilities: { ...config.capabilities, printOverPockets: value === 'yes' }
                })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="pockets-yes" />
                  <Label htmlFor="pockets-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="pockets-no" />
                  <Label htmlFor="pockets-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Do you print on sleeves?</Label>
              <RadioGroup
                value={config.capabilities?.printOnSleeves ? 'yes' : 'no'}
                onValueChange={(value) => updateConfiguration(config.id!, {
                  capabilities: { ...config.capabilities, printOnSleeves: value === 'yes' }
                })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="sleeves-yes" />
                  <Label htmlFor="sleeves-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="sleeves-no" />
                  <Label htmlFor="sleeves-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Do you print neck labels?</Label>
              <RadioGroup
                value={config.capabilities?.printNeckLabels ? 'yes' : 'no'}
                onValueChange={(value) => updateConfiguration(config.id!, {
                  capabilities: { ...config.capabilities, printNeckLabels: value === 'yes' }
                })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="neck-labels-yes" />
                  <Label htmlFor="neck-labels-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="neck-labels-no" />
                  <Label htmlFor="neck-labels-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Do you print on infant / kids shirts?</Label>
              <RadioGroup
                value={config.capabilities?.printKidsShirts ? 'yes' : 'no'}
                onValueChange={(value) => updateConfiguration(config.id!, {
                  capabilities: { ...config.capabilities, printKidsShirts: value === 'yes' }
                })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="kids-yes" />
                  <Label htmlFor="kids-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="kids-no" />
                  <Label htmlFor="kids-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Do you print on 50% Cotton 50% Polyester OR only 100% Cotton?</Label>
              <RadioGroup
                value={config.capabilities?.cottonPolyBlend || 'both'}
                onValueChange={(value) => updateConfiguration(config.id!, {
                  capabilities: { ...config.capabilities, cottonPolyBlend: value }
                })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="cotton-both" />
                  <Label htmlFor="cotton-both">Both</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cotton-only" id="cotton-only" />
                  <Label htmlFor="cotton-only">Only 100% Cotton</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Size Limits */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Size Limits</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-max-width" className="text-sm font-medium">Maximum Width in Inches</Label>
                <Input
                  id="dtg-max-width"
                  type="number"
                  step="0.1"
                  value={config.constraints?.dimensions?.maxWidth || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    constraints: {
                      ...config.constraints,
                      dimensions: { ...config.constraints?.dimensions, maxWidth: parseFloat(e.target.value) || 0 }
                    }
                  })}
                  placeholder="e.g., 12"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum printable width for main chest/back prints</p>
              </div>
              <div>
                <Label htmlFor="dtg-max-height" className="text-sm font-medium">Maximum Height in Inches</Label>
                <Input
                  id="dtg-max-height"
                  type="number"
                  step="0.1"
                  value={config.constraints?.dimensions?.maxHeight || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    constraints: {
                      ...config.constraints,
                      dimensions: { ...config.constraints?.dimensions, maxHeight: parseFloat(e.target.value) || 0 }
                    }
                  })}
                  placeholder="e.g., 16"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum printable height for main chest/back prints</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-max-sleeve-width" className="text-sm font-medium">Maximum Sleeve Width in Inches</Label>
                <Input
                  id="dtg-max-sleeve-width"
                  type="number"
                  step="0.1"
                  value={config.constraints?.dimensions?.maxSleeveWidth || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    constraints: {
                      ...config.constraints,
                      dimensions: { ...config.constraints?.dimensions, maxSleeveWidth: parseFloat(e.target.value) || 0 }
                    }
                  })}
                  placeholder="e.g., 3"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum width for sleeve prints</p>
              </div>
              <div>
                <Label htmlFor="dtg-max-sleeve-height" className="text-sm font-medium">Maximum Sleeve Height in Inches</Label>
                <Input
                  id="dtg-max-sleeve-height"
                  type="number"
                  step="0.1"
                  value={config.constraints?.dimensions?.maxSleeveHeight || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    constraints: {
                      ...config.constraints,
                      dimensions: { ...config.constraints?.dimensions, maxSleeveHeight: parseFloat(e.target.value) || 0 }
                    }
                  })}
                  placeholder="e.g., 5"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum height for sleeve prints</p>
              </div>
            </div>

            <div>
              <Label htmlFor="dtg-logo-size-notes" className="text-sm font-medium">Logo size additional notes</Label>
              <Textarea
                id="dtg-logo-size-notes"
                value={config.constraints?.dimensions?.notes || ''}
                onChange={(e) => updateConfiguration(config.id!, {
                  constraints: {
                    ...config.constraints,
                    dimensions: { ...config.constraints?.dimensions, notes: e.target.value }
                  }
                })}
                placeholder="Any additional notes about DTG sizing constraints..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Order Quantities & Capacity */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Order Quantities & Capacity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-min-order-qty" className="text-sm font-medium">Min Order Quantity</Label>
                <Input
                  id="dtg-min-order-qty"
                  type="number"
                  value={config.constraints?.quantity?.min || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    constraints: {
                      ...config.constraints,
                      quantity: { ...config.constraints?.quantity, min: parseInt(e.target.value) || 0 }
                    }
                  })}
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <Label htmlFor="dtg-max-order-qty" className="text-sm font-medium">Max Order Quantity</Label>
                <Input
                  id="dtg-max-order-qty"
                  type="number"
                  value={config.constraints?.quantity?.max || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    constraints: {
                      ...config.constraints,
                      quantity: { ...config.constraints?.quantity, max: parseInt(e.target.value) || 0 }
                    }
                  })}
                  placeholder="e.g., 1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-daily-capacity" className="text-sm font-medium">Daily Capacity (Average Logo)</Label>
                <Input
                  id="dtg-daily-capacity"
                  type="number"
                  value={config.equipment?.dailyCapacity || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    equipment: { ...config.equipment, dailyCapacity: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="e.g., 150"
                />
              </div>
              <div>
                <Label htmlFor="dtg-damage-rate" className="text-sm font-medium">Damage Rate (%)</Label>
                <Input
                  id="dtg-damage-rate"
                  type="number"
                  step="0.1"
                  value={config.quality?.damageRate || ''}
                  onChange={(e) => updateConfiguration(config.id!, {
                    quality: { ...config.quality, damageRate: parseFloat(e.target.value) || 0 }
                  })}
                  placeholder="e.g., 1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Production Times */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">DTG Production Turnaround Times</h3>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Service Type</TableHead>
                  <TableHead className="text-center">Days</TableHead>
                  <TableHead className="text-center">Extra Charge (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Standard</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={config.turnaroundTimes?.standard?.days || ''}
                      onChange={(e) => updateConfiguration(config.id!, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          standard: { 
                            ...config.turnaroundTimes?.standard, 
                            days: parseInt(e.target.value) || 0 
                          }
                        }
                      })}
                      placeholder="5"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">0%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rush (3-4 days)</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={config.turnaroundTimes?.rush?.days || ''}
                      onChange={(e) => updateConfiguration(config.id!, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          rush: { 
                            ...config.turnaroundTimes?.rush, 
                            days: parseInt(e.target.value) || 0 
                          }
                        }
                      })}
                      placeholder="3"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={config.turnaroundTimes?.rush?.extraChargePercent || ''}
                      onChange={(e) => updateConfiguration(config.id!, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          rush: { 
                            ...config.turnaroundTimes?.rush, 
                            extraChargePercent: parseFloat(e.target.value) || 0 
                          }
                        }
                      })}
                      placeholder="25"
                      className="w-20 text-center"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rush (1-2 days)</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={config.turnaroundTimes?.superRush?.days || ''}
                      onChange={(e) => updateConfiguration(config.id!, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          superRush: { 
                            ...config.turnaroundTimes?.superRush, 
                            days: parseInt(e.target.value) || 0 
                          }
                        }
                      })}
                      placeholder="1"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={config.turnaroundTimes?.superRush?.extraChargePercent || ''}
                      onChange={(e) => updateConfiguration(config.id!, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          superRush: { 
                            ...config.turnaroundTimes?.superRush, 
                            extraChargePercent: parseFloat(e.target.value) || 0 
                          }
                        }
                      })}
                      placeholder="50"
                      className="w-20 text-center"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* White Garment Pricing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">White Garment Pricing (Based on Size)</h3>
          </div>
          
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-32">Quantity</TableHead>
                  {config.pricing?.sizeRanges?.map((size, index) => (
                    <TableHead key={index} className="text-center min-w-24">
                      {size.name}
                    </TableHead>
                  )) || [
                    <TableHead key="4x4" className="text-center min-w-24">4"x4"</TableHead>,
                    <TableHead key="10x10" className="text-center min-w-24">10"x10"</TableHead>,
                    <TableHead key="15x15" className="text-center min-w-24">15"x15"</TableHead>
                  ]}
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(config.pricing?.quantityRanges || [
                  { min: 12, max: 24 },
                  { min: 25, max: 50 },
                  { min: 51, max: 100 },
                  { min: 101, max: 500 }
                ]).map((qtyRange, qtyIndex) => (
                  <TableRow key={qtyIndex}>
                    <TableCell className="font-medium">
                      {qtyRange.min}-{qtyRange.max}
                    </TableCell>
                    {(config.pricing?.sizeRanges || [
                      { name: '4"x4"' },
                      { name: '10"x10"' },
                      { name: '15"x15"' }
                    ]).map((_, sizeIndex) => (
                      <TableCell key={sizeIndex} className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={qtyRange.whitePrices?.[sizeIndex] || ''}
                          onChange={(e) => {
                            const newQuantityRanges = [...(config.pricing?.quantityRanges || [])];
                            if (!newQuantityRanges[qtyIndex]) {
                              newQuantityRanges[qtyIndex] = { min: qtyRange.min, max: qtyRange.max };
                            }
                            if (!newQuantityRanges[qtyIndex].whitePrices) {
                              newQuantityRanges[qtyIndex].whitePrices = [];
                            }
                            newQuantityRanges[qtyIndex].whitePrices![sizeIndex] = parseFloat(e.target.value) || 0;
                            updateConfiguration(config.id!, {
                              pricing: { ...config.pricing, quantityRanges: newQuantityRanges }
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newQuantityRanges = config.pricing?.quantityRanges?.filter((_, index) => index !== qtyIndex) || [];
                          updateConfiguration(config.id!, {
                            pricing: { ...config.pricing, quantityRanges: newQuantityRanges }
                          });
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const newSizeRanges = [...(config.pricing?.sizeRanges || [])];
                newSizeRanges.push({ name: 'Custom Size' });
                
                // Add new price column to all quantity ranges
                const newQuantityRanges = config.pricing?.quantityRanges?.map(range => ({
                  ...range,
                  whitePrices: [...(range.whitePrices || []), 0]
                })) || [];
                
                updateConfiguration(config.id!, {
                  pricing: { ...config.pricing, sizeRanges: newSizeRanges, quantityRanges: newQuantityRanges }
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Size Range
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const newQuantityRanges = [...(config.pricing?.quantityRanges || [])];
                const lastRange = newQuantityRanges[newQuantityRanges.length - 1];
                const newMin = lastRange ? lastRange.max + 1 : 1;
                newQuantityRanges.push({ 
                  min: newMin, 
                  max: newMin + 999,
                  whitePrices: new Array((config.pricing?.sizeRanges || []).length || 3).fill(0),
                  coloredPrices: new Array((config.pricing?.sizeRanges || []).length || 3).fill(0)
                });
                
                updateConfiguration(config.id!, {
                  pricing: { ...config.pricing, quantityRanges: newQuantityRanges }
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Quantity Range
            </Button>
          </div>
        </div>

        {/* Colored Garment Pricing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Colored Garment Pricing (Based on Size)</h3>
          </div>
          
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-32">Quantity</TableHead>
                  {(config.pricing?.sizeRanges || [
                    { name: '4"x4"' },
                    { name: '10"x10"' },
                    { name: '15"x15"' }
                  ]).map((size, index) => (
                    <TableHead key={index} className="text-center min-w-24">
                      {size.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(config.pricing?.quantityRanges || [
                  { min: 12, max: 24 },
                  { min: 25, max: 50 },
                  { min: 51, max: 100 },
                  { min: 101, max: 500 }
                ]).map((qtyRange, qtyIndex) => (
                  <TableRow key={qtyIndex}>
                    <TableCell className="font-medium">
                      {qtyRange.min}-{qtyRange.max}
                    </TableCell>
                    {(config.pricing?.sizeRanges || [
                      { name: '4"x4"' },
                      { name: '10"x10"' },
                      { name: '15"x15"' }
                    ]).map((_, sizeIndex) => (
                      <TableCell key={sizeIndex} className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={qtyRange.coloredPrices?.[sizeIndex] || ''}
                          onChange={(e) => {
                            const newQuantityRanges = [...(config.pricing?.quantityRanges || [])];
                            if (!newQuantityRanges[qtyIndex]) {
                              newQuantityRanges[qtyIndex] = { min: qtyRange.min, max: qtyRange.max };
                            }
                            if (!newQuantityRanges[qtyIndex].coloredPrices) {
                              newQuantityRanges[qtyIndex].coloredPrices = [];
                            }
                            newQuantityRanges[qtyIndex].coloredPrices![sizeIndex] = parseFloat(e.target.value) || 0;
                            updateConfiguration(config.id!, {
                              pricing: { ...config.pricing, quantityRanges: newQuantityRanges }
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Fees */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Fees</h3>
          </div>
          
          <div className="space-y-2">
            {(config.fees || [{ name: 'Setup', amount: 0 }]).map((fee, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={fee.name}
                  onChange={(e) => {
                    const newFees = [...(config.fees || [])];
                    newFees[index] = { ...fee, name: e.target.value };
                    updateConfiguration(config.id!, { fees: newFees });
                  }}
                  placeholder="Fee name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={fee.amount}
                  onChange={(e) => {
                    const newFees = [...(config.fees || [])];
                    newFees[index] = { ...fee, amount: parseFloat(e.target.value) || 0 };
                    updateConfiguration(config.id!, { fees: newFees });
                  }}
                  placeholder="0.00"
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFees = config.fees?.filter((_, i) => i !== index) || [];
                    updateConfiguration(config.id!, { fees: newFees });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newFees = [...(config.fees || [])];
                newFees.push({ name: '', amount: 0 });
                updateConfiguration(config.id!, { fees: newFees });
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Fee
            </Button>
          </div>
        </div>

        {/* Extra Charges */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Extra Charges</h3>
          </div>
          
          <div className="space-y-2">
            {(config.extraCharges || [
              { name: 'Sleeves', amount: 0 },
              { name: 'Fleece', amount: 0 },
              { name: 'Over Zipper', amount: 0 },
              { name: 'Over Pocket', amount: 0 },
              { name: 'Neck Label', amount: 0 },
              { name: 'Kids Shirts', amount: 0 }
            ]).map((charge, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={charge.name}
                  onChange={(e) => {
                    const newCharges = [...(config.extraCharges || [])];
                    newCharges[index] = { ...charge, name: e.target.value };
                    updateConfiguration(config.id!, { extraCharges: newCharges });
                  }}
                  placeholder="Charge name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={charge.amount}
                  onChange={(e) => {
                    const newCharges = [...(config.extraCharges || [])];
                    newCharges[index] = { ...charge, amount: parseFloat(e.target.value) || 0 };
                    updateConfiguration(config.id!, { extraCharges: newCharges });
                  }}
                  placeholder="0.00"
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newCharges = config.extraCharges?.filter((_, i) => i !== index) || [];
                    updateConfiguration(config.id!, { extraCharges: newCharges });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newCharges = [...(config.extraCharges || [])];
                newCharges.push({ name: '', amount: 0 });
                updateConfiguration(config.id!, { extraCharges: newCharges });
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Extra Charge
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="outline" onClick={() => {/* Reset to defaults logic */}}>
            Reset to Defaults
          </Button>
          <Button onClick={() => {/* Save changes logic */}}>
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
                {config.method === 'embroidery' && renderEmbroideryForm(config)}
                {config.method === 'dtg' && renderDTGForm(config)}
                {config.method !== 'screenPrinting' && config.method !== 'embroidery' && config.method !== 'dtg' && (
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