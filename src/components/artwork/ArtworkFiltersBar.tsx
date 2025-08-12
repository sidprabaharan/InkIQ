import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Search, Filter, X, Grid, List } from "lucide-react";
import { IMPRINT_METHODS } from "../../types/imprint";
import { mockSavedImprints } from "../../data/mockSavedImprints";

interface ArtworkFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  selectedCustomer: string;
  onCustomerChange: (customer: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ArtworkFiltersBar({
  searchQuery,
  onSearchChange,
  selectedMethod,
  onMethodChange,
  selectedCustomer,
  onCustomerChange,
  selectedTags,
  onTagToggle,
  viewMode,
  onViewModeChange
}: ArtworkFiltersBarProps) {
  // Get unique customers and tags from mock data
  const uniqueCustomers = [...new Set(mockSavedImprints.map(i => i.customerName))];
  const allTags = [...new Set(mockSavedImprints.flatMap(i => i.tags))];

  const clearFilters = () => {
    onSearchChange('');
    onMethodChange('all');
    onCustomerChange('all');
    selectedTags.forEach(tag => onTagToggle(tag));
  };

  const hasActiveFilters = searchQuery || 
    (selectedMethod && selectedMethod !== 'all') || 
    (selectedCustomer && selectedCustomer !== 'all') || 
    selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artwork files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={selectedMethod} onValueChange={onMethodChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Methods" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-md">
            <SelectItem value="all">All Methods</SelectItem>
            {IMPRINT_METHODS.map(method => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCustomer} onValueChange={onCustomerChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-md">
            <SelectItem value="all">All Customers</SelectItem>
            {uniqueCustomers.map(customer => (
              <SelectItem key={customer} value={customer}>
                {customer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Tags:</span>
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onTagToggle(tag)}
          >
            {tag}
            {selectedTags.includes(tag) && (
              <X className="h-3 w-3 ml-1" />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}