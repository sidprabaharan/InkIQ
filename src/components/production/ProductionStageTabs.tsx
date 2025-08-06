import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionStage } from "./PrintavoPowerScheduler";

interface ProductionStageTabsProps {
  selectedMethod: string;
  selectedStage: ProductionStage;
  onStageChange: (stage: ProductionStage) => void;
  stages: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export function ProductionStageTabs({ 
  selectedStage, 
  onStageChange, 
  stages 
}: ProductionStageTabsProps) {
  return (
    <div className="border-b border-border bg-background px-6 py-4">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold text-foreground">Production Stage:</h3>
        <Tabs value={selectedStage} onValueChange={(value) => onStageChange(value as ProductionStage)}>
          <TabsList>
            {stages.map(stage => (
              <TabsTrigger 
                key={stage.id} 
                value={stage.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${stage.color}`}></div>
                {stage.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}