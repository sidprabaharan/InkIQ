import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { QualityStandards } from '@/types/imprint-config';

interface QualityStandardsFormProps {
  qualityStandards: QualityStandards;
  onUpdate: (standards: QualityStandards) => void;
}

export function QualityStandardsForm({ qualityStandards, onUpdate }: QualityStandardsFormProps) {
  const updateStandards = (updates: Partial<QualityStandards>) => {
    onUpdate({ ...qualityStandards, ...updates });
  };

  const addArtworkRequirement = (requirement: string) => {
    if (requirement && !qualityStandards.artworkRequirements.includes(requirement)) {
      updateStandards({
        artworkRequirements: [...qualityStandards.artworkRequirements, requirement]
      });
    }
  };

  const removeArtworkRequirement = (requirement: string) => {
    updateStandards({
      artworkRequirements: qualityStandards.artworkRequirements.filter(req => req !== requirement)
    });
  };

  const addQualityCheckpoint = (checkpoint: string) => {
    if (checkpoint && !qualityStandards.qualityCheckpoints.includes(checkpoint)) {
      updateStandards({
        qualityCheckpoints: [...qualityStandards.qualityCheckpoints, checkpoint]
      });
    }
  };

  const removeQualityCheckpoint = (checkpoint: string) => {
    updateStandards({
      qualityCheckpoints: qualityStandards.qualityCheckpoints.filter(cp => cp !== checkpoint)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Standards</CardTitle>
        <CardDescription>
          Configure quality requirements and tolerances for this imprint method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="proofing-required"
            checked={qualityStandards.proofingRequired}
            onCheckedChange={(proofingRequired) => updateStandards({ proofingRequired })}
          />
          <Label htmlFor="proofing-required">Proofing Required</Label>
        </div>

        <div className="space-y-3">
          <Label>Artwork Requirements</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter artwork requirement"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addArtworkRequirement(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addArtworkRequirement(input.value);
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {qualityStandards.artworkRequirements.map((req) => (
              <Badge key={req} variant="secondary" className="flex items-center gap-1">
                {req}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => removeArtworkRequirement(req)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Quality Checkpoints</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter quality checkpoint"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addQualityCheckpoint(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addQualityCheckpoint(input.value);
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {qualityStandards.qualityCheckpoints.map((cp) => (
              <Badge key={cp} variant="outline" className="flex items-center gap-1">
                {cp}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => removeQualityCheckpoint(cp)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tolerances</CardTitle>
            <CardDescription>Acceptable variances for production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Position Tolerance (inches)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={qualityStandards.tolerances.positionTolerance}
                  onChange={(e) => updateStandards({
                    tolerances: {
                      ...qualityStandards.tolerances,
                      positionTolerance: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Size Tolerance (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={qualityStandards.tolerances.sizeTolerance}
                  onChange={(e) => updateStandards({
                    tolerances: {
                      ...qualityStandards.tolerances,
                      sizeTolerance: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color Tolerance</Label>
                <Input
                  value={qualityStandards.tolerances.colorTolerance}
                  onChange={(e) => updateStandards({
                    tolerances: {
                      ...qualityStandards.tolerances,
                      colorTolerance: e.target.value
                    }
                  })}
                  placeholder="e.g., Delta E <3"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}