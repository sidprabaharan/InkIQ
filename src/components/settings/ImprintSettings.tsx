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
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

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
    setSelectedMethod(newConfig.id);
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

  const selectedConfig = configurations.find(c => c.id === selectedMethod);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Imprint Method Settings</h2>
          <p className="text-muted-foreground">
            Configure pricing, constraints, and capabilities for each imprint method
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={''} onValueChange={createNewConfiguration}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add imprint method" />
            </SelectTrigger>
            <SelectContent>
              {IMPRINT_METHODS.map(method => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Configured Methods List */}
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configured Methods</CardTitle>
              <CardDescription>
                {configurations.length} method(s) configured
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-4">
                {configurations.map(config => (
                  <div 
                    key={config.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedMethod === config.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedMethod(config.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{config.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {config.quantityConstraints.minimumQuantity}-{config.quantityConstraints.maximumQuantity} pcs
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.enabled ? 'default' : 'secondary'}>
                          {config.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                
                {configurations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No imprint methods configured yet</p>
                    <p className="text-sm">Add your first method above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="col-span-8">
          {selectedConfig ? (
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
                            value={selectedConfig.label}
                            onChange={(e) => updateConfiguration(selectedConfig.id, { label: e.target.value })}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={selectedConfig.enabled}
                            onCheckedChange={(enabled) => updateConfiguration(selectedConfig.id, { enabled })}
                          />
                          <Label>Method Enabled</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={selectedConfig.description}
                          onChange={(e) => updateConfiguration(selectedConfig.id, { description: e.target.value })}
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
                          <table className="w-full border rounded-lg">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="text-left p-3">Quantity Range</th>
                                <th className="text-left p-3">Base Price</th>
                                <th className="text-left p-3">Setup Fee</th>
                                <th className="text-left p-3">Additional Color</th>
                                <th className="text-left p-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedConfig.pricingTiers.map((tier, index) => (
                                <tr key={index} className="border-b">
                                  <td className="p-3">
                                    {tier.minQuantity} - {tier.maxQuantity}
                                  </td>
                                  <td className="p-3">${tier.basePrice.toFixed(2)}</td>
                                  <td className="p-3">${tier.setupFee.toFixed(2)}</td>
                                  <td className="p-3">${tier.additionalColorPrice?.toFixed(2) || '0.00'}</td>
                                  <td className="p-3">
                                    <Button size="sm" variant="ghost">
                                      <Edit className="h-4 w-4" />
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
                              value={selectedConfig.sizeCapabilities.maxWidth}
                              onChange={(e) => updateConfiguration(selectedConfig.id, {
                                sizeCapabilities: {
                                  ...selectedConfig.sizeCapabilities,
                                  maxWidth: parseFloat(e.target.value)
                                }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Max Height (inches)</Label>
                            <Input 
                              type="number"
                              value={selectedConfig.sizeCapabilities.maxHeight}
                              onChange={(e) => updateConfiguration(selectedConfig.id, {
                                sizeCapabilities: {
                                  ...selectedConfig.sizeCapabilities,
                                  maxHeight: parseFloat(e.target.value)
                                }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Min Width (inches)</Label>
                            <Input 
                              type="number"
                              value={selectedConfig.sizeCapabilities.minWidth}
                              onChange={(e) => updateConfiguration(selectedConfig.id, {
                                sizeCapabilities: {
                                  ...selectedConfig.sizeCapabilities,
                                  minWidth: parseFloat(e.target.value)
                                }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Min Height (inches)</Label>
                            <Input 
                              type="number"
                              value={selectedConfig.sizeCapabilities.minHeight}
                              onChange={(e) => updateConfiguration(selectedConfig.id, {
                                sizeCapabilities: {
                                  ...selectedConfig.sizeCapabilities,
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
                                checked={selectedConfig.colorConstraints.unlimitedColors}
                                onCheckedChange={(unlimitedColors) => updateConfiguration(selectedConfig.id, {
                                  colorConstraints: {
                                    ...selectedConfig.colorConstraints,
                                    unlimitedColors
                                  }
                                })}
                              />
                              <Label>Unlimited Colors</Label>
                            </div>
                          </div>
                          {!selectedConfig.colorConstraints.unlimitedColors && (
                            <div className="space-y-2">
                              <Label>Max Colors</Label>
                              <Input 
                                type="number"
                                value={selectedConfig.colorConstraints.maxColors}
                                onChange={(e) => updateConfiguration(selectedConfig.id, {
                                  colorConstraints: {
                                    ...selectedConfig.colorConstraints,
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
                              value={selectedConfig.colorConstraints.additionalColorFee}
                              onChange={(e) => updateConfiguration(selectedConfig.id, {
                                colorConstraints: {
                                  ...selectedConfig.colorConstraints,
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
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <Settings className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Imprint Method</h3>
                  <p className="text-muted-foreground">
                    Choose a method from the left to configure its settings
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}