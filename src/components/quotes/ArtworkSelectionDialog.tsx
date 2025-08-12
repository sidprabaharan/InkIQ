import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileImage } from 'lucide-react';
import { MasterArtwork, CustomerArtworkLibrary, ArtworkVariation, mockArtworkLibrary } from "@/types/artwork";
import { MockupSelectionDialog } from "./MockupSelectionDialog";
import { IMPRINT_METHODS } from '@/types/imprint';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [selectedArtwork, setSelectedArtwork] = useState<MasterArtwork | null>(null);
  const [mockupSelectionOpen, setMockupSelectionOpen] = useState(false);

  // Get unique customers for filter
  const customers = useMemo(() => {
    return mockArtworkLibrary.map(lib => ({
      customerId: lib.customerId,
      customerName: lib.customerName
    }));
  }, []);

  // Filter artwork
  const filteredArtwork = useMemo(() => {
    let allArtwork: MasterArtwork[] = [];
    
    // Flatten all artwork from all customers
    mockArtworkLibrary.forEach(library => {
      library.folders.forEach(folder => {
        allArtwork.push(...folder.artworks);
      });
    });

    // Apply filters
    if (selectedCustomer && selectedCustomer !== "all") {
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
    setMockupSelectionOpen(true);
  };

  const handleBackToArtworkSelection = () => {
    setMockupSelectionOpen(false);
    setSelectedArtwork(null);
  };

  const handleMockupSelection = (artwork: MasterArtwork, variation: ArtworkVariation) => {
    onSelectArtwork(artwork, variation);
    
    // Reset state
    setMockupSelectionOpen(false);
    setSelectedArtwork(null);
    onOpenChange(false);
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
    <>
      <Dialog open={open && !mockupSelectionOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Select Artwork from Library</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Filter Section */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Search artwork..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.customerId} value={customer.customerId}>
                        {customer.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Artwork Grid */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArtwork.map((artwork) => (
                  <Card 
                    key={artwork.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleArtworkSelect(artwork)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {artwork.customerArt.length > 0 ? (
                            <img 
                              src={artwork.customerArt[0].url} 
                              alt={artwork.designName}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileImage className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{artwork.designName}</h3>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {artwork.description}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">{artwork.method}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {artwork.size.width}" × {artwork.size.height}"
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{artwork.customerName}</span>
                            <span>{formatDate(artwork.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredArtwork.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No artwork found matching your search criteria</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MockupSelectionDialog
        open={mockupSelectionOpen}
        onOpenChange={setMockupSelectionOpen}
        artwork={selectedArtwork}
        onSelectMockup={handleMockupSelection}
        onBack={handleBackToArtworkSelection}
      />
    </>
  );
}