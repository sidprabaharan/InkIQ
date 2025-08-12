import { SavedImprint } from "../../types/saved-imprint";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Eye, Edit, Copy, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { getMethodConfig } from "../../types/imprint";

interface SavedImprintCardProps {
  imprint: SavedImprint;
  onSelect?: (imprint: SavedImprint) => void;
  onEdit?: (imprint: SavedImprint) => void;
  onDuplicate?: (imprint: SavedImprint) => void;
  showActions?: boolean;
  selectable?: boolean;
}

export function SavedImprintCard({ 
  imprint, 
  onSelect, 
  onEdit, 
  onDuplicate, 
  showActions = true,
  selectable = false 
}: SavedImprintCardProps) {
  const methodConfig = getMethodConfig(imprint.decorationMethod);
  const primaryMockup = imprint.files.proofMockup[0];

  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect(imprint);
    }
  };

  return (
    <Card 
      className={`group hover:shadow-md transition-shadow ${selectable ? 'cursor-pointer hover:border-primary' : ''}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{imprint.name}</h3>
            <p className="text-sm text-muted-foreground">{imprint.customerName}</p>
          </div>
          {showActions && !selectable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border shadow-md">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(imprint); }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate?.(imprint); }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {primaryMockup && (
          <div className="aspect-square w-full bg-muted rounded-md mb-3 overflow-hidden">
            <img 
              src={primaryMockup.url} 
              alt={imprint.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA3NUgxMjVWMTI1SDc1Vjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{methodConfig?.label || imprint.decorationMethod}</Badge>
            <span className="text-xs text-muted-foreground">{imprint.location}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div>{imprint.dimensions.width}" × {imprint.dimensions.height}"</div>
            <div>{imprint.colors}</div>
          </div>

          {imprint.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{imprint.description}</p>
          )}

          <div className="flex flex-wrap gap-1">
            {imprint.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {imprint.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{imprint.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <div className="flex justify-between items-center w-full">
          <span>Used {imprint.usageCount} times</span>
          <span>{imprint.files.proofMockup.length} mockup{imprint.files.proofMockup.length !== 1 ? 's' : ''}</span>
        </div>
      </CardFooter>
    </Card>
  );
}