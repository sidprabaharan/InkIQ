import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus, Edit2, Trash2 } from "lucide-react";
import { WorkStation } from "./KanbanBoard";

const defaultWorkStations: WorkStation[] = [
  { id: "design", name: "Design", color: "#3b82f6", capacity: 5 },
  { id: "printing", name: "Screen Printing", color: "#8b5cf6", capacity: 8 },
  { id: "embroidery", name: "Embroidery", color: "#10b981", capacity: 6 },
  { id: "heat-press", name: "Heat Press", color: "#f59e0b", capacity: 4 },
  { id: "quality", name: "Quality Control", color: "#ef4444", capacity: 3 },
  { id: "packaging", name: "Packaging", color: "#6b7280", capacity: 10 },
];

export function WorkStationManager() {
  const [workStations, setWorkStations] = useState<WorkStation[]>(defaultWorkStations);
  const [open, setOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<WorkStation | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6",
    capacity: "5",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stationData = {
      id: editingStation?.id || Date.now().toString(),
      name: formData.name,
      color: formData.color,
      capacity: parseInt(formData.capacity),
    };

    if (editingStation) {
      setWorkStations(workStations.map(ws => 
        ws.id === editingStation.id ? stationData : ws
      ));
    } else {
      setWorkStations([...workStations, stationData]);
    }

    setFormData({ name: "", color: "#3b82f6", capacity: "5" });
    setEditingStation(null);
    setOpen(false);
  };

  const handleEdit = (station: WorkStation) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      color: station.color,
      capacity: station.capacity.toString(),
    });
    setOpen(true);
  };

  const handleDelete = (stationId: string) => {
    setWorkStations(workStations.filter(ws => ws.id !== stationId));
  };

  const resetForm = () => {
    setFormData({ name: "", color: "#3b82f6", capacity: "5" });
    setEditingStation(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage Work Stations
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Work Station Management</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Work Stations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Current Work Stations</h3>
              <Button 
                size="sm" 
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Station
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {workStations.map((station) => (
                <Card key={station.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: station.color }}
                        />
                        <div>
                          <div className="font-medium">{station.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Capacity: {station.capacity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(station)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(station.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {editingStation ? "Edit Work Station" : "Add New Work Station"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Station Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Screen Printing"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (items)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStation ? "Update Station" : "Add Station"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}