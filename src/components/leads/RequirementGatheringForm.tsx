import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Package, Palette, MapPin, Calculator } from 'lucide-react';

interface RequirementGatheringFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSave: (requirements: any) => void;
}

export default function RequirementGatheringForm({
  open,
  onOpenChange,
  leadId,
  onSave
}: RequirementGatheringFormProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    products: [],
    quantities: {},
    logo: null,
    printMethod: '',
    placement: '',
    colors: '',
    notes: ''
  });

  // Mock product catalog data
  const productCategories = [
    {
      id: 'apparel',
      name: 'Apparel',
      products: [
        { id: 't-shirt', name: 'T-Shirts', supplier: 'S&S Activewear' },
        { id: 'hoodie', name: 'Hoodies', supplier: 'Sanmar' },
        { id: 'polo', name: 'Polo Shirts', supplier: 'S&S Activewear' },
        { id: 'jacket', name: 'Jackets', supplier: 'HIT Promotions' }
      ]
    },
    {
      id: 'accessories',
      name: 'Accessories',
      products: [
        { id: 'hat', name: 'Hats & Caps', supplier: 'Sanmar' },
        { id: 'bag', name: 'Bags', supplier: 'HIT Promotions' },
        { id: 'mug', name: 'Mugs', supplier: 'HIT Promotions' }
      ]
    }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const printMethods = [
    { value: 'screen-print', label: 'Screen Printing', description: 'Best for large quantities, vibrant colors' },
    { value: 'embroidery', label: 'Embroidery', description: 'Professional look, durable, great for logos' },
    { value: 'both', label: 'Not Sure', description: 'Let us recommend the best option' }
  ];

  const placementOptions = [
    'Left Chest', 'Right Chest', 'Full Front', 'Full Back', 
    'Left Sleeve', 'Right Sleeve', 'Sleeve (Both)', 'Multiple Locations'
  ];

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Gather Order Requirements</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 w-fit">
              <TabsTrigger value="products" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="quantities" className="flex items-center space-x-2">
                <Calculator className="h-4 w-4" />
                <span>Quantities</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Design & Printing</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto px-6 pb-6">
              <TabsContent value="products" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {productCategories.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <h3 className="font-medium text-base">{category.name}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {category.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            >
                              <Checkbox id={product.id} />
                              <div className="flex-1">
                                <label 
                                  htmlFor={product.id}
                                  className="font-medium cursor-pointer"
                                >
                                  {product.name}
                                </label>
                                <div className="text-sm text-muted-foreground">
                                  via {product.supplier}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quantities" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quantity Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      {sizes.map((size) => (
                        <div key={size} className="space-y-2">
                          <Label htmlFor={`qty-${size}`}>{size}</Label>
                          <Input
                            id={`qty-${size}`}
                            type="number"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Total Quantity: 0 pieces</div>
                      <div className="text-xs text-muted-foreground">
                        Larger quantities typically result in better per-unit pricing
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Upload className="h-5 w-5 mr-2" />
                        Logo & Design
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div className="text-sm">
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PNG, JPG, PDF, AI files (max 10MB)
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="colors">Number of Colors</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Color</SelectItem>
                            <SelectItem value="2">2 Colors</SelectItem>
                            <SelectItem value="3">3 Colors</SelectItem>
                            <SelectItem value="4">4+ Colors</SelectItem>
                            <SelectItem value="full">Full Color</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Print Method & Placement */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Palette className="h-5 w-5 mr-2" />
                        Printing Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Print Method</Label>
                        <div className="space-y-2">
                          {printMethods.map((method) => (
                            <div key={method.value} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <Checkbox id={method.value} />
                              <div className="flex-1">
                                <label htmlFor={method.value} className="font-medium cursor-pointer">
                                  {method.label}
                                </label>
                                <div className="text-sm text-muted-foreground">
                                  {method.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Logo Placement</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select placement" />
                          </SelectTrigger>
                          <SelectContent>
                            {placementOptions.map((placement) => (
                              <SelectItem key={placement} value={placement.toLowerCase().replace(/\s+/g, '-')}>
                                {placement}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Any special requirements, deadlines, or additional information..."
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                Save Draft
              </Button>
              <Button onClick={handleSave}>
                Save Requirements
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}