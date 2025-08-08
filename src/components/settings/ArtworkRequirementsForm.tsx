import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ArtworkRequirementsFormProps {
  customerArtTypes: string[];
  productionFileTypes: string[];
  artworkInstructions: string;
  technicalRequirements: string[];
  onUpdate: (updates: {
    customerArtTypes?: string[];
    productionFileTypes?: string[];
    artworkInstructions?: string;
    technicalRequirements?: string[];
  }) => void;
}

const COMMON_FILE_TYPES = [
  'PDF', 'AI', 'EPS', 'SVG', 'PNG', 'JPG', 'JPEG', 'PSD', 'TIFF', 'BMP'
];

export function ArtworkRequirementsForm({
  customerArtTypes,
  productionFileTypes,
  artworkInstructions,
  technicalRequirements,
  onUpdate
}: ArtworkRequirementsFormProps) {

  const addCustomerArtType = (type: string) => {
    if (type && !customerArtTypes.includes(type)) {
      onUpdate({ customerArtTypes: [...customerArtTypes, type] });
    }
  };

  const removeCustomerArtType = (type: string) => {
    onUpdate({ customerArtTypes: customerArtTypes.filter(t => t !== type) });
  };

  const addProductionFileType = (type: string) => {
    if (type && !productionFileTypes.includes(type)) {
      onUpdate({ productionFileTypes: [...productionFileTypes, type] });
    }
  };

  const removeProductionFileType = (type: string) => {
    onUpdate({ productionFileTypes: productionFileTypes.filter(t => t !== type) });
  };

  const addTechnicalRequirement = (requirement: string) => {
    if (requirement && !technicalRequirements.includes(requirement)) {
      onUpdate({ technicalRequirements: [...technicalRequirements, requirement] });
    }
  };

  const removeTechnicalRequirement = (requirement: string) => {
    onUpdate({ technicalRequirements: technicalRequirements.filter(req => req !== requirement) });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Artwork Types</CardTitle>
          <CardDescription>
            File formats that customers can submit for artwork
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter file type (e.g., PDF)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addCustomerArtType(e.currentTarget.value.toUpperCase());
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addCustomerArtType(input.value.toUpperCase());
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Quick Add Common Types:</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_FILE_TYPES.filter(type => !customerArtTypes.includes(type)).map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => addCustomerArtType(type)}
                >
                  + {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {customerArtTypes.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => removeCustomerArtType(type)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production File Types</CardTitle>
          <CardDescription>
            File formats required for production workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter production file type"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addProductionFileType(e.currentTarget.value.toUpperCase());
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addProductionFileType(input.value.toUpperCase());
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {productionFileTypes.map((type) => (
              <Badge key={type} variant="outline" className="flex items-center gap-1">
                {type}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => removeProductionFileType(type)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artwork Instructions</CardTitle>
          <CardDescription>
            General instructions for customers submitting artwork
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={artworkInstructions}
            onChange={(e) => onUpdate({ artworkInstructions: e.target.value })}
            placeholder="Enter detailed instructions for artwork submission..."
            rows={6}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Requirements</CardTitle>
          <CardDescription>
            Specific technical requirements for artwork files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter technical requirement"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTechnicalRequirement(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addTechnicalRequirement(input.value);
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {technicalRequirements.map((req) => (
              <Badge key={req} variant="secondary" className="flex items-center gap-1">
                {req}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => removeTechnicalRequirement(req)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}