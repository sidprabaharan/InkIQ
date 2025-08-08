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
      <div className="space-y-6">
        {/* Basic Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Basic Configuration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dtg-description">Description</Label>
              <Textarea
                id="dtg-description"
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

        {/* Print Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Print Options</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Do you print over zippers?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="zippers-yes" name="zippers" className="w-4 h-4" />
                  <Label htmlFor="zippers-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="zippers-no" name="zippers" className="w-4 h-4" />
                  <Label htmlFor="zippers-no">No</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Do you print over hoodie pockets?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="pockets-yes" name="pockets" className="w-4 h-4" />
                  <Label htmlFor="pockets-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="pockets-no" name="pockets" className="w-4 h-4" />
                  <Label htmlFor="pockets-no">No</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Do you print on sleeves?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="sleeves-yes" name="sleeves" className="w-4 h-4" />
                  <Label htmlFor="sleeves-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="sleeves-no" name="sleeves" className="w-4 h-4" />
                  <Label htmlFor="sleeves-no">No</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Do you print neck labels?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="labels-yes" name="labels" className="w-4 h-4" />
                  <Label htmlFor="labels-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="labels-no" name="labels" className="w-4 h-4" />
                  <Label htmlFor="labels-no">No</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Do you print on infant / kids shirts?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="kids-yes" name="kids" className="w-4 h-4" />
                  <Label htmlFor="kids-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="kids-no" name="kids" className="w-4 h-4" />
                  <Label htmlFor="kids-no">No</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Do you print on 50% Cotton 50% Polyester OR only 100% Cotton?</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="cotton-both" name="cotton" className="w-4 h-4" />
                  <Label htmlFor="cotton-both">Both</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="cotton-100" name="cotton" className="w-4 h-4" />
                  <Label htmlFor="cotton-100">Only 100% Cotton</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Size Limits</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-max-width">Maximum Width in Inches</Label>
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
                  placeholder="e.g., 23"
                />
              </div>
              <div>
                <Label htmlFor="dtg-max-height">Maximum Height in Inches</Label>
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
                  placeholder="e.g., 23"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dtg-max-sleeve-width">Maximum Sleeve Width in Inches</Label>
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
                  placeholder="e.g., 23"
                />
              </div>
              <div>
                <Label htmlFor="dtg-max-sleeve-height">Maximum Sleeve Height in Inches</Label>
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
                  placeholder="e.g., 23"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dtg-logo-size-notes">Logo size additional notes</Label>
              <Textarea
                id="dtg-logo-size-notes"
                value={config.sizeCapabilities?.notes || ''}
                onChange={(e) => updateConfiguration(config.id, {
                  sizeCapabilities: {
                    ...config.sizeCapabilities,
                    notes: e.target.value
                  }
                })}
                placeholder="If the logo sizing has specific constraints let us know."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* DTG Pricing - White Garment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">White Garment Pricing</h3>
          
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Quantity Range
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Size Range
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted">Quantity</TableHead>
                  <TableHead className="text-center">4"x4"</TableHead>
                  <TableHead className="text-center">10"x10"</TableHead>
                  <TableHead className="text-center">15"x15"</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['12-24', '25-50', '51-100', '101-250', '251-500', '501-1000', '1000+'].map((range, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium bg-muted">{range}</TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$0.00"
                        className="w-20 text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$0.00"
                        className="w-20 text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$0.00"
                        className="w-20 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Colored Garment Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Colored Garment Pricing</h3>
          
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Quantity Range
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Size Range
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted">Quantity</TableHead>
                  <TableHead className="text-center">4"x4"</TableHead>
                  <TableHead className="text-center">10"x10"</TableHead>
                  <TableHead className="text-center">15"x15"</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['12-24', '25-50', '51-100', '101-250', '251-500', '501-1000', '1000+'].map((range, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium bg-muted">{range}</TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$0.00"
                        className="w-20 text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$0.00"
                        className="w-20 text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$0.00"
                        className="w-20 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* DTG Fees */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">DTG Fees</h3>
          
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Fee
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Setup</TableCell>
                  <TableCell className="text-center">$0.00</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* DTG Extra Charges */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">DTG Extra Charges</h3>
          
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Charge
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['Sleeves', 'Fleece', 'Over Zipper', 'Over Pocket', 'Neck Label', 'Kids Shirts'].map((charge, index) => (
                  <TableRow key={index}>
                    <TableCell>{charge}</TableCell>
                    <TableCell className="text-center">$0.00</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Order Quantities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Quantities</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dtg-min-qty">Minimum Order Quantity</Label>
              <Input
                id="dtg-min-qty"
                type="number"
                value={config.quantityConstraints?.minimumQuantity || ''}
                onChange={(e) => updateConfiguration(config.id, {
                  quantityConstraints: {
                    ...config.quantityConstraints,
                    minimumQuantity: parseInt(e.target.value) || 0
                  }
                })}
                placeholder="We won't send you any orders with quantities less than this."
              />
            </div>
            <div>
              <Label htmlFor="dtg-max-qty">Maximum Order Quantity</Label>
              <Input
                id="dtg-max-qty"
                type="number"
                value={config.quantityConstraints?.maximumQuantity || ''}
                onChange={(e) => updateConfiguration(config.id, {
                  quantityConstraints: {
                    ...config.quantityConstraints,
                    maximumQuantity: parseInt(e.target.value) || 0
                  }
                })}
                placeholder="We won't send you any orders with quantities larger than this."
              />
            </div>
          </div>
        </div>

        {/* Capacity and Quality */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Capacity and Quality</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dtg-daily-capacity">Daily Capacity (Average Logo)</Label>
              <Input
                id="dtg-daily-capacity"
                type="number"
                placeholder=""
              />
            </div>
            <div>
              <Label htmlFor="dtg-damage-rate">Damage Rate (%)</Label>
              <Input
                id="dtg-damage-rate"
                type="number"
                step="0.1"
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Production Times */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Production Times</h3>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Days</TableHead>
                  <TableHead className="text-center">Extra Charge %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Standard</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rush</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rush</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rush</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="w-20 text-center"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Extra Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Extra Notes?</h3>
          
          <Textarea
            placeholder="Please let us know anything you think might be important. If there's a specific type of garment or fabric you don't like printing on or something that annoys you and you don't want to deal with, let us know! We only want to send you orders which you enjoy taking and avoid orders which annoy you."
            rows={4}
          />
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