
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, PlusCircle, Pencil, Trash, Clock } from 'lucide-react';

// Mock data
const initialTasks = [
  { id: 1, name: 'Artwork Review', description: 'Review customer artwork for printability', duration: 30, category: 'design' },
  { id: 2, name: 'Customer Approval', description: 'Get final customer approval of mock-up', duration: 60, category: 'customer' },
  { id: 3, name: 'Vector Conversion', description: 'Convert raster artwork to vector format', duration: 45, category: 'design' },
  { id: 4, name: 'Color Separation', description: 'Create color separations for screen printing', duration: 60, category: 'production' },
  { id: 5, name: 'Order Fulfillment', description: 'Prepare order for shipping', duration: 30, category: 'shipping' },
];

export function PresetTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({ 
    name: '', 
    description: '', 
    duration: 30, 
    category: 'design' 
  });
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!newTask.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Task name is required",
      });
      return;
    }

    const id = Math.max(0, ...tasks.map(t => t.id)) + 1;
    setTasks([...tasks, { ...newTask, id }]);
    setNewTask({ name: '', description: '', duration: 30, category: 'design' });
    setIsAddOpen(false);
    
    toast({
      title: "Task Created",
      description: `${newTask.name} task has been created successfully`,
    });
  };

  const handleUpdateTask = () => {
    if (!currentTask) return;
    
    setTasks(tasks.map(task => 
      task.id === currentTask.id ? currentTask : task
    ));
    setIsEditOpen(false);
    
    toast({
      title: "Task Updated",
      description: `${currentTask.name} task has been updated`,
    });
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const task = tasks.find(t => t.id === id);
      setTasks(tasks.filter(task => task.id !== id));
      
      toast({
        title: "Task Deleted",
        description: `${task?.name} task has been removed`,
      });
    }
  };

  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Preset Tasks</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle size={16} /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Preset Task</DialogTitle>
              <DialogDescription>
                Create a reusable task template for your workflow.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  placeholder="e.g., Artwork Review"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Describe the task details..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-duration">Duration (minutes)</Label>
                  <Input
                    id="task-duration"
                    type="number"
                    min={1}
                    value={newTask.duration}
                    onChange={(e) => setNewTask({...newTask, duration: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-category">Category</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({...newTask, category: value})}
                  >
                    <SelectTrigger id="task-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="customer">Customer Service</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="admin">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Predefined Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{task.duration} min</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{task.category}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditTask(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
