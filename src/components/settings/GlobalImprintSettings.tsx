import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface GlobalImprintSettingsProps {
  settings: {
    allowCustomPricing: boolean;
    requireApprovalAboveThreshold: number;
    autoCalculateRushFees: boolean;
    defaultTaxRate: number;
  };
  onUpdate: (settings: any) => void;
}

export function GlobalImprintSettings({ settings, onUpdate }: GlobalImprintSettingsProps) {
  const updateSetting = (key: string, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Imprint Settings</CardTitle>
          <CardDescription>
            System-wide settings that apply to all imprint methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Custom Pricing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow sales team to override calculated pricing
                </p>
              </div>
              <Switch
                checked={settings.allowCustomPricing}
                onCheckedChange={(value) => updateSetting('allowCustomPricing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Calculate Rush Fees</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically apply rush surcharges based on turnaround time
                </p>
              </div>
              <Switch
                checked={settings.autoCalculateRushFees}
                onCheckedChange={(value) => updateSetting('autoCalculateRushFees', value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="approval-threshold">Approval Threshold ($)</Label>
              <Input
                id="approval-threshold"
                type="number"
                step="0.01"
                value={settings.requireApprovalAboveThreshold}
                onChange={(e) => updateSetting('requireApprovalAboveThreshold', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Orders above this amount require manager approval
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-tax-rate">Default Tax Rate</Label>
              <Input
                id="default-tax-rate"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={settings.defaultTaxRate}
                onChange={(e) => updateSetting('defaultTaxRate', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Default tax rate (as decimal, e.g., 0.13 for 13%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Rules</CardTitle>
          <CardDescription>
            Configure automatic pricing adjustments and validations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Margin (%)</Label>
              <Input
                type="number"
                step="1"
                placeholder="25"
              />
              <p className="text-xs text-muted-foreground">
                Minimum profit margin required for all quotes
              </p>
            </div>

            <div className="space-y-2">
              <Label>Volume Discount Threshold</Label>
              <Input
                type="number"
                placeholder="500"
              />
              <p className="text-xs text-muted-foreground">
                Quantity threshold for automatic volume discounts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>
            Configure integrations with external systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sync with Production System</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update production schedules when quotes are approved
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Real-time Equipment Status</Label>
                <p className="text-sm text-muted-foreground">
                  Check equipment availability before scheduling jobs
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inventory Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Validate garment availability before finalizing quotes
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}