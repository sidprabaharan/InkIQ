import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, FileImage, Eye, Check, ArrowLeft } from 'lucide-react';
import { mockArtworkLibrary, MasterArtwork, ArtworkVariation } from '@/types/artwork';
import { ImprintItem } from '@/types/imprint';
import { IMPRINT_METHODS } from '@/types/imprint';
import { toast } from 'sonner';

interface ArtworkSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectArtwork: (artwork: MasterArtwork, variation: ArtworkVariation) => void;
  customerId?: string;
}

export function ArtworkSelectionDialog({
  open,
  onOpenChange,
  onSelectArtwork,
  customerId
}: ArtworkSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>(customerId || 'all');
  const [selectedArtwork, setSelectedArtwork] = useState<MasterArtwork | null>(null);
  const [showVariationForm, setShowVariationForm] = useState(false);
  
  // Variation form state
  const [variation, setVariation] = useState({
    location: '',
    colors: '',
    placement: '',
    specialInstructions: ''
  });

  // Get unique customers for filter
  const customers = useMemo(() => {
    return mockArtworkLibrary.map(lib => ({
      id: lib.customerId,
      name: lib.customerName
    }));
  }, []);

  // Filter artwork
  const filteredArtwork = useMemo(() => {
    let allArtwork: MasterArtwork[] = [];
    
    // Flatten all artwork from all customers
    mockArtworkLibrary.forEach(library => {
      allArtwork.push(...library.masterArtworks);
    });

    // Apply filters
    if (selectedCustomer !== 'all') {
      allArtwork = allArtwork.filter(art => art.customerId === selectedCustomer);
    }

    if (searchTerm) {
      allArtwork = allArtwork.filter(art => 
        art.designName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return allArtwork;
  }, [searchTerm, selectedCustomer]);

  const handleArtworkSelect = (artwork: MasterArtwork) => {
    setSelectedArtwork(artwork);
    setShowVariationForm(true);
    // Pre-fill common variation data
    setVariation({
      location: '',
      colors: '',
      placement: '',
      specialInstructions: ''
    });
  };

  const handleBackToSelection = () => {
    setShowVariationForm(false);
    setSelectedArtwork(null);
    setVariation({
      location: '',
      colors: '',
      placement: '',
      specialInstructions: ''
    });
  };

  const handleConfirmSelection = () => {
    if (!selectedArtwork) return;

    // Validate required variation fields
    if (!variation.location.trim()) {
      toast.error('Please specify the imprint location');
      return;
    }

    // Create variation object
    const artworkVariation: ArtworkVariation = {
      id: `var-${Math.random().toString(36).substring(2, 9)}`,
      masterArtworkId: selectedArtwork.id,
      location: variation.location,
      colors: variation.colors || undefined,
      placement: variation.placement || undefined,
      specialInstructions: variation.specialInstructions || undefined,
      createdAt: new Date(),
      createdBy: 'current-user'
    };

    onSelectArtwork(selectedArtwork, artworkVariation);
    
    // Reset state
    handleBackToSelection();
    onOpenChange(false);
    
    toast.success(`Selected "${selectedArtwork.designName}" for ${variation.location}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showVariationForm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSelection}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {showVariationForm ? 'Configure Artwork Variation' : 'Select from Artwork Library'}
          </DialogTitle>
        </DialogHeader>

        {!showVariationForm ? (
          // Artwork Selection View
          <div className="space-y-4 flex-1 overflow-hidden">
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search artwork by name, customer, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            <div className="text-sm text-muted-foreground">
              {filteredArtwork.length} artwork file{filteredArtwork.length !== 1 ? 's' : ''} found
            </div>

            <ScrollArea className="flex-1">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredArtwork.map((artwork) => (
                  <Card 
                    key={artwork.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleArtworkSelect(artwork)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm truncate">{artwork.designName}</CardTitle>
                          <CardDescription className="text-xs truncate">{artwork.customerName}</CardDescription>
                        </div>
                        <FileImage className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {IMPRINT_METHODS.find(m => m.value === artwork.method)?.label || artwork.method}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {artwork.size.width}" × {artwork.size.height}"
                        </span>
                      </div>
                      
                      {artwork.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {artwork.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {artwork.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{artwork.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                        <div className="text-center">
                          <div className="font-medium">{artwork.customerArt.length}</div>
                          <div>Art</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{artwork.productionFiles.length}</div>
                          <div>Prod</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{artwork.mockups.length}</div>
                          <div>Mock</div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Used {artwork.usageCount} times
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          // Variation Configuration View
          <div className="space-y-4 flex-1">
            {selectedArtwork && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {selectedArtwork.designName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{selectedArtwork.designName}</CardTitle>
                      <CardDescription>{selectedArtwork.customerName}</CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {IMPRINT_METHODS.find(m => m.value === selectedArtwork.method)?.label || selectedArtwork.method}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {selectedArtwork.size.width}" × {selectedArtwork.size.height}"
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Imprint Location *
                </Label>
                <Input
                  id="location"
                  value={variation.location}
                  onChange={(e) => setVariation(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Front chest, Back, Left sleeve"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="colors" className="text-sm font-medium">
                  Colors or Thread Colors
                </Label>
                <Input
                  id="colors"
                  value={variation.colors}
                  onChange={(e) => setVariation(prev => ({ ...prev, colors: e.target.value }))}
                  placeholder="e.g., Black, White, Navy Blue | Thread: 5563, 5606"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Specify if different from original artwork colors
                </p>
              </div>

              <div>
                <Label htmlFor="placement" className="text-sm font-medium">
                  Placement Details
                </Label>
                <Input
                  id="placement"
                  value={variation.placement}
                  onChange={(e) => setVariation(prev => ({ ...prev, placement: e.target.value }))}
                  placeholder="e.g., Centered, 2 inches from collar"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="instructions" className="text-sm font-medium">
                  Special Instructions
                </Label>
                <Textarea
                  id="instructions"
                  value={variation.specialInstructions}
                  onChange={(e) => setVariation(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  placeholder="Any special requirements or modifications..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!showVariationForm ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBackToSelection}>
                Back
              </Button>
              <Button onClick={handleConfirmSelection} className="gap-2">
                <Check className="h-4 w-4" />
                Use This Artwork
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}