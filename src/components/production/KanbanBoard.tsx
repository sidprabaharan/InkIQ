import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";
import { quotationData } from "@/components/quotes/QuoteData";
import { useToast } from "@/components/ui/use-toast";

export interface ProductionItem {
  id: string;
  quoteId: string;
  quoteName: string;
  itemName: string;
  description: string;
  quantity: number;
  dueDate: string;
  priority: "low" | "medium" | "high";
  workStationId: string;
  originalItemIndex: number; // Track which item in the quote this represents
}

export interface WorkStation {
  id: string;
  name: string;
  color: string;
  capacity: number;
}

const defaultWorkStations: WorkStation[] = [
  { id: "Artwork", name: "Artwork/Design", color: "#10b981", capacity: 5 },
  { id: "Production", name: "Production", color: "#f59e0b", capacity: 8 },
  { id: "Shipping", name: "Shipping", color: "#8b5cf6", capacity: 6 },
  { id: "Complete", name: "Complete", color: "#22c55e", capacity: 10 },
  { id: "On Hold", name: "On Hold", color: "#ef4444", capacity: 3 },
  { id: "Quote", name: "Quote", color: "#3b82f6", capacity: 5 },
];

// Convert quote items to production items
const convertQuoteItemsToProductionItems = (): ProductionItem[] => {
  return quotationData.items.map((item, index) => ({
    id: `${quotationData.id}-${index}`,
    quoteId: quotationData.id,
    quoteName: quotationData.nickname,
    itemName: `${item.category} - ${item.color}`,
    description: item.description,
    quantity: parseInt(item.quantity),
    dueDate: quotationData.details.productionDueDate,
    priority: item.status === "On Hold" ? "low" : item.status === "Artwork" ? "high" : "medium",
    workStationId: item.status,
    originalItemIndex: index,
  }));
};

export function KanbanBoard() {
  const [items, setItems] = useState<ProductionItem[]>(convertQuoteItemsToProductionItems());
  const [workStations] = useState<WorkStation[]>(defaultWorkStations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeItem = items.find(item => item.id === active.id);
    if (!activeItem) return;

    const newWorkStationId = over.id as string;
    const newWorkStationName = workStations.find(ws => ws.id === newWorkStationId)?.name || newWorkStationId;
    
    if (activeItem.workStationId !== newWorkStationId) {
      // Update the item in the kanban
      setItems(items.map(item => 
        item.id === active.id 
          ? { ...item, workStationId: newWorkStationId }
          : item
      ));

      // Show toast notification about the status change
      toast({
        title: "Status Updated",
        description: `${activeItem.itemName} moved to ${newWorkStationName}`,
      });

      // Note: In a real app, you would also update the quote item status in your backend/state management
      // For now, we're just updating the local kanban state
    }

    setActiveId(null);
  };

  const getItemsByWorkStation = (workStationId: string) => {
    return items.filter(item => item.workStationId === workStationId);
  };

  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Production Kanban Board</h2>
        <p className="text-sm text-muted-foreground">
          Line items from quotes shown by status. Drag to update status.
        </p>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-6 gap-4 min-h-[600px]">
          {workStations.map((workStation) => (
            <KanbanColumn
              key={workStation.id}
              workStation={workStation}
              items={getItemsByWorkStation(workStation.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <KanbanItem item={activeItem} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}