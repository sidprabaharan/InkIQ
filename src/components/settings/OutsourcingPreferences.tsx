import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { IMPRINT_METHODS } from '@/types/imprint';
import type { OutsourcingPreferences } from '@/types/decorator';
import { toast } from 'sonner';

interface OutsourcingPreferencesProps {
  preferences?: OutsourcingPreferences;
  onSave: (preferences: OutsourcingPreferences) => void;
}

export function OutsourcingPreferences({ preferences, onSave }: OutsourcingPreferencesProps) {
  const [outsourcedMethods, setOutsourcedMethods] = useState<string[]>(
    preferences?.outsourcedMethods || []
  );
  const [autoApprovalLimit, setAutoApprovalLimit] = useState(
    preferences?.autoApprovalLimit || 1000
  );
  const [qualityRequirement, setQualityRequirement] = useState([
    preferences?.qualityRequirement || 4
  ]);
  const [maxLeadTime, setMaxLeadTime] = useState(
    preferences?.maxLeadTime || 7
  );

  const handleMethodToggle = (methodValue: string, checked: boolean) => {
    if (checked) {
      setOutsourcedMethods([...outsourcedMethods, methodValue]);
    } else {
      setOutsourcedMethods(outsourcedMethods.filter(m => m !== methodValue));
    }
  };

  const handleSave = () => {
    const newPreferences: OutsourcingPreferences = {
      userId: 'current-user', // This would come from auth context
      outsourcedMethods,
      inHouseMethods: IMPRINT_METHODS
        .map(m => m.value)
        .filter(m => !outsourcedMethods.includes(m)),
      autoApprovalLimit,
      preferredDecorators: preferences?.preferredDecorators || [],
      qualityRequirement: qualityRequirement[0],
      maxLeadTime,
      createdAt: preferences?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(newPreferences);
    toast('Outsourcing preferences saved successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Decoration Outsourcing</CardTitle>
          <CardDescription>
            Configure which decoration methods to outsource to our decorator network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Methods to Outsource</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select which decoration methods you want to automatically outsource to our decorator network
            </p>
            <div className="grid grid-cols-2 gap-4">
              {IMPRINT_METHODS.map((method) => (
                <div key={method.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={method.value}
                    checked={outsourcedMethods.includes(method.value)}
                    onCheckedChange={(checked) => 
                      handleMethodToggle(method.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={method.value} className="text-sm">
                    {method.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-medium">Current Selection</Label>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-sm font-medium text-green-600">Outsourced ({outsourcedMethods.length})</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {outsourcedMethods.map(method => {
                    const methodConfig = IMPRINT_METHODS.find(m => m.value === method);
                    return (
                      <Badge key={method} variant="secondary">
                        {methodConfig?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">
                  In-House ({IMPRINT_METHODS.length - outsourcedMethods.length})
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {IMPRINT_METHODS
                    .filter(m => !outsourcedMethods.includes(m.value))
                    .map(method => (
                      <Badge key={method.value} variant="outline">
                        {method.label}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="autoApproval">Auto-Approval Limit ($)</Label>
              <Input
                id="autoApproval"
                type="number"
                value={autoApprovalLimit}
                onChange={(e) => setAutoApprovalLimit(Number(e.target.value))}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Orders under this amount will be automatically approved
              </p>
            </div>

            <div>
              <Label>Minimum Quality Rating: {qualityRequirement[0]}/5</Label>
              <Slider
                value={qualityRequirement}
                onValueChange={setQualityRequirement}
                max={5}
                min={1}
                step={0.5}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Only decorators with this rating or higher will be considered
              </p>
            </div>

            <div>
              <Label htmlFor="maxLeadTime">Maximum Lead Time (days)</Label>
              <Input
                id="maxLeadTime"
                type="number"
                value={maxLeadTime}
                onChange={(e) => setMaxLeadTime(Number(e.target.value))}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum acceptable production time
              </p>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}