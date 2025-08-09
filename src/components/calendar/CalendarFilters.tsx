import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarEventCategory, MeetingProvider } from "@/pages/Calendar";
import { X, Filter } from "lucide-react";

export interface CalendarFilters {
  categories: CalendarEventCategory[];
  decorationMethods: string[];
  stages: string[];
  equipmentIds: string[];
  meetingProviders: MeetingProvider[];
  priorities: string[];
  showAllDay: boolean;
  showTimed: boolean;
}

interface CalendarFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const eventCategories: { value: CalendarEventCategory; label: string; color: string }[] = [
  { value: "production_job", label: "Production Jobs", color: "bg-blue-500" },
  { value: "meeting", label: "Meetings", color: "bg-green-500" },
  { value: "follow_up", label: "Follow-ups", color: "bg-yellow-500" },
  { value: "artwork_approval", label: "Artwork Approvals", color: "bg-orange-500" },
  { value: "customer_call", label: "Customer Calls", color: "bg-purple-500" },
  { value: "task", label: "Tasks", color: "bg-red-500" },
  { value: "work", label: "Work", color: "bg-gray-500" },
  { value: "personal", label: "Personal", color: "bg-pink-500" },
];

const decorationMethods = [
  { value: "screen_printing", label: "Screen Printing" },
  { value: "embroidery", label: "Embroidery" },
  { value: "dtf", label: "DTF" },
  { value: "dtg", label: "DTG" },
];

const productionStages = [
  { value: "burn_screens", label: "Burn Screens" },
  { value: "print", label: "Print" },
  { value: "digitize", label: "Digitize" },
  { value: "embroider", label: "Embroider" },
  { value: "design_file", label: "Design File" },
  { value: "pretreat", label: "Pretreat" },
  { value: "press", label: "Press" },
];

const equipmentOptions = [
  { value: "press-1", label: "Press 1" },
  { value: "press-2", label: "Press 2" },
  { value: "press-3", label: "Press 3" },
  { value: "embroidery-1", label: "Embroidery Machine 1" },
  { value: "embroidery-2", label: "Embroidery Machine 2" },
  { value: "dtf-printer", label: "DTF Printer" },
  { value: "dtg-printer", label: "DTG Printer" },
];

export function CalendarFilters({ filters, onFiltersChange, isOpen, onToggle }: CalendarFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CalendarFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryToggle = (category: CalendarEventCategory, checked: boolean) => {
    const newCategories = checked 
      ? [...localFilters.categories, category]
      : localFilters.categories.filter(c => c !== category);
    
    const newFilters = { ...localFilters, categories: newCategories };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDecorationMethodToggle = (method: string, checked: boolean) => {
    const newMethods = checked 
      ? [...localFilters.decorationMethods, method]
      : localFilters.decorationMethods.filter(m => m !== method);
    
    const newFilters = { ...localFilters, decorationMethods: newMethods };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStageToggle = (stage: string, checked: boolean) => {
    const newStages = checked 
      ? [...localFilters.stages, stage]
      : localFilters.stages.filter(s => s !== stage);
    
    const newFilters = { ...localFilters, stages: newStages };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleEquipmentToggle = (equipmentId: string, checked: boolean) => {
    const newEquipment = checked 
      ? [...localFilters.equipmentIds, equipmentId]
      : localFilters.equipmentIds.filter(e => e !== equipmentId);
    
    const newFilters = { ...localFilters, equipmentIds: newEquipment };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: CalendarFilters = {
      categories: [],
      decorationMethods: [],
      stages: [],
      equipmentIds: [],
      meetingProviders: [],
      priorities: [],
      showAllDay: true,
      showTimed: true,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return (
      localFilters.categories.length +
      localFilters.decorationMethods.length +
      localFilters.stages.length +
      localFilters.equipmentIds.length +
      localFilters.meetingProviders.length +
      localFilters.priorities.length
    );
  };

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
        
        {/* Active filter pills */}
        {localFilters.categories.map(category => (
          <Badge
            key={category}
            variant="secondary"
            className="gap-1"
          >
            {eventCategories.find(c => c.value === category)?.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleCategoryToggle(category, false)}
            />
          </Badge>
        ))}
        
        {localFilters.decorationMethods.map(method => (
          <Badge
            key={method}
            variant="secondary"
            className="gap-1"
          >
            {decorationMethods.find(m => m.value === method)?.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleDecorationMethodToggle(method, false)}
            />
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Calendar Filters</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            disabled={getActiveFilterCount() === 0}
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Categories */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Event Types</Label>
          <div className="grid grid-cols-2 gap-2">
            {eventCategories.map(category => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={localFilters.categories.includes(category.value)}
                  onCheckedChange={(checked) => 
                    handleCategoryToggle(category.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={category.value}
                  className="text-sm font-normal flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Production Filters */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Production Filters</Label>
          
          {/* Decoration Methods */}
          <div className="mb-3">
            <Label className="text-xs text-muted-foreground mb-1 block">Decoration Methods</Label>
            <div className="grid grid-cols-2 gap-2">
              {decorationMethods.map(method => (
                <div key={method.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`method-${method.value}`}
                    checked={localFilters.decorationMethods.includes(method.value)}
                    onCheckedChange={(checked) => 
                      handleDecorationMethodToggle(method.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`method-${method.value}`} className="text-sm font-normal">
                    {method.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Production Stages */}
          <div className="mb-3">
            <Label className="text-xs text-muted-foreground mb-1 block">Production Stages</Label>
            <div className="grid grid-cols-2 gap-2">
              {productionStages.map(stage => (
                <div key={stage.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stage-${stage.value}`}
                    checked={localFilters.stages.includes(stage.value)}
                    onCheckedChange={(checked) => 
                      handleStageToggle(stage.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`stage-${stage.value}`} className="text-sm font-normal">
                    {stage.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment/Stations */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Equipment/Stations</Label>
            <div className="grid grid-cols-1 gap-2">
              {equipmentOptions.map(equipment => (
                <div key={equipment.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`equipment-${equipment.value}`}
                    checked={localFilters.equipmentIds.includes(equipment.value)}
                    onCheckedChange={(checked) => 
                      handleEquipmentToggle(equipment.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`equipment-${equipment.value}`} className="text-sm font-normal">
                    {equipment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}