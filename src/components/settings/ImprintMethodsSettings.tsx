import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Settings, Trash2, Save, Download, Upload, Copy } from 'lucide-react';
import { ImprintMethodConfiguration, ImprintSettingsState } from '@/types/imprint-config';
import { ImprintMethodConfigForm } from './ImprintMethodConfigForm';
import { PricingTiersForm } from './PricingTiersForm';
import { ConstraintsForm } from './ConstraintsForm';
import { GlobalImprintSettings } from './GlobalImprintSettings';
import { useToast } from '@/hooks/use-toast';

const defaultMethods = [
  { method: 'screen_printing', label: 'Screen Printing', description: 'Traditional screen printing for large quantities' },
  { method: 'embroidery', label: 'Embroidery', description: 'Stitched designs with thread' },
  { method: 'dtg', label: 'Direct to Garment', description: 'Digital printing directly on fabric' },
  { method: 'dtf', label: 'Direct to Film', description: 'Heat transfer from printed film' },
  { method: 'vinyl', label: 'Vinyl Cutting', description: 'Cut vinyl graphics applied with heat' },
  { method: 'sublimation', label: 'Sublimation', description: 'Dye sublimation printing for polyester' },
  { method: 'laser_engraving', label: 'Laser Engraving', description: 'Laser etched designs' },
  { method: 'debossing', label: 'Debossing', description: 'Pressed-in designs for leather/fabric' },
];

export function ImprintMethodsSettings() {
  const [settings, setSettings] = useState<ImprintSettingsState>({
    configurations: [],
    defaultConfiguration: {},
    globalSettings: {
      allowCustomPricing: true,
      requireApprovalAboveThreshold: 1000,
      autoCalculateRushFees: true,
      defaultTaxRate: 0.13
    }
  });
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const handleCreateMethod = (methodType: string) => {
    const methodInfo = defaultMethods.find(m => m.method === methodType);
    if (!methodInfo) return;

    const newConfig: ImprintMethodConfiguration = {
      id: `${methodType}_${Date.now()}`,
      method: methodType,
      label: methodInfo.label,
      enabled: true,
      description: methodInfo.description,
      pricingTiers: [
        {
          minQuantity: 1,
          maxQuantity: 24,
          basePrice: 5.00,
          setupFee: 50.00,
          additionalColorPrice: 1.50
        },
        {
          minQuantity: 25,
          maxQuantity: 99,
          basePrice: 4.50,
          setupFee: 50.00,
          additionalColorPrice: 1.25
        },
        {
          minQuantity: 100,
          maxQuantity: 999,
          basePrice: 3.75,
          setupFee: 50.00,
          additionalColorPrice: 1.00
        }
      ],
      sizeCapabilities: {
        maxWidth: 12,
        maxHeight: 16,
        minWidth: 0.5,
        minHeight: 0.5
      },
      colorConstraints: {
        maxColors: 6,
        unlimitedColors: false,
        additionalColorFee: 1.00,
        supportedInkTypes: ['Plastisol', 'Water-based', 'Discharge']
      },
      quantityConstraints: {
        minimumQuantity: 1,
        maximumQuantity: 10000,
        optimalQuantityRange: { min: 25, max: 500 }
      },
      garmentCompatibility: {
        supportedGarmentTypes: ['tshirt', 'hoodie', 'polo'],
        supportedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        supportedPlacements: ['front_center', 'back_center', 'front_left_chest', 'front_right_chest']
      },
      equipmentMapping: {
        secondaryEquipmentIds: [],
        preferredEquipmentType: methodType,
        setupRequirements: []
      },
      qualityStandards: {
        artworkRequirements: ['300 DPI minimum', 'Vector format preferred'],
        proofingRequired: true,
        qualityCheckpoints: ['Color matching', 'Registration check'],
        tolerances: {
          positionTolerance: 0.125,
          sizeTolerance: 5,
          colorTolerance: 'Delta E <3'
        }
      },
      turnaroundTimes: {
        standardTurnaround: 7,
        rushTurnaround: 3,
        rushFee: 25,
        expeditedOptions: [
          { days: 5, surcharge: 15 },
          { days: 3, surcharge: 25 },
          { days: 1, surcharge: 50 }
        ]
      },
      customerArtTypes: ['PDF', 'AI', 'EPS', 'PNG', 'JPG'],
      productionFileTypes: ['AI', 'EPS', 'PDF'],
      artworkInstructions: 'Please provide high-resolution artwork in vector format when possible.',
      technicalRequirements: ['Artwork must be provided at actual print size', 'All fonts must be outlined'],
      specialOptions: {
        oversizeCapable: false,
        multiLocationDiscount: 10
      },
      aiPricingEnabled: true,
      constraintValidationEnabled: true,
      autoEquipmentSelection: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSettings(prev => ({
      ...prev,
      configurations: [...prev.configurations, newConfig]
    }));

    setActiveMethod(newConfig.id);
    toast({
      title: "Imprint Method Created",
      description: `${methodInfo.label} configuration has been created.`
    });
  };

  const handleDeleteMethod = (methodId: string) => {
    setSettings(prev => ({
      ...prev,
      configurations: prev.configurations.filter(config => config.id !== methodId)
    }));
    
    if (activeMethod === methodId) {
      setActiveMethod(null);
    }
    
    toast({
      title: "Method Deleted",
      description: "Imprint method configuration has been removed."
    });
  };

  const handleUpdateMethod = (updatedConfig: ImprintMethodConfiguration) => {
    setSettings(prev => ({
      ...prev,
      configurations: prev.configurations.map(config => 
        config.id === updatedConfig.id ? updatedConfig : config
      )
    }));
    
    toast({
      title: "Configuration Saved",
      description: "Imprint method settings have been updated."
    });
  };

  const handleSaveAll = () => {
    // Save to backend/storage
    toast({
      title: "Settings Saved",
      description: "All imprint method configurations have been saved."
    });
  };

  const selectedConfig = settings.configurations.find(config => config.id === activeMethod);
  const availableMethods = defaultMethods.filter(method => 
    !settings.configurations.some(config => config.method === method.method)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Imprint Methods Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure pricing, constraints, and settings for each imprint method
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleSaveAll} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          {selectedConfig && <TabsTrigger value="config">Method Config</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.configurations.map((config) => (
              <Card key={config.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{config.label}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.enabled ? "default" : "secondary"}>
                        {config.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Imprint Method</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {config.label}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteMethod(config.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {config.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pricing Tiers:</span>
                      <span>{config.pricingTiers.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Colors:</span>
                      <span>{config.colorConstraints.unlimitedColors ? 'Unlimited' : config.colorConstraints.maxColors}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Turnaround:</span>
                      <span>{config.turnaroundTimes.standardTurnaround} days</span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setActiveMethod(config.id);
                      setActiveTab('config');
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}

            {availableMethods.length > 0 && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Add New Method</CardTitle>
                  <CardDescription>
                    Configure a new imprint method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {availableMethods.map((method) => (
                    <Button
                      key={method.method}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleCreateMethod(method.method)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {method.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="global">
          <GlobalImprintSettings 
            settings={settings.globalSettings}
            onUpdate={(globalSettings) => setSettings(prev => ({ ...prev, globalSettings }))}
          />
        </TabsContent>

        {selectedConfig && (
          <TabsContent value="config">
            <ImprintMethodConfigForm
              config={selectedConfig}
              onUpdate={handleUpdateMethod}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}