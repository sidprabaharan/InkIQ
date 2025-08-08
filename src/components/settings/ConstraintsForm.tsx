import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SizeCapability, ColorConstraints, QuantityConstraints, GarmentCompatibility } from '@/types/imprint-config';
import { GarmentType, GarmentSize, ImprintPlacement } from '@/types/equipment';

interface ConstraintsFormProps {
  sizeCapabilities: SizeCapability;
  colorConstraints: ColorConstraints;
  quantityConstraints: QuantityConstraints;
  garmentCompatibility: GarmentCompatibility;
  specialOptions: {
    oversizeCapable: boolean;
    oversizeSurcharge?: number;
    difficultPlacementSurcharge?: number;
    multiLocationDiscount?: number;
  };
  onUpdate: (updates: any) => void;
}

const GARMENT_TYPES: { value: GarmentType; label: string }[] = [
  { value: 'tshirt', label: 'T-Shirt' },
  { value: 'polo', label: 'Polo Shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'sweatshirt', label: 'Sweatshirt' },
  { value: 'jacket', label: 'Jacket' },
  { value: 'tank_top', label: 'Tank Top' },
  { value: 'long_sleeve', label: 'Long Sleeve' }
];

const GARMENT_SIZES: { value: GarmentSize; label: string }[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: 'XXXL', label: 'XXXL' },
  { value: 'XXXXL', label: 'XXXXL' }
];

const IMPRINT_PLACEMENTS: { value: ImprintPlacement; label: string }[] = [
  { value: 'front_center', label: 'Front Center' },
  { value: 'front_left_chest', label: 'Front Left Chest' },
  { value: 'front_right_chest', label: 'Front Right Chest' },
  { value: 'back_center', label: 'Back Center' },
  { value: 'back_upper', label: 'Back Upper' },
  { value: 'back_lower', label: 'Back Lower' },
  { value: 'left_sleeve', label: 'Left Sleeve' },
  { value: 'right_sleeve', label: 'Right Sleeve' },
  { value: 'pocket', label: 'Pocket' },
  { value: 'collar', label: 'Collar' }
];

const INK_TYPES = [
  'Plastisol',
  'Water-based',
  'Discharge',
  'Metallic',
  'Glitter',
  'Glow-in-the-dark',
  'Reflective',
  'Puff',
  'Suede',
  'Gel'
];

export function ConstraintsForm({
  sizeCapabilities,
  colorConstraints,
  quantityConstraints,
  garmentCompatibility,
  specialOptions,
  onUpdate
}: ConstraintsFormProps) {
  
  const updateSizeCapabilities = (updates: Partial<SizeCapability>) => {
    onUpdate({ sizeCapabilities: { ...sizeCapabilities, ...updates } });
  };

  const updateColorConstraints = (updates: Partial<ColorConstraints>) => {
    onUpdate({ colorConstraints: { ...colorConstraints, ...updates } });
  };

  const updateQuantityConstraints = (updates: Partial<QuantityConstraints>) => {
    onUpdate({ quantityConstraints: { ...quantityConstraints, ...updates } });
  };

  const updateGarmentCompatibility = (updates: Partial<GarmentCompatibility>) => {
    onUpdate({ garmentCompatibility: { ...garmentCompatibility, ...updates } });
  };

  const updateSpecialOptions = (updates: any) => {
    onUpdate({ specialOptions: { ...specialOptions, ...updates } });
  };

  const toggleGarmentType = (type: GarmentType, checked: boolean) => {
    const updated = checked
      ? [...garmentCompatibility.supportedGarmentTypes, type]
      : garmentCompatibility.supportedGarmentTypes.filter(t => t !== type);
    updateGarmentCompatibility({ supportedGarmentTypes: updated });
  };

  const toggleSize = (size: GarmentSize, checked: boolean) => {
    const updated = checked
      ? [...garmentCompatibility.supportedSizes, size]
      : garmentCompatibility.supportedSizes.filter(s => s !== size);
    updateGarmentCompatibility({ supportedSizes: updated });
  };

  const togglePlacement = (placement: ImprintPlacement, checked: boolean) => {
    const updated = checked
      ? [...garmentCompatibility.supportedPlacements, placement]
      : garmentCompatibility.supportedPlacements.filter(p => p !== placement);
    updateGarmentCompatibility({ supportedPlacements: updated });
  };

  const toggleInkType = (inkType: string, checked: boolean) => {
    const updated = checked
      ? [...colorConstraints.supportedInkTypes, inkType]
      : colorConstraints.supportedInkTypes.filter(i => i !== inkType);
    updateColorConstraints({ supportedInkTypes: updated });
  };

  return (
    <div className="space-y-6">
      {/* Size Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Size Capabilities</CardTitle>
          <CardDescription>Physical size limitations for this imprint method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Max Width (inches)</Label>
              <Input
                type="number"
                step="0.25"
                value={sizeCapabilities.maxWidth}
                onChange={(e) => updateSizeCapabilities({ maxWidth: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Height (inches)</Label>
              <Input
                type="number"
                step="0.25"
                value={sizeCapabilities.maxHeight}
                onChange={(e) => updateSizeCapabilities({ maxHeight: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Min Width (inches)</Label>
              <Input
                type="number"
                step="0.25"
                value={sizeCapabilities.minWidth}
                onChange={(e) => updateSizeCapabilities({ minWidth: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Min Height (inches)</Label>
              <Input
                type="number"
                step="0.25"
                value={sizeCapabilities.minHeight}
                onChange={(e) => updateSizeCapabilities({ minHeight: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          {sizeCapabilities.notes && (
            <div className="mt-4 space-y-2">
              <Label>Size Notes</Label>
              <Textarea
                value={sizeCapabilities.notes}
                onChange={(e) => updateSizeCapabilities({ notes: e.target.value })}
                placeholder="Additional size constraints or notes..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Color Constraints */}
      <Card>
        <CardHeader>
          <CardTitle>Color Constraints</CardTitle>
          <CardDescription>Color limitations and pricing for this method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="unlimited-colors"
              checked={colorConstraints.unlimitedColors}
              onCheckedChange={(unlimitedColors) => updateColorConstraints({ unlimitedColors })}
            />
            <Label htmlFor="unlimited-colors">Unlimited Colors</Label>
          </div>

          {!colorConstraints.unlimitedColors && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Max Colors</Label>
                <Input
                  type="number"
                  value={colorConstraints.maxColors}
                  onChange={(e) => updateColorConstraints({ maxColors: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Additional Color Fee ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={colorConstraints.additionalColorFee}
                  onChange={(e) => updateColorConstraints({ additionalColorFee: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pantone Matching ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={colorConstraints.pantoneMatchingFee || 0}
                  onChange={(e) => updateColorConstraints({ pantoneMatchingFee: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Metallic Surcharge ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={colorConstraints.metallicSurcharge || 0}
                  onChange={(e) => updateColorConstraints({ metallicSurcharge: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Supported Ink Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {INK_TYPES.map((inkType) => (
                <div key={inkType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ink-${inkType}`}
                    checked={colorConstraints.supportedInkTypes.includes(inkType)}
                    onCheckedChange={(checked) => toggleInkType(inkType, !!checked)}
                  />
                  <Label htmlFor={`ink-${inkType}`} className="text-sm">{inkType}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantity Constraints */}
      <Card>
        <CardHeader>
          <CardTitle>Quantity Constraints</CardTitle>
          <CardDescription>Minimum and maximum quantity limitations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Minimum Quantity</Label>
              <Input
                type="number"
                value={quantityConstraints.minimumQuantity}
                onChange={(e) => updateQuantityConstraints({ minimumQuantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Quantity</Label>
              <Input
                type="number"
                value={quantityConstraints.maximumQuantity}
                onChange={(e) => updateQuantityConstraints({ maximumQuantity: parseInt(e.target.value) || 1000 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Optimal Min</Label>
              <Input
                type="number"
                value={quantityConstraints.optimalQuantityRange.min}
                onChange={(e) => updateQuantityConstraints({ 
                  optimalQuantityRange: { 
                    ...quantityConstraints.optimalQuantityRange, 
                    min: parseInt(e.target.value) || 1 
                  } 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Optimal Max</Label>
              <Input
                type="number"
                value={quantityConstraints.optimalQuantityRange.max}
                onChange={(e) => updateQuantityConstraints({ 
                  optimalQuantityRange: { 
                    ...quantityConstraints.optimalQuantityRange, 
                    max: parseInt(e.target.value) || 100 
                  } 
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garment Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle>Garment Compatibility</CardTitle>
          <CardDescription>Supported garment types, sizes, and placements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Supported Garment Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {GARMENT_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`garment-${type.value}`}
                    checked={garmentCompatibility.supportedGarmentTypes.includes(type.value)}
                    onCheckedChange={(checked) => toggleGarmentType(type.value, !!checked)}
                  />
                  <Label htmlFor={`garment-${type.value}`} className="text-sm">{type.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Supported Sizes</Label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {GARMENT_SIZES.map((size) => (
                <div key={size.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size.value}`}
                    checked={garmentCompatibility.supportedSizes.includes(size.value)}
                    onCheckedChange={(checked) => toggleSize(size.value, !!checked)}
                  />
                  <Label htmlFor={`size-${size.value}`} className="text-sm">{size.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Supported Placements</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {IMPRINT_PLACEMENTS.map((placement) => (
                <div key={placement.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`placement-${placement.value}`}
                    checked={garmentCompatibility.supportedPlacements.includes(placement.value)}
                    onCheckedChange={(checked) => togglePlacement(placement.value, !!checked)}
                  />
                  <Label htmlFor={`placement-${placement.value}`} className="text-sm">{placement.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Options */}
      <Card>
        <CardHeader>
          <CardTitle>Special Options</CardTitle>
          <CardDescription>Additional capabilities and surcharges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="oversize-capable"
              checked={specialOptions.oversizeCapable}
              onCheckedChange={(oversizeCapable) => updateSpecialOptions({ oversizeCapable })}
            />
            <Label htmlFor="oversize-capable">Oversize Capable</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Oversize Surcharge ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={specialOptions.oversizeSurcharge || 0}
                onChange={(e) => updateSpecialOptions({ oversizeSurcharge: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Difficult Placement Surcharge ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={specialOptions.difficultPlacementSurcharge || 0}
                onChange={(e) => updateSpecialOptions({ difficultPlacementSurcharge: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Multi-Location Discount (%)</Label>
              <Input
                type="number"
                step="1"
                value={specialOptions.multiLocationDiscount || 0}
                onChange={(e) => updateSpecialOptions({ multiLocationDiscount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}