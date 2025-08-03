import { Search, Filter, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmailSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'date' | 'sender' | 'subject';
  onSortChange: (sort: 'date' | 'sender' | 'subject') => void;
  filterBy: 'all' | 'unread' | 'starred' | 'attachments';
  onFilterChange: (filter: 'all' | 'unread' | 'starred' | 'attachments') => void;
}

export function EmailSearchHeader({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
}: EmailSearchHeaderProps) {
  return (
    <div className="border-b px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/20 border-none focus-visible:ring-1"
          />
        </div>

        {/* Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {filterBy === 'all' ? 'All' : 
               filterBy === 'unread' ? 'Unread' :
               filterBy === 'starred' ? 'Starred' : 'With Attachments'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterChange('all')}>
              All Emails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('unread')}>
              Unread Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('starred')}>
              Starred Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('attachments')}>
              With Attachments
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SortDesc className="h-4 w-4" />
              Sort by {sortBy === 'date' ? 'Date' : sortBy === 'sender' ? 'Sender' : 'Subject'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortChange('date')}>
              Sort by Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('sender')}>
              Sort by Sender
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('subject')}>
              Sort by Subject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}