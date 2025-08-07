import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductionStage } from "./PrintavoPowerScheduler";

interface ProductionStageDropdownProps {
  selectedStage: ProductionStage;
  onStageChange: (stage: ProductionStage) => void;
  stages: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export function ProductionStageDropdown({ 
  selectedStage, 
  onStageChange, 
  stages 
}: ProductionStageDropdownProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-foreground whitespace-nowrap">
        Production Stage:
      </label>
      <Select value={selectedStage} onValueChange={(value) => onStageChange(value as ProductionStage)}>
        <SelectTrigger className="w-48 bg-background border-border">
          <SelectValue placeholder="Select stage" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border z-50">
          {stages.map((stage) => (
            <SelectItem 
              key={stage.id} 
              value={stage.id}
              className="hover:bg-muted focus:bg-muted"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                {stage.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}