import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { MasterArtwork, ArtworkFile, ArtworkVariation } from '@/types/artwork';

interface MockupSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: MasterArtwork | null;
  onSelectMockup: (artwork: MasterArtwork, variation: ArtworkVariation, selectedMockup?: ArtworkFile) => void;
  onBack: () => void;
}

export function MockupSelectionDialog({ 
  open, 
  onOpenChange, 
  artwork, 
  onSelectMockup, 
  onBack 
}: MockupSelectionDialogProps) {
  const [selectedMockup, setSelectedMockup] = useState<ArtworkFile | null>(null);
  const [showVariationForm, setShowVariationForm] = useState(false);
  const [variation, setVariation] = useState<Partial<ArtworkVariation>>({
    location: '',
    colors: '',
    placement: '',
    specialInstructions: ''
  });

  const handleMockupSelect = (mockup: ArtworkFile) => {
    setSelectedMockup(mockup);
    setVariation(prev => ({
      ...prev,
      colors: mockup.colors || ''
    }));
    setShowVariationForm(true);
  };

  const handleCreateNew = () => {
    setSelectedMockup(null);
    setShowVariationForm(true);
  };

  const handleConfirm = () => {
    if (!artwork) return;

    const finalVariation: ArtworkVariation = {
      id: `var-${Math.random().toString(36).substring(2, 9)}`,
      masterArtworkId: artwork.id,
      location: variation.location || '',
      colors: variation.colors || '',
      placement: variation.placement || '',
      specialInstructions: variation.specialInstructions || '',
      createdAt: new Date(),
      createdBy: 'current-user'
    };

    onSelectMockup(artwork, finalVariation, selectedMockup || undefined);
    
    // Reset state
    setSelectedMockup(null);
    setShowVariationForm(false);
    setVariation({
      location: '',
      colors: '',
      placement: '',
      specialInstructions: ''
    });
  };

  const handleBackToMockups = () => {
    setShowVariationForm(false);
    setSelectedMockup(null);
  };

  if (!artwork) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showVariationForm ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToMockups}
                  className="p-1 h-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Configure Imprint - {artwork.designName}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-1 h-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select Mockup - {artwork.designName}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showVariationForm ? (
            <>
              {/* Artwork Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-background rounded-lg overflow-hidden">
                  {artwork.customerArt.length > 0 ? (
                    <img 
                      src={artwork.customerArt[0].url} 
                      alt={artwork.designName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{artwork.designName}</h3>
                  <p className="text-sm text-muted-foreground">{artwork.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{artwork.method}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {artwork.size.width}" × {artwork.size.height}"
                    </span>
                  </div>
                </div>
              </div>

              {/* Mockup Selection */}
              <div>
                <h4 className="font-medium mb-3">Select a Mockup or Create New</h4>
                
                {artwork.mockups.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {artwork.mockups.map((mockup) => (
                      <div
                        key={mockup.id}
                        className={`cursor-pointer border rounded-lg p-3 transition-colors ${
                          selectedMockup?.id === mockup.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleMockupSelect(mockup)}
                      >
                        <div className="aspect-video bg-muted rounded-md overflow-hidden mb-2">
                          <img 
                            src={mockup.url} 
                            alt={mockup.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm font-medium truncate">{mockup.name}</div>
                        {mockup.colors && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {mockup.colors}
                          </Badge>
                        )}
                        {selectedMockup?.id === mockup.id && (
                          <div className="flex items-center gap-1 mt-2 text-primary">
                            <Check className="h-4 w-4" />
                            <span className="text-xs">Selected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No existing mockups for this imprint</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={handleCreateNew}
                  className="w-full mt-3 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Mockup Configuration
                </Button>
              </div>
            </>
          ) : (
            /* Variation Configuration Form */
            <div className="space-y-4">
              {selectedMockup && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-16 h-16 bg-background rounded-lg overflow-hidden">
                    <img 
                      src={selectedMockup.url} 
                      alt={selectedMockup.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Selected Mockup</h4>
                    <p className="text-sm text-muted-foreground">{selectedMockup.name}</p>
                    {selectedMockup.colors && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {selectedMockup.colors}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={variation.location || ''}
                    onChange={(e) => setVariation(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Front chest, Back, Left sleeve"
                  />
                </div>

                <div>
                  <Label htmlFor="colors">Colors/Threads</Label>
                  <Input
                    id="colors"
                    value={variation.colors || ''}
                    onChange={(e) => setVariation(prev => ({ ...prev, colors: e.target.value }))}
                    placeholder="e.g., Red, White, Blue or Thread colors: 5563, 5606"
                  />
                </div>

                <div>
                  <Label htmlFor="placement">Placement Details</Label>
                  <Input
                    id="placement"
                    value={variation.placement || ''}
                    onChange={(e) => setVariation(prev => ({ ...prev, placement: e.target.value }))}
                    placeholder="e.g., Centered, 2 inches from seam"
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={variation.specialInstructions || ''}
                    onChange={(e) => setVariation(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Any special requirements or notes..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {showVariationForm ? (
            <Button 
              onClick={handleConfirm}
              disabled={!variation.location}
            >
              Use This Configuration
            </Button>
          ) : (
            <Button 
              onClick={() => setShowVariationForm(true)}
              disabled={!selectedMockup && artwork.mockups.length > 0}
            >
              {selectedMockup ? 'Configure Selection' : 'Continue'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}