import { useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, Upload } from "lucide-react";
import { ArtworkFiltersBar } from "../components/artwork/ArtworkFiltersBar";
import { SavedImprintCard } from "../components/artwork/SavedImprintCard";
import { mockSavedImprints } from "../data/mockSavedImprints";
import { SavedImprint } from "../types/saved-imprint";
import { getMethodConfig } from "../types/imprint";
import { useToast } from "../hooks/use-toast";

export default function ArtworkFiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { toast } = useToast();

  // Filter imprints based on current filters
  const filteredImprints = mockSavedImprints.filter(imprint => {
    const matchesSearch = !searchQuery || 
      imprint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imprint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      imprint.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMethod = !selectedMethod || imprint.decorationMethod === selectedMethod;
    const matchesCustomer = !selectedCustomer || imprint.customerName === selectedCustomer;
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

  const handleEditImprint = (imprint: SavedImprint) => {
    toast({
      title: "Edit Artwork",
      description: `Editing ${imprint.name} - this feature will be implemented when connected to Supabase.`,
    });
  };

  const handleDuplicateImprint = (imprint: SavedImprint) => {
    toast({
      title: "Duplicate Artwork",
      description: `Duplicating ${imprint.name} - this feature will be implemented when connected to Supabase.`,
    });
  };

  const handleCreateNew = () => {
    toast({
      title: "Create New Artwork",
      description: "This feature will be implemented when connected to Supabase.",
    });
  };

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "This feature will be implemented when connected to Supabase.",
    });
  };

  // Group imprints by decoration method
  const groupedImprints = filteredImprints.reduce((acc, imprint) => {
    const method = imprint.decorationMethod;
    if (!acc[method]) {
      acc[method] = [];
    }
    acc[method].push(imprint);
    return acc;
  }, {} as Record<string, SavedImprint[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Artwork Files</h1>
          <p className="text-muted-foreground">
            Manage your saved artwork and imprint files library
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">{mockSavedImprints.length}</div>
          <div className="text-sm text-muted-foreground">Total Artwork Files</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">
            {new Set(mockSavedImprints.map(i => i.customerName)).size}
          </div>
          <div className="text-sm text-muted-foreground">Customers</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">
            {new Set(mockSavedImprints.map(i => i.decorationMethod)).size}
          </div>
          <div className="text-sm text-muted-foreground">Decoration Methods</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-2xl font-bold">
            {mockSavedImprints.reduce((sum, i) => sum + i.usageCount, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Usage</div>
        </div>
      </div>

      {/* Filters */}
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

      {/* Content */}
      <div className="space-y-8">
        {Object.keys(groupedImprints).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No artwork files found matching your criteria.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedMethod("");
              setSelectedCustomer("");
              setSelectedTags([]);
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          Object.entries(groupedImprints).map(([method, imprints]) => {
            const methodConfig = getMethodConfig(method);
            return (
              <div key={method}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {methodConfig?.label || method} ({imprints.length})
                  </h2>
                </div>
                
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {imprints.map(imprint => (
                    <SavedImprintCard
                      key={imprint.id}
                      imprint={imprint}
                      onEdit={handleEditImprint}
                      onDuplicate={handleDuplicateImprint}
                      showActions={true}
                      selectable={false}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}