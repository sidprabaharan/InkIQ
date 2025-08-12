import { useState } from "react";
import { SavedImprint } from "../../types/saved-imprint";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArtworkFiltersBar } from "./ArtworkFiltersBar";
import { SavedImprintCard } from "./SavedImprintCard";
import { Button } from "../ui/button";
import { mockSavedImprints } from "../../data/mockSavedImprints";
import { getMethodConfig } from "../../types/imprint";

interface ArtworkLibraryBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImprint: (imprint: SavedImprint, selectedMockup?: string) => void;
  filterByMethod?: string;
}

export function ArtworkLibraryBrowser({
  open,
  onOpenChange,
  onSelectImprint,
  filterByMethod
}: ArtworkLibraryBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(filterByMethod || "all");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImprint, setSelectedImprint] = useState<SavedImprint | null>(null);

  // Filter imprints based on current filters
  const filteredImprints = mockSavedImprints.filter(imprint => {
    const matchesSearch = !searchQuery || 
      imprint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imprint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imprint.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMethod = selectedMethod === 'all' || imprint.decorationMethod === selectedMethod;
    const matchesCustomer = selectedCustomer === 'all' || imprint.customerName === selectedCustomer;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => imprint.tags.includes(tag));

    return matchesSearch && matchesMethod && matchesCustomer && matchesTags;
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleImprintSelect = (imprint: SavedImprint) => {
    setSelectedImprint(imprint);
  };

  const handleConfirmSelection = () => {
    if (selectedImprint) {
      onSelectImprint(selectedImprint);
      onOpenChange(false);
      setSelectedImprint(null);
    }
  };

  const groupedImprints = filteredImprints.reduce((acc, imprint) => {
    const method = imprint.decorationMethod;
    if (!acc[method]) {
      acc[method] = [];
    }
    acc[method].push(imprint);
    return acc;
  }, {} as Record<string, SavedImprint[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Artwork from Library</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ArtworkFiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            selectedCustomer={selectedCustomer}
            onCustomerChange={setSelectedCustomer}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="flex-1 overflow-auto mt-4 space-y-6">
            {Object.keys(groupedImprints).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No artwork files found matching your criteria.</p>
              </div>
            ) : (
              Object.entries(groupedImprints).map(([method, imprints]) => {
                const methodConfig = getMethodConfig(method);
                return (
                  <div key={method}>
                    <h3 className="font-semibold mb-3">
                      {methodConfig?.label || method} ({imprints.length})
                    </h3>
                    <div className={
                      viewMode === 'grid' 
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        : "space-y-2"
                    }>
                      {imprints.map(imprint => (
                        <SavedImprintCard
                          key={imprint.id}
                          imprint={imprint}
                          onSelect={handleImprintSelect}
                          showActions={false}
                          selectable={true}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedImprint && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{selectedImprint.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedImprint.customerName} • {getMethodConfig(selectedImprint.decorationMethod)?.label}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedImprint(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmSelection}>
                    Use This Artwork
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}