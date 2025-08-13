import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Check, Upload } from 'lucide-react';
import { MasterArtwork, ArtworkFile, ArtworkVariation } from '@/types/artwork';
import { EnhancedMockupUploadDialog } from './EnhancedMockupUploadDialog';

interface MockupSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: MasterArtwork | null;
  onSelectMockup: (artwork: MasterArtwork, variation: ArtworkVariation, selectedMockup?: ArtworkFile) => void;
  onBack: () => void;
}

interface VariationFormData {
  location: string;
  colors: string;
  notes: string;
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
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedMockupFile, setUploadedMockupFile] = useState<File | null>(null);
  const [variation, setVariation] = useState<VariationFormData>({
    location: '',
    colors: '',
    notes: ''
  });

  const handleMockupSelect = (mockup: ArtworkFile) => {
    setSelectedMockup(mockup);
    setVariation(prev => ({
      ...prev,
      colors: mockup.colors || ''
    }));
    // Don't automatically show variation form - let user choose
  };

  const handleUseExistingMockup = () => {
    if (!artwork || !selectedMockup) return;

    // Create a variation with the existing mockup's properties
    const finalVariation: ArtworkVariation = {
      id: `var-${Math.random().toString(36).substring(2, 9)}`,
      masterArtworkId: artwork.id,
      location: selectedMockup.colors || 'Standard placement',
      colors: selectedMockup.colors || '',
      placement: 'As shown in mockup',
      specialInstructions: '',
      createdAt: new Date(),
      createdBy: 'current-user'
    };

    onSelectMockup(artwork, finalVariation, selectedMockup);
    
    // Reset state
    setSelectedMockup(null);
    setShowVariationForm(false);
    setVariation({
      location: '',
      colors: '',
      notes: ''
    });
    setUploadedMockupFile(null);
  };

  const handleConfigureSelection = () => {
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
      placement: '',
      specialInstructions: variation.notes || '',
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
      notes: ''
    });
    setUploadedMockupFile(null);
  };

  const handleBackToMockups = () => {
    setShowVariationForm(false);
    setSelectedMockup(null);
    setUploadedMockupFile(null);
  };

  const handleMockupUpload = (files: File[]) => {
    if (files.length > 0) {
      setUploadedMockupFile(files[0]);
    }
    setShowUploadDialog(false);
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
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={variation.notes || ''}
                    onChange={(e) => setVariation(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special requirements or notes..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Mockup Image (Optional)</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUploadDialog(true)}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Mockup
                    </Button>
                  </div>
                  {uploadedMockupFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-600" />
                      {uploadedMockupFile.name}
                    </div>
                  )}
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
          ) : selectedMockup ? (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleConfigureSelection}
              >
                Configure Details
              </Button>
              <Button 
                onClick={handleUseExistingMockup}
              >
                Use This Mockup
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleCreateNew}
            >
              Continue
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      <EnhancedMockupUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleMockupUpload}
        allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
        category="proofMockup"
        multiple={false}
        title="Upload Mockup Image"
        description="Upload an image of the mockup for this imprint configuration"
      />
    </Dialog>
  );
}