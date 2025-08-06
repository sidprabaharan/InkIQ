import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PrintavoJob } from "./PrintavoPowerScheduler";
import { Clock, Calendar, Package, FileCheck, AlertCircle, User, MapPin, Palette, Shirt } from "lucide-react";
import { format } from "date-fns";

interface JobDetailModalProps {
  job: PrintavoJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStageAdvance?: () => void;
  onUnschedule?: () => void;
}

export function JobDetailModal({ job, open, onOpenChange, onStageAdvance, onUnschedule }: JobDetailModalProps) {
  if (!job) return null;

  const isPriority = job.priority === "high";
  const isOverdue = job.dueDate < new Date() && job.status !== "completed";

  // Mock related jobs and order data
  const relatedJobs = [
    { id: "related-1", description: "Front Logo Print", method: "embroidery", stage: "digitize" },
    { id: "related-2", description: "Back Name Print", method: "screen_printing", stage: "print" }
  ];

  const orderGarments = [
    { size: "S", quantity: 12, color: "Navy" },
    { size: "M", quantity: 18, color: "Navy" },
    { size: "L", quantity: 12, color: "Navy" },
    { size: "XL", quantity: 6, color: "Navy" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Job Details - {job.jobNumber}</span>
            {isPriority && (
              <Badge variant="destructive" className="text-xs">
                HIGH PRIORITY
              </Badge>
            )}
            {isOverdue && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Job Information */}
          <div className="space-y-6">
            {/* Basic Job Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{job.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shirt className="h-4 w-4 text-muted-foreground" />
                  <span>{job.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{job.quantity} pieces</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{job.estimatedHours} hours estimated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {format(job.dueDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{job.decorationMethod.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Production Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Production Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Stage:</span>
                  <Badge variant="outline" className="capitalize">
                    {job.currentStage?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={job.status === "scheduled" ? "default" : "secondary"} className="capitalize">
                    {job.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Artwork Approved:</span>
                  {job.artworkApproved ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <FileCheck className="h-4 w-4" />
                      <span>Yes</span>
                    </div>
                  ) : (
                    <span className="text-amber-600">Pending</span>
                  )}
                </div>
                {job.scheduledStart && (
                  <div className="flex justify-between">
                    <span>Scheduled:</span>
                    <span>{format(job.scheduledStart, "MMM d, h:mm a")} - {format(job.scheduledEnd!, "h:mm a")}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Line Item Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Garment Details</h3>
              <div className="space-y-2">
                {orderGarments.map((garment, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>{garment.size} - {garment.color}</span>
                    <span className="font-medium">{garment.quantity} pcs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Related Information */}
          <div className="space-y-6">
            {/* Imprint Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Imprint Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Placement:</span>
                  <span>Left Chest</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>3" x 4"</span>
                </div>
                <div className="flex justify-between">
                  <span>Colors:</span>
                  <span>2 Colors (Black, White)</span>
                </div>
                <div className="flex justify-between">
                  <span>Setup Required:</span>
                  <span className="text-amber-600">Yes</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Related Jobs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Related Jobs</h3>
              <div className="space-y-2">
                {relatedJobs.map((relatedJob) => (
                  <div key={relatedJob.id} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{relatedJob.description}</span>
                        <div className="text-sm text-muted-foreground capitalize">
                          {relatedJob.method.replace('_', ' ')} - {relatedJob.stage.replace('_', ' ')}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Same Order
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Special Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Special Instructions</h3>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  Use Pantone 186C for red color. Ensure proper registration for multi-color design. 
                  Customer requires delivery by 3 PM on due date.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          {job.status === "scheduled" && onUnschedule && (
            <Button variant="outline" onClick={onUnschedule}>
              Unschedule
            </Button>
          )}
          {onStageAdvance && job.status === "scheduled" && (
            <Button onClick={onStageAdvance}>
              Advance to Next Stage
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}