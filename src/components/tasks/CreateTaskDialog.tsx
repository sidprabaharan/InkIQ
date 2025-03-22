import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { USERS } from "@/pages/Tasks";
import { TaskPriority, TaskStatus } from "@/types/task";

interface CreateTaskDialogProps {
  onCreateTask: (task: any) => void;
  initialOrderNumber?: string;
}

export function CreateTaskDialog({ onCreateTask, initialOrderNumber }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || '');
  const [responsible, setResponsible] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [images, setImages] = useState<{ id: string, url: string, name: string }[]>([]);
  
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    // Preserve the current time when changing the date
    if (date) {
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
    }
    
    setDate(newDate);
  };
  
  const handleHourChange = (hour: number) => {
    if (!date) return;
    const newDate = new Date(date);
    
    // Handle AM/PM conversion
    const isPM = newDate.getHours() >= 12;
    const adjustedHour = isPM && hour < 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    
    newDate.setHours(adjustedHour);
    setDate(newDate);
  };

  const handleMinuteChange = (minute: number) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setMinutes(minute);
    setDate(newDate);
  };

  const handleAmPmChange = (isPm: boolean) => {
    if (!date) return;
    const newDate = new Date(date);
    let hours = newDate.getHours();
    const isCurrentlyPm = hours >= 12;
    
    if (isPm && !isCurrentlyPm) {
      // Converting AM to PM
      hours += 12;
    } else if (!isPm && isCurrentlyPm) {
      // Converting PM to AM
      hours -= 12;
    }
    
    newDate.setHours(hours);
    setDate(newDate);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newImages = Array.from(e.target.files).map(file => {
      const id = crypto.randomUUID();
      return {
        id,
        url: URL.createObjectURL(file),
        name: file.name
      };
    });
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = () => {
    if (!title || !responsible || !date) return;

    const newTask = {
      id: crypto.randomUUID(),
      title,
      dueDate: date.toISOString(),
      status,
      responsible,
      priority,
      notes,
      orderNumber,
      assignedDate: new Date().toISOString(),
      images: images,
    };

    onCreateTask(newTask);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setOrderNumber(initialOrderNumber || '');
    setResponsible('');
    setPriority('medium');
    setStatus('pending');
    setNotes('');
    setDate(new Date());
    setImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number</Label>
            <Input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Associated order number (optional)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsible</Label>
            <Select value={responsible} onValueChange={setResponsible}>
              <SelectTrigger id="responsible">
                <SelectValue placeholder="Select responsible person" />
              </SelectTrigger>
              <SelectContent>
                {USERS.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Due Date & Time</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      {date ? format(date, "h:mm a") : "Select time"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-3 w-[280px] pointer-events-auto" align="start">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Hour</div>
                    <div className="text-sm font-medium">Minute</div>
                    <div className="text-sm font-medium">AM/PM</div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <Select
                      value={(date ? date.getHours() % 12 || 12 : 12).toString()}
                      onValueChange={(value) => handleHourChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={(date ? date.getMinutes() : 0).toString()}
                      onValueChange={(value) => handleMinuteChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                          <SelectItem key={minute} value={minute.toString()}>
                            {minute.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM"}
                      onValueChange={(value) => handleAmPmChange(value === "PM")}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add task notes (optional)"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Upload Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag & drop images or click to browse</p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-24 object-cover w-full rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
