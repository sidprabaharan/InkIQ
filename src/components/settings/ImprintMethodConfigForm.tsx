import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ImprintMethodConfiguration } from '@/types/imprint-config';
import { PricingTiersForm } from './PricingTiersForm';
import { ConstraintsForm } from './ConstraintsForm';
import { EquipmentMappingForm } from './EquipmentMappingForm';
import { QualityStandardsForm } from './QualityStandardsForm';
import { TurnaroundTimesForm } from './TurnaroundTimesForm';
import { ArtworkRequirementsForm } from './ArtworkRequirementsForm';

interface ImprintMethodConfigFormProps {
  config: ImprintMethodConfiguration;
  onUpdate: (config: ImprintMethodConfiguration) => void;
}

export function ImprintMethodConfigForm({ config, onUpdate }: ImprintMethodConfigFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const updateConfig = (updates: Partial<ImprintMethodConfiguration>) => {
    onUpdate({
      ...config,
      ...updates,
      updatedAt: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{config.label} Configuration</CardTitle>
              <CardDescription>Configure all settings for {config.label}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="method-enabled">Enabled</Label>
              <Switch
                id="method-enabled"
                checked={config.enabled}
                onCheckedChange={(enabled) => updateConfig({ enabled })}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="turnaround">Turnaround</TabsTrigger>
          <TabsTrigger value="artwork">Artwork</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Basic configuration for {config.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method-label">Display Name</Label>
                  <Input
                    id="method-label"
                    value={config.label}
                    onChange={(e) => updateConfig({ label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method-id">Method ID</Label>
                  <Input
                    id="method-id"
                    value={config.method}
                    onChange={(e) => updateConfig({ method: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method-description">Description</Label>
                <Textarea
                  id="method-description"
                  value={config.description}
                  onChange={(e) => updateConfig({ description: e.target.value })}
                  placeholder="Describe this imprint method..."
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">AI Integration Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ai-pricing"
                      checked={config.aiPricingEnabled}
                      onCheckedChange={(aiPricingEnabled) => updateConfig({ aiPricingEnabled })}
                    />
                    <Label htmlFor="ai-pricing">AI Pricing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="constraint-validation"
                      checked={config.constraintValidationEnabled}
                      onCheckedChange={(constraintValidationEnabled) => updateConfig({ constraintValidationEnabled })}
                    />
                    <Label htmlFor="constraint-validation">Constraint Validation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-equipment"
                      checked={config.autoEquipmentSelection}
                      onCheckedChange={(autoEquipmentSelection) => updateConfig({ autoEquipmentSelection })}
                    />
                    <Label htmlFor="auto-equipment">Auto Equipment Selection</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <PricingTiersForm
            pricingTiers={config.pricingTiers}
            onUpdate={(pricingTiers) => updateConfig({ pricingTiers })}
          />
        </TabsContent>

        <TabsContent value="constraints">
          <ConstraintsForm
            sizeCapabilities={config.sizeCapabilities}
            colorConstraints={config.colorConstraints}
            quantityConstraints={config.quantityConstraints}
            garmentCompatibility={config.garmentCompatibility}
            specialOptions={config.specialOptions}
            onUpdate={(updates) => updateConfig(updates)}
          />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentMappingForm
            equipmentMapping={config.equipmentMapping}
            onUpdate={(equipmentMapping) => updateConfig({ equipmentMapping })}
          />
        </TabsContent>

        <TabsContent value="quality">
          <QualityStandardsForm
            qualityStandards={config.qualityStandards}
            onUpdate={(qualityStandards) => updateConfig({ qualityStandards })}
          />
        </TabsContent>

        <TabsContent value="turnaround">
          <TurnaroundTimesForm
            turnaroundTimes={config.turnaroundTimes}
            onUpdate={(turnaroundTimes) => updateConfig({ turnaroundTimes })}
          />
        </TabsContent>

        <TabsContent value="artwork">
          <ArtworkRequirementsForm
            customerArtTypes={config.customerArtTypes}
            productionFileTypes={config.productionFileTypes}
            artworkInstructions={config.artworkInstructions}
            technicalRequirements={config.technicalRequirements}
            onUpdate={(updates) => updateConfig(updates)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}