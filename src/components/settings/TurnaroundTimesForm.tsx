import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { TurnaroundTimes } from '@/types/imprint-config';

interface TurnaroundTimesFormProps {
  turnaroundTimes: TurnaroundTimes;
  onUpdate: (times: TurnaroundTimes) => void;
}

export function TurnaroundTimesForm({ turnaroundTimes, onUpdate }: TurnaroundTimesFormProps) {
  const updateTimes = (updates: Partial<TurnaroundTimes>) => {
    onUpdate({ ...turnaroundTimes, ...updates });
  };

  const addExpeditedOption = () => {
    const newOption = { days: 5, surcharge: 15 };
    updateTimes({
      expeditedOptions: [...turnaroundTimes.expeditedOptions, newOption]
    });
  };

  const updateExpeditedOption = (index: number, updates: Partial<{ days: number; surcharge: number }>) => {
    const updatedOptions = turnaroundTimes.expeditedOptions.map((option, i) =>
      i === index ? { ...option, ...updates } : option
    );
    updateTimes({ expeditedOptions: updatedOptions });
  };

  const removeExpeditedOption = (index: number) => {
    updateTimes({
      expeditedOptions: turnaroundTimes.expeditedOptions.filter((_, i) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Turnaround Times</CardTitle>
        <CardDescription>
          Configure standard and expedited turnaround options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Standard Turnaround (days)</Label>
            <Input
              type="number"
              value={turnaroundTimes.standardTurnaround}
              onChange={(e) => updateTimes({ standardTurnaround: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Rush Turnaround (days)</Label>
            <Input
              type="number"
              value={turnaroundTimes.rushTurnaround}
              onChange={(e) => updateTimes({ rushTurnaround: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Rush Fee (%)</Label>
            <Input
              type="number"
              value={turnaroundTimes.rushFee}
              onChange={(e) => updateTimes({ rushFee: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Expedited Options</CardTitle>
                <CardDescription>Additional rush options with custom surcharges</CardDescription>
              </div>
              <Button onClick={addExpeditedOption} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {turnaroundTimes.expeditedOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-md">
                  <div className="space-y-2 flex-1">
                    <Label className="text-sm">Days</Label>
                    <Input
                      type="number"
                      value={option.days}
                      onChange={(e) => updateExpeditedOption(index, { days: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label className="text-sm">Surcharge (%)</Label>
                    <Input
                      type="number"
                      value={option.surcharge}
                      onChange={(e) => updateExpeditedOption(index, { surcharge: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExpeditedOption(index)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">Turnaround Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <strong>Standard:</strong> {turnaroundTimes.standardTurnaround} business days
            </div>
            <div>
              <strong>Rush:</strong> {turnaroundTimes.rushTurnaround} days (+{turnaroundTimes.rushFee}%)
            </div>
            <div>
              <strong>Expedited:</strong> {turnaroundTimes.expeditedOptions.length} options available
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}