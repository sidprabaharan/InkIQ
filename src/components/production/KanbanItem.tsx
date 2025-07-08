import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProductionItem } from "./KanbanBoard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package } from "lucide-react";
import { format } from "date-fns";

interface KanbanItemProps {
  item: ProductionItem;
  isDragging?: boolean;
}

export function KanbanItem({ item, isDragging = false }: KanbanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        isDragging || isSortableDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.itemName}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {item.quoteName}
            </p>
          </div>
          <Badge variant={getPriorityColor(item.priority)} className="text-xs">
            {item.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-2">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>{item.quantity}</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(item.dueDate), "MMM dd")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}