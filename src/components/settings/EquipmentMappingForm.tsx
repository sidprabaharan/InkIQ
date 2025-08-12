import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { EquipmentMapping } from '@/types/imprint-config';

interface EquipmentMappingFormProps {
  equipmentMapping: EquipmentMapping;
  onUpdate: (mapping: EquipmentMapping) => void;
}

const EQUIPMENT_TYPES = [
  'screen_press_manual',
  'screen_press_automatic',
  'embroidery_single_head',
  'embroidery_multi_head',
  'dtg_printer',
  'dtf_printer',
  'vinyl_cutter',
  'heat_press',
  'sublimation_printer',
  'laser_engraver'
];

export function EquipmentMappingForm({ equipmentMapping, onUpdate }: EquipmentMappingFormProps) {
  const updateMapping = (updates: Partial<EquipmentMapping>) => {
    onUpdate({ ...equipmentMapping, ...updates });
  };

  const addSecondaryEquipment = (equipmentId: string) => {
    if (equipmentId && !equipmentMapping.secondaryEquipmentIds.includes(equipmentId)) {
      updateMapping({
        secondaryEquipmentIds: [...equipmentMapping.secondaryEquipmentIds, equipmentId]
      });
    }
  };

  const removeSecondaryEquipment = (equipmentId: string) => {
    updateMapping({
      secondaryEquipmentIds: equipmentMapping.secondaryEquipmentIds.filter(id => id !== equipmentId)
    });
  };

  const addSetupRequirement = (requirement: string) => {
    if (requirement && !equipmentMapping.setupRequirements.includes(requirement)) {
      updateMapping({
        setupRequirements: [...equipmentMapping.setupRequirements, requirement]
      });
    }
  };

  const removeSetupRequirement = (requirement: string) => {
    updateMapping({
      setupRequirements: equipmentMapping.setupRequirements.filter(req => req !== requirement)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Mapping</CardTitle>
        <CardDescription>
          Configure which equipment can be used for this imprint method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Equipment ID</Label>
            <Input
              value={equipmentMapping.primaryEquipmentId || ''}
              onChange={(e) => updateMapping({ primaryEquipmentId: e.target.value })}
              placeholder="e.g., SCREEN_001"
            />
          </div>
          <div className="space-y-2">
            <Label>Preferred Equipment Type</Label>
            <Select
              value={equipmentMapping.preferredEquipmentType}
              onValueChange={(value) => updateMapping({ preferredEquipmentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment type" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fallback Equipment Type</Label>
          <Select
            value={equipmentMapping.fallbackEquipmentType || 'none'}
            onValueChange={(value) => updateMapping({ fallbackEquipmentType: value === "none" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fallback equipment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {EQUIPMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Secondary Equipment IDs</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter equipment ID"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSecondaryEquipment(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addSecondaryEquipment(input.value);
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {equipmentMapping.secondaryEquipmentIds.map((id) => (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                {id}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => removeSecondaryEquipment(id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Setup Requirements</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter setup requirement"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSetupRequirement(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addSetupRequirement(input.value);
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {equipmentMapping.setupRequirements.map((req) => (
              <Badge key={req} variant="outline" className="flex items-center gap-1">
                {req}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => removeSetupRequirement(req)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}