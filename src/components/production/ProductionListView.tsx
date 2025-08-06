import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Calendar, Package, Clock, TrendingUp, ArrowUpDown } from "lucide-react";
import { ProductionJob } from "@/types/equipment";
import { format } from "date-fns";

// Mock production jobs data
const mockJobs: ProductionJob[] = [
  {
    id: "job-001",
    quoteId: "3032",
    quoteName: "Project Care Quote",
    itemId: "item-001",
    itemName: "T-Shirts - Blue",
    description: "Cotton T-Shirt with screen printed logo",
    quantity: 375,
    decorationMethod: "screen_printing",
    dueDate: new Date("2024-12-15"),
    priority: "high",
    assignedEquipmentId: "sp-001",
    status: "scheduled",
    estimatedDuration: 240,
    scheduledStartTime: new Date("2024-12-10T08:00:00"),
    scheduledEndTime: new Date("2024-12-10T12:00:00"),
    artworkCompleted: true,
    setupRequired: true,
    specialInstructions: "Use water-based ink for environmental requirements",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-05"),
  },
  {
    id: "job-002", 
    quoteId: "3033",
    quoteName: "Corporate Polo Order",
    itemId: "item-002",
    itemName: "Polo Shirts - Navy",
    description: "Embroidered company logo on left chest",
    quantity: 150,
    decorationMethod: "embroidery",
    dueDate: new Date("2024-12-20"),
    priority: "medium",
    assignedEquipmentId: "emb-001",
    status: "in_progress",
    estimatedDuration: 180,
    scheduledStartTime: new Date("2024-12-08T09:00:00"),
    scheduledEndTime: new Date("2024-12-08T12:00:00"),
    artworkCompleted: true,
    setupRequired: false,
    createdAt: new Date("2024-11-28"),
    updatedAt: new Date("2024-12-08"),
  },
  {
    id: "job-003",
    quoteId: "3034", 
    quoteName: "Event Merchandise",
    itemId: "item-003",
    itemName: "Hoodies - Gray",
    description: "Heat transfer vinyl logo application",
    quantity: 85,
    decorationMethod: "heat_press",
    dueDate: new Date("2024-12-18"),
    priority: "rush",
    status: "pending",
    estimatedDuration: 120,
    artworkCompleted: false,
    setupRequired: true,
    specialInstructions: "Rush order - customer needs by Dec 18th for event",
    createdAt: new Date("2024-12-06"),
    updatedAt: new Date("2024-12-06"),
  },
  {
    id: "job-004",
    quoteId: "3032",
    quoteName: "Project Care Quote", 
    itemId: "item-004",
    itemName: "Hoodies - Black",
    description: "Embroidered logo on front and back",
    quantity: 235,
    decorationMethod: "embroidery",
    dueDate: new Date("2024-12-22"),
    priority: "medium",
    assignedEquipmentId: "emb-002",
    status: "on_hold",
    estimatedDuration: 300,
    artworkCompleted: false,
    setupRequired: true,
    specialInstructions: "Waiting for artwork approval from customer",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-03"),
  },
];

const equipmentNames = {
  "sp-001": "M&R Sportsman (Auto)",
  "sp-002": "Workhorse Manual Press", 
  "emb-001": "Brother PR-1050X",
  "emb-002": "Tajima TMAR-1201C",
};

export function ProductionListView() {
  const [jobs] = useState<ProductionJob[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "on_hold": return "bg-red-100 text-red-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "rush": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.quoteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.quoteId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || job.priority === priorityFilter;
      const matchesEquipment = equipmentFilter === "all" || job.assignedEquipmentId === equipmentFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesEquipment;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "dueDate":
          aValue = a.dueDate.getTime();
          bValue = b.dueDate.getTime();
          break;
        case "priority":
          const priorityOrder = { "rush": 4, "high": 3, "medium": 2, "low": 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.itemName.toLowerCase();
          bValue = b.itemName.toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Production Jobs List</h2>
        <div className="text-sm text-muted-foreground">
          {filteredJobs.length} of {jobs.length} jobs
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="rush">Rush</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="sp-001">M&R Sportsman (Auto)</SelectItem>
                <SelectItem value="sp-002">Workhorse Manual</SelectItem>
                <SelectItem value="emb-001">Brother PR-1050X</SelectItem>
                <SelectItem value="emb-002">Tajima TMAR-1201C</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="itemName">Item Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("itemName")} className="h-auto p-0 hover:bg-transparent">
                    Job Details <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("quantity")} className="h-auto p-0 hover:bg-transparent">
                    Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("dueDate")} className="h-auto p-0 hover:bg-transparent">
                    Due Date <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("priority")} className="h-auto p-0 hover:bg-transparent">
                    Priority <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("status")} className="h-auto p-0 hover:bg-transparent">
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Schedule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.itemName}</div>
                      <div className="text-sm text-muted-foreground">{job.quoteName} (#{job.quoteId})</div>
                      <div className="text-xs text-muted-foreground mt-1">{job.description}</div>
                      {job.specialInstructions && (
                        <div className="text-xs text-orange-600 mt-1">
                          ⚠ {job.specialInstructions}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{job.quantity}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {job.decorationMethod.replace("_", " ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(job.dueDate, "MMM dd")}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(job.dueDate, "yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(job.priority)}>
                      {job.priority === "rush" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {job.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    {job.assignedEquipmentId ? (
                      <div>
                        <div className="font-medium text-sm">
                          {equipmentNames[job.assignedEquipmentId as keyof typeof equipmentNames]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {job.assignedEquipmentId}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {job.scheduledStartTime && job.scheduledEndTime ? (
                      <div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {format(job.scheduledStartTime, "MMM dd, HH:mm")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Duration: {job.estimatedDuration}min
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not scheduled</span>
                    )}
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