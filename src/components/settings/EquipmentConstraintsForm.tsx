import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { EquipmentConstraints, GarmentType, GarmentSize, ImprintPlacement } from '@/types/equipment';

interface EquipmentConstraintsFormProps {
  constraints: EquipmentConstraints;
  onChange: (constraints: EquipmentConstraints) => void;
  equipmentType: string;
}

const GARMENT_TYPES: { value: GarmentType; label: string; category: string }[] = [
  { value: 'tshirt', label: 'T-Shirt', category: 'Shirts' },
  { value: 'polo', label: 'Polo', category: 'Shirts' },
  { value: 'hoodie', label: 'Hoodie', category: 'Outerwear' },
  { value: 'sweatshirt', label: 'Sweatshirt', category: 'Outerwear' },
  { value: 'tank_top', label: 'Tank Top', category: 'Shirts' },
  { value: 'long_sleeve', label: 'Long Sleeve', category: 'Shirts' },
  { value: 'cap', label: 'Cap', category: 'Headwear' },
  { value: 'beanie', label: 'Beanie', category: 'Headwear' },
  { value: 'baseball_hat', label: 'Baseball Hat', category: 'Headwear' },
  { value: 'snapback', label: 'Snapback', category: 'Headwear' },
  { value: 'tote_bag', label: 'Tote Bag', category: 'Accessories' },
  { value: 'apron', label: 'Apron', category: 'Accessories' },
  { value: 'jacket', label: 'Jacket', category: 'Outerwear' },
  { value: 'vest', label: 'Vest', category: 'Outerwear' },
];

const GARMENT_SIZES: { value: GarmentSize; label: string; category: string }[] = [
  { value: 'XS', label: 'XS', category: 'Adult' },
  { value: 'S', label: 'S', category: 'Adult' },
  { value: 'M', label: 'M', category: 'Adult' },
  { value: 'L', label: 'L', category: 'Adult' },
  { value: 'XL', label: 'XL', category: 'Adult' },
  { value: 'XXL', label: 'XXL', category: 'Adult' },
  { value: 'XXXL', label: 'XXXL', category: 'Adult' },
  { value: 'Youth_XS', label: 'Youth XS', category: 'Youth' },
  { value: 'Youth_S', label: 'Youth S', category: 'Youth' },
  { value: 'Youth_M', label: 'Youth M', category: 'Youth' },
  { value: 'Youth_L', label: 'Youth L', category: 'Youth' },
  { value: 'Youth_XL', label: 'Youth XL', category: 'Youth' },
];

const IMPRINT_PLACEMENTS: { value: ImprintPlacement; label: string; category: string }[] = [
  { value: 'front_center', label: 'Front Center', category: 'Front' },
  { value: 'front_left_chest', label: 'Front Left Chest', category: 'Front' },
  { value: 'front_right_chest', label: 'Front Right Chest', category: 'Front' },
  { value: 'back_center', label: 'Back Center', category: 'Back' },
  { value: 'back_upper', label: 'Back Upper', category: 'Back' },
  { value: 'back_lower', label: 'Back Lower', category: 'Back' },
  { value: 'left_sleeve', label: 'Left Sleeve', category: 'Sleeves' },
  { value: 'right_sleeve', label: 'Right Sleeve', category: 'Sleeves' },
  { value: 'cap_front', label: 'Cap Front', category: 'Headwear' },
  { value: 'cap_back', label: 'Cap Back', category: 'Headwear' },
  { value: 'cap_side', label: 'Cap Side', category: 'Headwear' },
];

export function EquipmentConstraintsForm({ constraints, onChange, equipmentType }: EquipmentConstraintsFormProps) {
  const updateConstraints = (updates: Partial<EquipmentConstraints>) => {
    onChange({ ...constraints, ...updates });
  };

  const toggleGarmentType = (garmentType: GarmentType, checked: boolean) => {
    if (checked) {
      updateConstraints({
        supportedGarmentTypes: [...constraints.supportedGarmentTypes, garmentType]
      });
    } else {
      updateConstraints({
        supportedGarmentTypes: constraints.supportedGarmentTypes.filter(t => t !== garmentType)
      });
    }
  };

  const toggleSize = (size: GarmentSize, checked: boolean) => {
    if (checked) {
      updateConstraints({
        supportedSizes: [...constraints.supportedSizes, size]
      });
    } else {
      updateConstraints({
        supportedSizes: constraints.supportedSizes.filter(s => s !== size)
      });
    }
  };

  const togglePlacement = (placement: ImprintPlacement, checked: boolean) => {
    if (checked) {
      updateConstraints({
        supportedPlacements: [...constraints.supportedPlacements, placement]
      });
    } else {
      updateConstraints({
        supportedPlacements: constraints.supportedPlacements.filter(p => p !== placement)
      });
    }
  };

  const garmentTypesByCategory = GARMENT_TYPES.reduce((acc, garment) => {
    if (!acc[garment.category]) {
      acc[garment.category] = [];
    }
    acc[garment.category].push(garment);
    return acc;
  }, {} as Record<string, typeof GARMENT_TYPES>);

  const sizesByCategory = GARMENT_SIZES.reduce((acc, size) => {
    if (!acc[size.category]) {
      acc[size.category] = [];
    }
    acc[size.category].push(size);
    return acc;
  }, {} as Record<string, typeof GARMENT_SIZES>);

  const placementsByCategory = IMPRINT_PLACEMENTS.reduce((acc, placement) => {
    if (!acc[placement.category]) {
      acc[placement.category] = [];
    }
    acc[placement.category].push(placement);
    return acc;
  }, {} as Record<string, typeof IMPRINT_PLACEMENTS>);

  return (
    <div className="space-y-6">
      {/* Color/Screen Constraints - Production Critical */}
      {(equipmentType === 'screen_printing' || equipmentType === 'embroidery') && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-primary">
              Color & Screen Limitations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {equipmentType === 'embroidery' 
                ? 'Set maximum thread colors (typically 9, 12, or 15 colors)'
                : 'Set maximum screens (typically 6, 12, or 20 screens)'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxColors" className="text-sm font-medium">
                  Max Colors {equipmentType === 'embroidery' ? '(Thread Colors)' : ''}
                </Label>
                <Input
                  id="maxColors"
                  type="number"
                  value={constraints.maxColors || ''}
                  onChange={(e) => updateConstraints({ maxColors: parseInt(e.target.value) || undefined })}
                  placeholder={equipmentType === 'embroidery' ? "9, 12, 15" : "6, 8, 12"}
                  className="font-medium"
                />
              </div>
              {equipmentType === 'screen_printing' && (
                <div>
                  <Label htmlFor="maxScreens" className="text-sm font-medium">Max Screens</Label>
                  <Input
                    id="maxScreens"
                    type="number"
                    value={constraints.maxScreens || ''}
                    onChange={(e) => updateConstraints({ maxScreens: parseInt(e.target.value) || undefined })}
                    placeholder="6, 12, 20"
                    className="font-medium"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Size Constraints */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Size Constraints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxWidth">Max Imprint Width (inches)</Label>
              <Input
                id="maxWidth"
                type="number"
                step="0.1"
                value={constraints.maxImprintWidth}
                onChange={(e) => updateConstraints({ maxImprintWidth: parseFloat(e.target.value) })}
                placeholder="e.g., 14"
              />
            </div>
            <div>
              <Label htmlFor="maxHeight">Max Imprint Height (inches)</Label>
              <Input
                id="maxHeight"
                type="number"
                step="0.1"
                value={constraints.maxImprintHeight}
                onChange={(e) => updateConstraints({ maxImprintHeight: parseFloat(e.target.value) })}
                placeholder="e.g., 18"
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium">Supported Garment Sizes</Label>
            <div className="space-y-3 mt-2">
              {Object.entries(sizesByCategory).map(([category, sizes]) => (
                <div key={category}>
                  <Label className="text-xs text-muted-foreground">{category}</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {sizes.map((size) => (
                      <div key={size.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size.value}`}
                          checked={constraints.supportedSizes.includes(size.value)}
                          onCheckedChange={(checked) => toggleSize(size.value, checked as boolean)}
                        />
                        <Label htmlFor={`size-${size.value}`} className="text-xs">
                          {size.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garment Type Constraints */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Supported Garment Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(garmentTypesByCategory).map(([category, garments]) => (
              <div key={category}>
                <Label className="text-xs text-muted-foreground">{category}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {garments.map((garment) => (
                    <div key={garment.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`garment-${garment.value}`}
                        checked={constraints.supportedGarmentTypes.includes(garment.value)}
                        onCheckedChange={(checked) => toggleGarmentType(garment.value, checked as boolean)}
                      />
                      <Label htmlFor={`garment-${garment.value}`} className="text-xs">
                        {garment.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Placement Constraints */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Supported Imprint Placements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(placementsByCategory).map(([category, placements]) => (
              <div key={category}>
                <Label className="text-xs text-muted-foreground">{category}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {placements.map((placement) => (
                    <div key={placement.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`placement-${placement.value}`}
                        checked={constraints.supportedPlacements.includes(placement.value)}
                        onCheckedChange={(checked) => togglePlacement(placement.value, checked as boolean)}
                      />
                      <Label htmlFor={`placement-${placement.value}`} className="text-xs">
                        {placement.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quantity Constraints */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quantity Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minQuantity">Min Quantity per Run</Label>
              <Input
                id="minQuantity"
                type="number"
                value={constraints.minQuantityPerRun}
                onChange={(e) => updateConstraints({ minQuantityPerRun: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="maxQuantity">Max Quantity per Run</Label>
              <Input
                id="maxQuantity"
                type="number"
                value={constraints.maxQuantityPerRun}
                onChange={(e) => updateConstraints({ maxQuantityPerRun: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Special Capabilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="multiColor">Multi-Color Registration</Label>
            <Switch
              id="multiColor"
              checked={constraints.supportsMultiColorRegistration || false}
              onCheckedChange={(checked) => updateConstraints({ supportsMultiColorRegistration: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="fourColor">Four Color Process</Label>
            <Switch
              id="fourColor"
              checked={constraints.supportsFourColorProcess || false}
              onCheckedChange={(checked) => updateConstraints({ supportsFourColorProcess: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="metallic">Metallic Inks</Label>
            <Switch
              id="metallic"
              checked={constraints.supportsMetallicInks || false}
              onCheckedChange={(checked) => updateConstraints({ supportsMetallicInks: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="waterBased">Water-Based Inks</Label>
            <Switch
              id="waterBased"
              checked={constraints.supportsWaterBased || false}
              onCheckedChange={(checked) => updateConstraints({ supportsWaterBased: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Setup Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Setup Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="specialSetup">Requires Special Setup</Label>
            <Switch
              id="specialSetup"
              checked={constraints.requiresSpecialSetup || false}
              onCheckedChange={(checked) => updateConstraints({ requiresSpecialSetup: checked })}
            />
          </div>
          {constraints.requiresSpecialSetup && (
            <div>
              <Label htmlFor="setupNotes">Setup Notes</Label>
              <Textarea
                id="setupNotes"
                value={constraints.setupNotes || ''}
                onChange={(e) => updateConstraints({ setupNotes: e.target.value })}
                placeholder="Describe any special setup requirements..."
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}