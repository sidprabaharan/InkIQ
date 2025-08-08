import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Palette, Plus, Settings, Copy, Trash2, Cog, Users, Calendar, Package, 
  Printer, Target, FileText, DollarSign, Clock, Truck, User,
  Minus, Trash
} from 'lucide-react';
import { ImprintMethodConfiguration } from '@/types/imprint-config';

const IMPRINT_METHODS = [
  { value: 'screenPrinting', label: 'Screen Printing' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'dtg', label: 'Direct-to-Garment (DTG)' },
  { value: 'heatTransfer', label: 'Heat Transfer' },
  { value: 'sublimation', label: 'Sublimation' },
  { value: 'vinylCutting', label: 'Vinyl Cutting' },
  { value: 'engraving', label: 'Engraving' },
  { value: 'debossing', label: 'Debossing' },
  { value: 'foilStamping', label: 'Foil Stamping' },
];

export function ImprintSettings() {
  const [configurations, setConfigurations] = useState<ImprintMethodConfiguration[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const addConfiguration = (method: string) => {
    const newConfig: ImprintMethodConfiguration = {
      id: `${method}-${Date.now()}`,
      method,
      label: IMPRINT_METHODS.find(m => m.value === method)?.label || method,
      enabled: true,
      description: '',
      pricingTiers: [],
      sizeCapabilities: {
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0,
        minHeight: 0
      },
      colorConstraints: {
        maxColors: 1,
        unlimitedColors: false,
        additionalColorFee: 0,
        supportedInkTypes: []
      },
      quantityConstraints: {
        minimumQuantity: 1,
        maximumQuantity: 10000,
        optimalQuantityRange: { min: 10, max: 500 }
      },
      garmentCompatibility: {
        supportedGarmentTypes: [],
        supportedSizes: [],
        supportedPlacements: []
      },
      equipmentMapping: {
        primaryEquipmentId: '',
        secondaryEquipmentIds: [],
        preferredEquipmentType: '',
        setupRequirements: []
      },
      qualityStandards: {
        artworkRequirements: [],
        proofingRequired: false,
        qualityCheckpoints: [],
        tolerances: {
          positionTolerance: 0.125,
          sizeTolerance: 5,
          colorTolerance: "Delta E <2"
        }
      },
      turnaroundTimes: {
        standardTurnaround: 5,
        rushTurnaround: 3,
        rushFee: 25,
        expeditedOptions: []
      },
      customerArtTypes: [],
      productionFileTypes: [],
      artworkInstructions: '',
      technicalRequirements: [],
      specialOptions: {
        oversizeCapable: false,
        oversizeSurcharge: 0,
        difficultPlacementSurcharge: 0,
        multiLocationDiscount: 0
      },
      aiPricingEnabled: false,
      constraintValidationEnabled: true,
      autoEquipmentSelection: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConfigurations(prev => [...prev, newConfig]);
    setActiveTab(newConfig.id);
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

  const deleteConfiguration = (id: string) => {
    setConfigurations(prev => prev.filter(config => config.id !== id));
    if (activeTab === id) {
      setActiveTab(configurations[0]?.id || '');
    }
  };

  const duplicateConfiguration = (id: string) => {
    const original = configurations.find(config => config.id === id);
    if (original) {
      const duplicate: ImprintMethodConfiguration = {
        ...original,
        id: `${original.method}-copy-${Date.now()}`,
        label: `${original.label} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setConfigurations(prev => [...prev, duplicate]);
      setActiveTab(duplicate.id);
    }
  };

  const handleAddMethod = () => {
    if (selectedMethod) {
      addConfiguration(selectedMethod);
      setSelectedMethod('');
      setIsAddDialogOpen(false);
    }
  };

  const renderScreenPrintingForm = (config: ImprintMethodConfiguration) => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Basic Configuration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => updateConfiguration(config.id, { description: e.target.value })}
                placeholder="Brief description of this imprint method..."
                rows={3}
              />
            </div>
            <div>
              <Label>Enabled</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) => updateConfiguration(config.id, { enabled })}
                />
                <span className="text-sm">{config.enabled ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <Cog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Screen Printing Configuration</h3>
          <p className="text-muted-foreground">
            Detailed configuration form for Screen Printing will be added soon.
          </p>
        </div>
      </div>
    );
  };

  const renderEmbroideryForm = (config: ImprintMethodConfiguration) => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Basic Configuration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => updateConfiguration(config.id, { description: e.target.value })}
                placeholder="Brief description of this imprint method..."
                rows={3}
              />
            </div>
            <div>
              <Label>Enabled</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) => updateConfiguration(config.id, { enabled })}
                />
                <span className="text-sm">{config.enabled ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <Cog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Embroidery Configuration</h3>
          <p className="text-muted-foreground">
            Detailed configuration form for Embroidery will be added soon.
          </p>
        </div>
      </div>
    );
  };

  const renderDTGForm = (config: ImprintMethodConfiguration) => {
    return (
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dtg-description">Description</Label>
              <Textarea
                id="dtg-description"
                value={config.description}
                onChange={(e) => updateConfiguration(config.id, { description: e.target.value })}
                placeholder="Brief description of your DTG capabilities..."
                rows={3}
              />
            </div>
            <div>
              <Label>Status</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) => updateConfiguration(config.id, { enabled })}
                />
                <span className="text-sm font-medium">{config.enabled ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Control whether this method is available for quotes
              </p>
            </div>
          </div>
        </div>

        {/* Size Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Size Limits</h3>
          <p className="text-sm text-muted-foreground">
            Configure maximum print dimensions for DTG printing.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-max-width" className="text-sm font-medium">Maximum Width in Inches</Label>
                <Input
                  id="dtg-max-width"
                  type="number"
                  step="0.1"
                  value={config.sizeCapabilities?.maxWidth || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    sizeCapabilities: {
                      ...config.sizeCapabilities,
                      maxWidth: parseFloat(e.target.value) || 0
                    }
                  })}
                  placeholder="e.g., 12"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum print width</p>
              </div>
              <div>
                <Label htmlFor="dtg-max-height" className="text-sm font-medium">Maximum Height in Inches</Label>
                <Input
                  id="dtg-max-height"
                  type="number"
                  step="0.1"
                  value={config.sizeCapabilities?.maxHeight || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    sizeCapabilities: {
                      ...config.sizeCapabilities,
                      maxHeight: parseFloat(e.target.value) || 0
                    }
                  })}
                  placeholder="e.g., 16"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum print height</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-max-sleeve-width" className="text-sm font-medium">Maximum Sleeve Width in Inches</Label>
                <Input
                  id="dtg-max-sleeve-width"
                  type="number"
                  step="0.1"
                  value={config.sizeCapabilities?.minWidth || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    sizeCapabilities: {
                      ...config.sizeCapabilities,
                      minWidth: parseFloat(e.target.value) || 0
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
                  value={config.sizeCapabilities?.minHeight || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    sizeCapabilities: {
                      ...config.sizeCapabilities,
                      minHeight: parseFloat(e.target.value) || 0
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
                value={config.sizeCapabilities?.notes || ''}
                onChange={(e) => updateConfiguration(config.id, {
                  sizeCapabilities: {
                    ...config.sizeCapabilities,
                    notes: e.target.value
                  }
                })}
                placeholder="Any additional notes about DTG sizing constraints..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Order Quantities & Capacity */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Quantities & Capacity</h3>
          <p className="text-sm text-muted-foreground">
            Configure minimum and maximum order quantities and daily production capacity.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-min-order-qty" className="text-sm font-medium">Min Order Quantity</Label>
                <Input
                  id="dtg-min-order-qty"
                  type="number"
                  value={config.quantityConstraints?.minimumQuantity || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    quantityConstraints: {
                      ...config.quantityConstraints,
                      minimumQuantity: parseInt(e.target.value) || 0
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
                  value={config.quantityConstraints?.maximumQuantity || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    quantityConstraints: {
                      ...config.quantityConstraints,
                      maximumQuantity: parseInt(e.target.value) || 0
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
                  value={config.equipmentMapping?.primaryEquipmentId || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    equipmentMapping: { 
                      ...config.equipmentMapping, 
                      primaryEquipmentId: e.target.value,
                      secondaryEquipmentIds: config.equipmentMapping?.secondaryEquipmentIds || [],
                      preferredEquipmentType: config.equipmentMapping?.preferredEquipmentType || '',
                      setupRequirements: config.equipmentMapping?.setupRequirements || []
                    }
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
                  value={config.qualityStandards?.tolerances?.sizeTolerance || ''}
                  onChange={(e) => updateConfiguration(config.id, {
                    qualityStandards: { 
                      ...config.qualityStandards, 
                      tolerances: {
                        ...config.qualityStandards?.tolerances,
                        sizeTolerance: parseFloat(e.target.value) || 0,
                        positionTolerance: config.qualityStandards?.tolerances?.positionTolerance || 0.125,
                        colorTolerance: config.qualityStandards?.tolerances?.colorTolerance || "Delta E <2"
                      },
                      artworkRequirements: config.qualityStandards?.artworkRequirements || [],
                      proofingRequired: config.qualityStandards?.proofingRequired || false,
                      qualityCheckpoints: config.qualityStandards?.qualityCheckpoints || []
                    }
                  })}
                  placeholder="e.g., 1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Production Times */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">DTG Production Turnaround Times</h3>
          <p className="text-sm text-muted-foreground">
            Configure standard and rush turnaround times for DTG printing.
          </p>
          
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
                      value={config.turnaroundTimes?.standardTurnaround || ''}
                      onChange={(e) => updateConfiguration(config.id, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          standardTurnaround: parseInt(e.target.value) || 0,
                          rushTurnaround: config.turnaroundTimes?.rushTurnaround || 0,
                          rushFee: config.turnaroundTimes?.rushFee || 0,
                          expeditedOptions: config.turnaroundTimes?.expeditedOptions || []
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
                      value={config.turnaroundTimes?.rushTurnaround || ''}
                      onChange={(e) => updateConfiguration(config.id, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          standardTurnaround: config.turnaroundTimes?.standardTurnaround || 0,
                          rushTurnaround: parseInt(e.target.value) || 0,
                          rushFee: config.turnaroundTimes?.rushFee || 0,
                          expeditedOptions: config.turnaroundTimes?.expeditedOptions || []
                        }
                      })}
                      placeholder="3"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={config.turnaroundTimes?.rushFee || ''}
                      onChange={(e) => updateConfiguration(config.id, {
                        turnaroundTimes: {
                          ...config.turnaroundTimes,
                          standardTurnaround: config.turnaroundTimes?.standardTurnaround || 0,
                          rushTurnaround: config.turnaroundTimes?.rushTurnaround || 0,
                          rushFee: parseFloat(e.target.value) || 0,
                          expeditedOptions: config.turnaroundTimes?.expeditedOptions || []
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
                      value={config.turnaroundTimes?.expeditedOptions?.[0]?.days || ''}
                      onChange={(e) => {
                        const expeditedOptions = config.turnaroundTimes?.expeditedOptions || [];
                        const updatedOptions = [...expeditedOptions];
                        if (updatedOptions.length === 0) {
                          updatedOptions.push({ days: 0, surcharge: 0 });
                        }
                        updatedOptions[0] = { ...updatedOptions[0], days: parseInt(e.target.value) || 0 };
                        updateConfiguration(config.id, {
                          turnaroundTimes: {
                            ...config.turnaroundTimes,
                            standardTurnaround: config.turnaroundTimes?.standardTurnaround || 0,
                            rushTurnaround: config.turnaroundTimes?.rushTurnaround || 0,
                            rushFee: config.turnaroundTimes?.rushFee || 0,
                            expeditedOptions: updatedOptions
                          }
                        });
                      }}
                      placeholder="1"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={config.turnaroundTimes?.expeditedOptions?.[0]?.surcharge || ''}
                      onChange={(e) => {
                        const expeditedOptions = config.turnaroundTimes?.expeditedOptions || [];
                        const updatedOptions = [...expeditedOptions];
                        if (updatedOptions.length === 0) {
                          updatedOptions.push({ days: 0, surcharge: 0 });
                        }
                        updatedOptions[0] = { ...updatedOptions[0], surcharge: parseFloat(e.target.value) || 0 };
                        updateConfiguration(config.id, {
                          turnaroundTimes: {
                            ...config.turnaroundTimes,
                            standardTurnaround: config.turnaroundTimes?.standardTurnaround || 0,
                            rushTurnaround: config.turnaroundTimes?.rushTurnaround || 0,
                            rushFee: config.turnaroundTimes?.rushFee || 0,
                            expeditedOptions: updatedOptions
                          }
                        });
                      }}
                      placeholder="50"
                      className="w-20 text-center"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pricing Tables for White and Colored Garments */}
        <div className="space-y-8">
          {/* White Garment Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">White Garment Pricing (Based on Size)</h3>
            <p className="text-sm text-muted-foreground">
              Set your pricing for DTG printing on white garments based on size.
            </p>
            
            <div className="border rounded-lg overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-32">Quantity</TableHead>
                    <TableHead className="text-center min-w-24">4"x4"</TableHead>
                    <TableHead className="text-center min-w-24">10"x10"</TableHead>
                    <TableHead className="text-center min-w-24">15"x15"</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.pricingTiers?.map((tier, tierIndex) => (
                    <TableRow key={tierIndex}>
                      <TableCell className="font-medium">
                        {tier.minQuantity}-{tier.maxQuantity}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={tier.basePrice}
                          onChange={(e) => {
                            const updatedTiers = [...(config.pricingTiers || [])];
                            updatedTiers[tierIndex] = { ...tier, basePrice: parseFloat(e.target.value) || 0 };
                            updateConfiguration(config.id, {
                              pricingTiers: updatedTiers
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={tier.setupFee}
                          onChange={(e) => {
                            const updatedTiers = [...(config.pricingTiers || [])];
                            updatedTiers[tierIndex] = { ...tier, setupFee: parseFloat(e.target.value) || 0 };
                            updateConfiguration(config.id, {
                              pricingTiers: updatedTiers
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={tier.additionalColorPrice || 0}
                          onChange={(e) => {
                            const updatedTiers = [...(config.pricingTiers || [])];
                            updatedTiers[tierIndex] = { ...tier, additionalColorPrice: parseFloat(e.target.value) || 0 };
                            updateConfiguration(config.id, {
                              pricingTiers: updatedTiers
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedTiers = config.pricingTiers?.filter((_, index) => index !== tierIndex) || [];
                            updateConfiguration(config.id, {
                              pricingTiers: updatedTiers
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
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newTier = { minQuantity: 0, maxQuantity: 0, basePrice: 0, setupFee: 0 };
                const updatedTiers = [...(config.pricingTiers || []), newTier];
                updateConfiguration(config.id, {
                  pricingTiers: updatedTiers
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Tier
            </Button>
          </div>

          {/* Colored Garment Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Colored Garment Pricing (Based on Size)</h3>
            <p className="text-sm text-muted-foreground">
              Set your pricing for DTG printing on colored garments based on size.
            </p>
            
            <div className="border rounded-lg overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-32">Quantity</TableHead>
                    <TableHead className="text-center min-w-24">4"x4"</TableHead>
                    <TableHead className="text-center min-w-24">10"x10"</TableHead>
                    <TableHead className="text-center min-w-24">15"x15"</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.pricingTiers?.map((tier, tierIndex) => (
                    <TableRow key={tierIndex}>
                      <TableCell className="font-medium">
                        {tier.minQuantity}-{tier.maxQuantity}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={tier.basePrice}
                          onChange={(e) => {
                            const updatedTiers = [...(config.pricingTiers || [])];
                            updatedTiers[tierIndex] = { ...tier, basePrice: parseFloat(e.target.value) || 0 };
                            updateConfiguration(config.id, {
                              pricingTiers: updatedTiers
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={tier.setupFee}
                          onChange={(e) => {
                            const updatedTiers = [...(config.pricingTiers || [])];
                            updatedTiers[tierIndex] = { ...tier, setupFee: parseFloat(e.target.value) || 0 };
                            updateConfiguration(config.id, {
                              pricingTiers: updatedTiers
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          step="0.01"
                          value={tier.additionalColorPrice || 0}
                          onChange={(e) => {
                            const updatedTiers = [...(config.pricingTiers || [])];
                            updatedTiers[tierIndex] = { ...tier, additionalColorPrice: parseFloat(e.target.value) || 0 };
                            updateConfiguration(config.id, {
                              pricingTiers: updatedTiers
                            });
                          }}
                          placeholder="0.00"
                          className="w-20 text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fees</h3>
          <p className="text-sm text-muted-foreground">
            Configure additional fees for DTG printing services.
          </p>
          
          <div className="space-y-4">
            <div className="mt-4">
              <Label>Art File Setup: ${config.pricingTiers?.[0]?.setupFee || 0}</Label>
              <Input
                type="number"
                step="0.01"
                value={config.pricingTiers?.[0]?.setupFee || ''}
                onChange={(e) => {
                  const updatedTiers = [...(config.pricingTiers || [])];
                  if (updatedTiers.length === 0) {
                    updatedTiers.push({ minQuantity: 0, maxQuantity: 9999, basePrice: 0, setupFee: 0 });
                  }
                  updatedTiers[0] = { ...updatedTiers[0], setupFee: parseFloat(e.target.value) || 0 };
                  updateConfiguration(config.id, {
                    pricingTiers: updatedTiers
                  });
                }}
                placeholder="e.g., 15.00"
                className="mt-2"
              />
            </div>

            <div className="mt-4">
              <Label>Rush Order Fee: ${config.turnaroundTimes?.rushFee || 0}</Label>
              <Input
                type="number"
                step="0.01"
                value={config.turnaroundTimes?.rushFee || ''}
                onChange={(e) => updateConfiguration(config.id, {
                  turnaroundTimes: {
                    ...config.turnaroundTimes,
                    standardTurnaround: config.turnaroundTimes?.standardTurnaround || 0,
                    rushTurnaround: config.turnaroundTimes?.rushTurnaround || 0,
                    rushFee: parseFloat(e.target.value) || 0,
                    expeditedOptions: config.turnaroundTimes?.expeditedOptions || []
                  }
                })}
                placeholder="e.g., 50.00"
                className="mt-2"
              />
            </div>

            <div className="mt-4">
              <Label>Screen Preparation: ${config.pricingTiers?.[0]?.rushSurcharge || 0}</Label>
              <Input
                type="number"
                step="0.01"
                value={config.pricingTiers?.[0]?.rushSurcharge || ''}
                onChange={(e) => {
                  const updatedTiers = [...(config.pricingTiers || [])];
                  if (updatedTiers.length === 0) {
                    updatedTiers.push({ minQuantity: 0, maxQuantity: 9999, basePrice: 0, setupFee: 0 });
                  }
                  updatedTiers[0] = { ...updatedTiers[0], rushSurcharge: parseFloat(e.target.value) || 0 };
                  updateConfiguration(config.id, {
                    pricingTiers: updatedTiers
                  });
                }}
                placeholder="e.g., 25.00"
                className="mt-2"
              />
            </div>

            <div className="mt-4">
              <Label>Sample Fee: ${config.specialOptions?.oversizeSurcharge || 0}</Label>
              <Input
                type="number"
                step="0.01"
                value={config.specialOptions?.oversizeSurcharge || ''}
                onChange={(e) => updateConfiguration(config.id, {
                  specialOptions: { 
                    ...config.specialOptions, 
                    oversizeCapable: config.specialOptions?.oversizeCapable || false,
                    oversizeSurcharge: parseFloat(e.target.value) || 0,
                    difficultPlacementSurcharge: config.specialOptions?.difficultPlacementSurcharge || 0,
                    multiLocationDiscount: config.specialOptions?.multiLocationDiscount || 0
                  }
                })}
                placeholder="e.g., 10.00"
                className="mt-2"
              />
            </div>

            <div className="mt-4">
              <Label>Difficult Placement Fee: ${config.specialOptions?.difficultPlacementSurcharge || 0}</Label>
              <Input
                type="number"
                step="0.01"
                value={config.specialOptions?.difficultPlacementSurcharge || ''}
                onChange={(e) => updateConfiguration(config.id, {
                  specialOptions: { 
                    ...config.specialOptions, 
                    oversizeCapable: config.specialOptions?.oversizeCapable || false,
                    oversizeSurcharge: config.specialOptions?.oversizeSurcharge || 0,
                    difficultPlacementSurcharge: parseFloat(e.target.value) || 0,
                    multiLocationDiscount: config.specialOptions?.multiLocationDiscount || 0
                  }
                })}
                placeholder="e.g., 5.00"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Extra Charges */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Extra Charges</h3>
          <p className="text-sm text-muted-foreground">
            Configure additional charges for special DTG printing requirements.
          </p>
          
          <div className="space-y-2">
            {(['Sleeves', 'Fleece', 'Over Zipper', 'Over Pocket', 'Neck Label', 'Kids Shirts']).map((chargeName, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={chargeName}
                  disabled
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={0}
                  placeholder="0.00"
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
