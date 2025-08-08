import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { PricingTier } from '@/types/imprint-config';

interface PricingTiersFormProps {
  pricingTiers: PricingTier[];
  onUpdate: (tiers: PricingTier[]) => void;
}

export function PricingTiersForm({ pricingTiers, onUpdate }: PricingTiersFormProps) {
  const addTier = () => {
    const lastTier = pricingTiers[pricingTiers.length - 1];
    const newTier: PricingTier = {
      minQuantity: lastTier ? lastTier.maxQuantity + 1 : 1,
      maxQuantity: lastTier ? lastTier.maxQuantity + 100 : 100,
      basePrice: lastTier ? lastTier.basePrice - 0.25 : 5.00,
      setupFee: lastTier ? lastTier.setupFee : 50.00,
      additionalColorPrice: lastTier ? lastTier.additionalColorPrice : 1.00
    };
    onUpdate([...pricingTiers, newTier]);
  };

  const updateTier = (index: number, updates: Partial<PricingTier>) => {
    const updatedTiers = pricingTiers.map((tier, i) => 
      i === index ? { ...tier, ...updates } : tier
    );
    onUpdate(updatedTiers);
  };

  const deleteTier = (index: number) => {
    onUpdate(pricingTiers.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pricing Tiers</CardTitle>
            <CardDescription>
              Configure quantity-based pricing tiers
            </CardDescription>
          </div>
          <Button onClick={addTier} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    Tier {index + 1}: {tier.minQuantity}-{tier.maxQuantity} pieces
                  </CardTitle>
                  {pricingTiers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTier(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Min Quantity</Label>
                    <Input
                      type="number"
                      value={tier.minQuantity}
                      onChange={(e) => updateTier(index, { minQuantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Quantity</Label>
                    <Input
                      type="number"
                      value={tier.maxQuantity}
                      onChange={(e) => updateTier(index, { maxQuantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Base Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tier.basePrice}
                      onChange={(e) => updateTier(index, { basePrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Setup Fee ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tier.setupFee}
                      onChange={(e) => updateTier(index, { setupFee: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Additional Color Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tier.additionalColorPrice || 0}
                      onChange={(e) => updateTier(index, { additionalColorPrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rush Surcharge ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tier.rushSurcharge || 0}
                      onChange={(e) => updateTier(index, { rushSurcharge: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm font-medium mb-2">Price Examples:</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      1 Color: ${(tier.basePrice + (tier.setupFee / Math.max(tier.minQuantity, 1))).toFixed(2)}/piece
                    </div>
                    <div>
                      2 Colors: ${(tier.basePrice + (tier.additionalColorPrice || 0) + (tier.setupFee / Math.max(tier.minQuantity, 1))).toFixed(2)}/piece
                    </div>
                    <div>
                      Rush: +${tier.rushSurcharge || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}