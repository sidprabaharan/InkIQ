
import { useState } from 'react';
import { 
  Check, 
  Clock, 
  Calendar,
  Edit,
  Save,
  X,
  Image,
  Upload
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { USERS } from "@/pages/Tasks";
import { TaskImage, TaskPriority, TaskProps, TaskStatus } from "@/types/task";

interface TaskCardProps {
  task: TaskProps;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onTaskUpdate: (fields: Partial<TaskProps>) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function TaskCard({ 
  task, 
  onStatusChange, 
  onPriorityChange, 
  onTaskUpdate,
  isExpanded,
  onToggleExpand
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [date, setDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [viewImageIndex, setViewImageIndex] = useState<number | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  
  const priorityColors: Record<TaskPriority, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };

  const statusColors = {
    'pending': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
  };

  const formatStatus = (status: TaskStatus) => {
    return status === 'in-progress' 
      ? 'In Progress' 
      : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleEditSave = () => {
    if (isEditing) {
      onTaskUpdate(editedTask);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    
    date.setHours(hours);
    date.setMinutes(minutes);
    
    setDate(date);
    setEditedTask({...editedTask, dueDate: date.toISOString()});
  };

  const handleHourChange = (hour: number) => {
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    const isPM = currentDate.getHours() >= 12;
    // If PM and hour selected is 1-11, add 12; if AM and hour is 12, set to 0
    const adjustedHour = isPM && hour < 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    
    currentDate.setHours(adjustedHour);
    setEditedTask({...editedTask, dueDate: currentDate.toISOString()});
  };

  const handleMinuteChange = (minute: number) => {
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    currentDate.setMinutes(minute);
    setEditedTask({...editedTask, dueDate: currentDate.toISOString()});
  };

  const handleAmPmChange = (isPm: boolean) => {
    const currentDate = editedTask.dueDate ? new Date(editedTask.dueDate) : new Date();
    let hours = currentDate.getHours();
    const isCurrentlyPm = hours >= 12;
    
    if (isPm && !isCurrentlyPm) {
      // Converting AM to PM
      hours += 12;
    } else if (!isPm && isCurrentlyPm) {
      // Converting PM to AM
      hours -= 12;
    }
    
    currentDate.setHours(hours);
    setEditedTask({...editedTask, dueDate: currentDate.toISOString()});
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
    
    const currentImages = editedTask.images || [];
    setEditedTask({
      ...editedTask, 
      images: [...currentImages, ...newImages]
    });
    
    setIsUploadingImages(false);
  };

  const removeImage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const currentImages = editedTask.images || [];
    setEditedTask({
      ...editedTask,
      images: currentImages.filter(img => img.id !== id)
    });
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${isExpanded ? 'scale-[1.02]' : ''}`}
      onClick={() => !isEditing && onToggleExpand()}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 w-full max-w-lg">
            {isEditing ? (
              <div className="space-y-5">
                <div>
                  <Label className="block font-medium mb-2 text-foreground">Task Name:</Label>
                  <Input 
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    onClick={stopPropagation}
                    className="font-medium text-base border-gray-300 focus:border-primary"
                    placeholder="Task title"
                  />
                </div>
                
                <div onClick={stopPropagation}>
                  <Label className="block font-medium mb-2 text-foreground">Order Number:</Label>
                  <Input 
                    value={editedTask.orderNumber || ''}
                    onChange={(e) => setEditedTask({...editedTask, orderNumber: e.target.value})}
                    className="border-gray-300 focus:border-primary text-foreground"
                    placeholder="Associated order number"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-medium">{task.title}</h3>
                {task.orderNumber && (
                  <p className="text-sm text-foreground">Order: #{task.orderNumber}</p>
                )}
              </>
            )}
            <p className="text-sm text-foreground">
              {isEditing ? (
                <div onClick={stopPropagation} className="mt-5">
                  <Label className="block font-medium mb-2 text-foreground">Responsible:</Label>
                  <Select
                    value={editedTask.responsible}
                    onValueChange={(value: string) => setEditedTask({...editedTask, responsible: value})}
                  >
                    <SelectTrigger className="w-full bg-white border-gray-300 text-foreground">
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
              ) : (
                `Responsible: ${task.responsible}`
              )}
            </p>
          </div>
          <div className="flex gap-2" onClick={stopPropagation}>
            <Select
              value={task.priority}
              onValueChange={(value: TaskPriority) => {
                onPriorityChange(value);
              }}
            >
              <SelectTrigger className={`h-8 text-xs min-w-16 ${priorityColors[task.priority]}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={task.status}
              onValueChange={(value: TaskStatus) => {
                onStatusChange(value);
              }}
            >
              <SelectTrigger 
                className={`h-8 text-xs ${statusColors[task.status]} ${
                  task.status === 'in-progress' 
                    ? 'min-w-28' 
                    : task.status === 'completed' 
                      ? 'min-w-28' 
                      : 'min-w-24'
                }`}
              >
                <SelectValue placeholder="Status">
                  {formatStatus(task.status)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            {isExpanded && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSave();
                }}
                className="h-8"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            )}
            
            {isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="h-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3">
          {isEditing ? (
            <div className="flex flex-col space-y-4 mt-2" onClick={stopPropagation}>
              <div>
                <label className="text-sm font-medium block mb-2">Due Date & Time:</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white border-gray-300 w-full md:w-[240px]",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal bg-white border-gray-300 w-full md:w-[140px]"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {editedTask.dueDate 
                            ? format(new Date(editedTask.dueDate), "h:mm a") 
                            : "Select time"}
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
                          value={(editedTask.dueDate 
                            ? new Date(editedTask.dueDate).getHours() % 12 || 12
                            : 12).toString()}
                          onValueChange={(value) => handleHourChange(parseInt(value))}
                        >
                          <SelectTrigger className="w-20 bg-white border-gray-300">
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
                          value={(editedTask.dueDate 
                            ? new Date(editedTask.dueDate).getMinutes()
                            : 0).toString()}
                          onValueChange={(value) => handleMinuteChange(parseInt(value))}
                        >
                          <SelectTrigger className="w-20 bg-white border-gray-300">
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
                          value={editedTask.dueDate 
                            ? new Date(editedTask.dueDate).getHours() >= 12 ? "PM" : "AM"
                            : "AM"}
                          onValueChange={(value) => handleAmPmChange(value === "PM")}
                        >
                          <SelectTrigger className="w-20 bg-white border-gray-300">
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
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <p className="text-sm">Due: {formatDateTime(task.dueDate)}</p>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <div>
              {isEditing ? (
                <div className="mt-2" onClick={stopPropagation}>
                  <Label className="block font-medium mb-2 text-foreground">Notes:</Label>
                  <Textarea 
                    value={editedTask.notes || ''}
                    onChange={(e) => setEditedTask({...editedTask, notes: e.target.value})}
                    placeholder="Add notes here..."
                    className="min-h-[100px] border-gray-300 bg-white"
                  />
                </div>
              ) : (
                <>
                  {task.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm mt-1 bg-gray-50 p-3 rounded border border-gray-100">{task.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Image Attachment Section */}
            <div className="mt-2" onClick={stopPropagation}>
              <div className="flex items-center justify-between">
                <Label className="block font-medium mb-2 text-foreground">
                  <div className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    <span>Attachments:</span>
                  </div>
                </Label>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsUploadingImages(true)}
                    className="mb-2"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    <span>Upload</span>
                  </Button>
                )}
              </div>
              
              {isEditing && isUploadingImages && (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 mb-4">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag & drop images or click to browse</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id={`image-upload-${task.id}`}
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById(`image-upload-${task.id}`)?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>
              )}
              
              {(!editedTask.images || editedTask.images.length === 0) ? (
                <p className="text-sm text-gray-500">No attachments</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                  {editedTask.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="h-16 object-cover w-full rounded-md border border-gray-200"
                            />
                            <p className="text-xs mt-1 truncate">{image.name}</p>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[80vw] p-1">
                          <img 
                            src={image.url} 
                            alt={image.name} 
                            className="w-full h-auto max-h-[80vh] object-contain"
                          />
                        </DialogContent>
                      </Dialog>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={(e) => removeImage(e, image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="text-sm">
                {task.assignedDate 
                  ? <>
                      Assigned: {formatDateTime(task.assignedDate)} 
                      {task.assignedBy && <span> by {task.assignedBy}</span>}
                    </> 
                  : 'Not assigned'}
              </p>
            </div>

            {isEditing && (
              <div onClick={stopPropagation} className="mt-2">
                <Label className="block font-medium mb-2 text-foreground">Assigned By:</Label>
                <Select
                  value={editedTask.assignedBy || ''}
                  onValueChange={(value: string) => setEditedTask({...editedTask, assignedBy: value})}
                >
                  <SelectTrigger className="w-full bg-white border-gray-300">
                    <SelectValue placeholder="Select who assigned this task" />
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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
