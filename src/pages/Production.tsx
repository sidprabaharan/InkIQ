import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/production/KanbanBoard";
import { ProductionScheduler } from "@/components/production/ProductionScheduler";
import { WorkStationManager } from "@/components/production/WorkStationManager";
import { Calendar, LayoutGrid, Settings } from "lucide-react";

export default function Production() {
  const [activeTab, setActiveTab] = useState("kanban");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Production Scheduler</h1>
          <p className="text-muted-foreground">
            Manage production workflow and schedule line items across work stations
          </p>
        </div>
        <WorkStationManager />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="scheduler" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline Scheduler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <KanbanBoard />
        </TabsContent>

        <TabsContent value="scheduler" className="mt-6">
          <ProductionScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
}