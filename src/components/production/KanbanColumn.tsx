import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanItem } from "./KanbanItem";
import { WorkStation, ProductionItem } from "./KanbanBoard";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  workStation: WorkStation;
  items: ProductionItem[];
}

export function KanbanColumn({ workStation, items }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: workStation.id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 bg-muted rounded-t-lg border">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: workStation.color }}
          />
          <span className="font-medium text-sm">{workStation.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {items.length}/{workStation.capacity}
          </Badge>
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 space-y-2 bg-background border-x border-b rounded-b-lg min-h-[500px] transition-colors ${
          isOver ? "bg-muted/50" : ""
        }`}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <KanbanItem key={item.id} item={item} />
          ))}
        </SortableContext>
        
        {items.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}