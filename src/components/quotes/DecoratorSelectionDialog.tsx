import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Clock, DollarSign } from "lucide-react";
import { Decorator } from "@/types/decorator";
import { useToast } from "@/hooks/use-toast";

// Mock decorator data for demo
const mockDecorators: Decorator[] = [
  {
    id: "dec-001",
    name: "Premier Graphics Co.",
    email: "orders@premiergraphics.com",
    phone: "(555) 123-4567",
    address: {
      street: "123 Industrial Blvd",
      city: "Atlanta",
      state: "GA",
      zipCode: "30309"
    },
    capabilities: [
      {
        method: "screen_printing",
        minQuantity: 24,
        maxQuantity: 10000,
        maxColors: 8,
        specializations: ["water-based", "plastisol", "discharge"],
        setupFee: 45,
        pricePerPiece: 3.25,
        rushAvailable: true,
        rushFee: 50
      },
      {
        method: "embroidery",
        minQuantity: 12,
        maxQuantity: 5000,
        maxColors: 15,
        specializations: ["3D embroidery", "applique"],
        setupFee: 75,
        pricePerPiece: 4.50,
        rushAvailable: true,
        rushFee: 75
      }
    ],
    pricing: {
      basePricing: {},
      rushMultiplier: 1.5,
      minimumOrder: 100
    },
    capacity: {
      dailyCapacity: 500,
      currentLoad: 75,
      leadTime: 7
    },
    qualityRating: 4.8,
    onTimeRating: 4.9,
    verificationStatus: "verified",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "dec-002", 
    name: "Stitch Perfect Embroidery",
    email: "info@stitchperfect.com",
    phone: "(555) 987-6543",
    address: {
      street: "456 Commerce Dr",
      city: "Charlotte",
      state: "NC", 
      zipCode: "28202"
    },
    capabilities: [
      {
        method: "embroidery",
        minQuantity: 6,
        maxQuantity: 2500,
        maxColors: 12,
        specializations: ["chenille", "sequin", "metallic thread"],
        setupFee: 60,
        pricePerPiece: 4.75,
        rushAvailable: true,
        rushFee: 60
      }
    ],
    pricing: {
      basePricing: {},
      rushMultiplier: 1.4,
      minimumOrder: 50
    },
    capacity: {
      dailyCapacity: 200,
      currentLoad: 60,
      leadTime: 5
    },
    qualityRating: 4.9,
    onTimeRating: 4.7,
    verificationStatus: "verified",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

interface DecoratorSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  quoteItems?: any[];
}

export function DecoratorSelectionDialog({ 
  open, 
  onOpenChange, 
  quoteId, 
  quoteItems = [] 
}: DecoratorSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDecorator, setSelectedDecorator] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredDecorators = mockDecorators.filter(decorator =>
    decorator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decorator.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decorator.address.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  const handleSelectDecorator = (decoratorId: string) => {
    setSelectedDecorator(decoratorId);
  };

  const handleOutsource = () => {
    if (!selectedDecorator) return;
    
    const decorator = mockDecorators.find(d => d.id === selectedDecorator);
    if (decorator) {
      toast({
        title: "Decorations Outsourced",
        description: `Successfully created PO for ${decorator.name}. They will receive artwork and shipping instructions.`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Decorator for Quote #{quoteId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-4">
            {filteredDecorators.map((decorator) => (
              <Card 
                key={decorator.id} 
                className={`cursor-pointer transition-all ${
                  selectedDecorator === decorator.id 
                    ? "ring-2 ring-primary border-primary" 
                    : "hover:shadow-md"
                }`}
                onClick={() => handleSelectDecorator(decorator.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{decorator.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {decorator.address.city}, {decorator.address.state}
                      </div>
                    </div>
                    <Badge variant={decorator.verificationStatus === "verified" ? "default" : "secondary"}>
                      {decorator.verificationStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Quality Rating</div>
                      {renderRating(decorator.qualityRating)}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">On-Time Rating</div>
                      {renderRating(decorator.onTimeRating)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Lead Time</div>
                        <div className="text-sm font-medium">{decorator.capacity.leadTime} days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Capacity</div>
                        <div className="text-sm font-medium">{decorator.capacity.currentLoad}% used</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Capabilities</div>
                    <div className="flex flex-wrap gap-1">
                      {decorator.capabilities.map((cap, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cap.method.replace('_', ' ')} (${cap.pricePerPiece}/pc)
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleOutsource}
              disabled={!selectedDecorator}
            >
              Create Decorator PO
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}