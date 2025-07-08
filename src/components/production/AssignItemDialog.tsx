import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProductionItem, WorkStation } from "./KanbanBoard";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AssignItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (item: Omit<ProductionItem, "id">) => void;
  workStations: WorkStation[];
}

export function AssignItemDialog({ open, onOpenChange, onAssign, workStations }: AssignItemDialogProps) {
  const [formData, setFormData] = useState({
    quoteId: "",
    quoteName: "",
    itemName: "",
    description: "",
    quantity: "",
    dueDate: undefined as Date | undefined,
    priority: "medium" as "low" | "medium" | "high",
    workStationId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dueDate || !formData.workStationId) return;
    
    onAssign({
      quoteId: formData.quoteId,
      quoteName: formData.quoteName,
      itemName: formData.itemName,
      description: formData.description,
      quantity: parseInt(formData.quantity),
      dueDate: format(formData.dueDate, "yyyy-MM-dd"),
      priority: formData.priority,
      workStationId: formData.workStationId,
      originalItemIndex: -1, // Manual assignment, not from quote
    });

    // Reset form
    setFormData({
      quoteId: "",
      quoteName: "",
      itemName: "",
      description: "",
      quantity: "",
      dueDate: undefined,
      priority: "medium",
      workStationId: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Item to Production</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quoteId">Quote ID</Label>
              <Input
                id="quoteId"
                value={formData.quoteId}
                onChange={(e) => setFormData({ ...formData, quoteId: e.target.value })}
                placeholder="3032"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quoteName">Quote Name</Label>
              <Input
                id="quoteName"
                value={formData.quoteName}
                onChange={(e) => setFormData({ ...formData, quoteName: e.target.value })}
                placeholder="Project Care Quote"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="T-Shirts"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Cotton T-Shirt with logo print"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="375"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Work Station</Label>
              <Select value={formData.workStationId} onValueChange={(value) => setFormData({ ...formData, workStationId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {workStations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Assign Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}