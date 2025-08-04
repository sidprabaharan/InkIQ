import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, MapPin, Clock, Award } from 'lucide-react';
import { Decorator } from '@/types/decorator';
import { IMPRINT_METHODS } from '@/types/imprint';

// Mock decorator data
const mockDecorators: Decorator[] = [
  {
    id: '1',
    name: 'Elite Screen Printing',
    email: 'orders@elitescreen.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Industrial Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    capabilities: [
      {
        method: 'screenPrinting',
        minQuantity: 24,
        maxQuantity: 10000,
        maxColors: 8,
        specializations: ['Water-based inks', 'Discharge printing'],
        setupFee: 45,
        pricePerPiece: 3.50,
        rushAvailable: true,
        rushFee: 1.00
      },
      {
        method: 'embroidery',
        minQuantity: 12,
        maxQuantity: 5000,
        maxColors: 15,
        specializations: ['3D puff', 'Metallic threads'],
        setupFee: 85,
        pricePerPiece: 8.50,
        rushAvailable: true,
        rushFee: 2.00
      }
    ],
    pricing: {
      basePricing: {},
      rushMultiplier: 1.5,
      minimumOrder: 100
    },
    capacity: {
      dailyCapacity: 500,
      currentLoad: 250,
      leadTime: 3
    },
    qualityRating: 4.8,
    onTimeRating: 4.9,
    verificationStatus: 'verified',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-01')
  },
  {
    id: '2',
    name: 'Precision Embroidery Co',
    email: 'info@precisionemb.com',
    phone: '(555) 987-6543',
    address: {
      street: '456 Craft Lane',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309'
    },
    capabilities: [
      {
        method: 'embroidery',
        minQuantity: 6,
        maxQuantity: 15000,
        maxColors: 20,
        specializations: ['Applique', 'Patches', 'Caps'],
        setupFee: 75,
        pricePerPiece: 7.25,
        rushAvailable: true,
        rushFee: 1.50
      },
      {
        method: 'laserEngraving',
        minQuantity: 1,
        maxQuantity: 1000,
        maxColors: 1,
        specializations: ['Metal', 'Leather', 'Wood'],
        setupFee: 25,
        pricePerPiece: 12.00,
        rushAvailable: false
      }
    ],
    pricing: {
      basePricing: {},
      rushMultiplier: 1.3,
      minimumOrder: 50
    },
    capacity: {
      dailyCapacity: 300,
      currentLoad: 180,
      leadTime: 2
    },
    qualityRating: 4.9,
    onTimeRating: 4.7,
    verificationStatus: 'verified',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-07-28')
  }
];

export function DecoratorNetwork() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  const filteredDecorators = mockDecorators.filter(decorator => {
    const matchesSearch = decorator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         decorator.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         decorator.address.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethods = selectedMethods.length === 0 || 
                          selectedMethods.some(method => 
                            decorator.capabilities.some(cap => cap.method === method)
                          );
    
    return matchesSearch && matchesMethods;
  });

  const getMethodLabel = (methodValue: string) => {
    return IMPRINT_METHODS.find(m => m.value === methodValue)?.label || methodValue;
  };

  const renderRating = (rating: number) => (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Decorator Network</CardTitle>
          <CardDescription>
            Browse and connect with verified decorators in our network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search by name, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {IMPRINT_METHODS.slice(0, 6).map(method => (
                <Badge
                  key={method.value}
                  variant={selectedMethods.includes(method.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedMethods.includes(method.value)) {
                      setSelectedMethods(selectedMethods.filter(m => m !== method.value));
                    } else {
                      setSelectedMethods([...selectedMethods, method.value]);
                    }
                  }}
                >
                  {method.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredDecorators.map(decorator => (
          <Card key={decorator.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{decorator.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{decorator.address.city}, {decorator.address.state}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {renderRating(decorator.qualityRating)}
                  <Badge variant={decorator.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                    <Award className="h-3 w-3 mr-1" />
                    {decorator.verificationStatus}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((1 - decorator.capacity.currentLoad / decorator.capacity.dailyCapacity) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Available Capacity</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-lg font-semibold">{decorator.capacity.leadTime} days</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Lead Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{renderRating(decorator.onTimeRating)}</div>
                  <div className="text-sm text-muted-foreground">On-Time Rating</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {decorator.capabilities.map((capability, idx) => (
                    <Badge key={idx} variant="outline">
                      {getMethodLabel(capability.method)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Min Order: ${decorator.pricing.minimumOrder}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Request Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDecorators.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No decorators found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}