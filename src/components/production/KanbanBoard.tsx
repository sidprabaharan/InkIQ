import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AssignItemDialog } from "./AssignItemDialog";

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
}

export interface WorkStation {
  id: string;
  name: string;
  color: string;
  capacity: number;
}

const defaultWorkStations: WorkStation[] = [
  { id: "design", name: "Design", color: "#3b82f6", capacity: 5 },
  { id: "printing", name: "Screen Printing", color: "#8b5cf6", capacity: 8 },
  { id: "embroidery", name: "Embroidery", color: "#10b981", capacity: 6 },
  { id: "heat-press", name: "Heat Press", color: "#f59e0b", capacity: 4 },
  { id: "quality", name: "Quality Control", color: "#ef4444", capacity: 3 },
  { id: "packaging", name: "Packaging", color: "#6b7280", capacity: 10 },
];

// Mock data for demonstration
const mockItems: ProductionItem[] = [
  {
    id: "1",
    quoteId: "3032",
    quoteName: "Project Care Quote",
    itemName: "T-Shirts",
    description: "Cotton T-Shirt with logo print",
    quantity: 375,
    dueDate: "2024-07-15",
    priority: "high",
    workStationId: "design",
  },
  {
    id: "2",
    quoteId: "3032",
    quoteName: "Project Care Quote",
    itemName: "Hoodies",
    description: "Pullover Hoodie with embroidered logo",
    quantity: 235,
    dueDate: "2024-07-20",
    priority: "medium",
    workStationId: "embroidery",
  },
];

export function KanbanBoard() {
  const [items, setItems] = useState<ProductionItem[]>(mockItems);
  const [workStations] = useState<WorkStation[]>(defaultWorkStations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeItem = items.find(item => item.id === active.id);
    if (!activeItem) return;

    const newWorkStationId = over.id as string;
    
    if (activeItem.workStationId !== newWorkStationId) {
      setItems(items.map(item => 
        item.id === active.id 
          ? { ...item, workStationId: newWorkStationId }
          : item
      ));
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
        <Button onClick={() => setShowAssignDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Assign Item
        </Button>
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

      <AssignItemDialog 
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onAssign={(item) => {
          setItems([...items, { ...item, id: Date.now().toString() }]);
          setShowAssignDialog(false);
        }}
        workStations={workStations}
      />
    </div>
  );
}