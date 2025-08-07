import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImprintJob } from "@/types/imprint-job";
import { Calendar, Clock, Package, User, MapPin, FileCheck, AlertCircle, ChevronRight, XCircle, Palette, Shirt, Link } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface JobDetailModalProps {
  job: ImprintJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStageAdvance?: () => void;
  onUnschedule?: () => void;
  allJobs?: ImprintJob[]; // For showing related jobs
}

export function JobDetailModal({ 
  job, 
  open, 
  onOpenChange, 
  onStageAdvance, 
  onUnschedule,
  allJobs = []
}: JobDetailModalProps) {
  if (!job) return null;

  const isPriority = job?.priority === "high";
  const isOverdue = job && job.dueDate < new Date() && job.status !== "completed";
  
  // Get related jobs for this order
  const relatedJobs = job ? allJobs.filter(j => 
    j.orderId === job.orderId && j.id !== job.id
  ) : [];
  
  // Get dependent/blocking jobs
  const dependentJobs = job ? allJobs.filter(j => 
    job.dependsOnJobs?.includes(j.id)
  ) : [];
  
  const blockingJobs = job ? allJobs.filter(j => 
    job.blocksJobs?.includes(j.id)
  ) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Job Details - {job?.jobNumber}</span>
            {job?.sequenceOrder && (
              <Badge variant="outline" className="text-xs">
                Step {job.sequenceOrder}
              </Badge>
            )}
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

        {job && (
          <div className="space-y-6">
            {/* Order Overview */}
            <Card className={job.orderGroupColor}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {job.orderId} - {job.customerName}
                  {relatedJobs.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {relatedJobs.length + 1} jobs
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Due: {format(job.dueDate, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shirt className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.products.map(p => p.description).join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.totalQuantity} pieces</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - This Job */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>Job {job.jobNumber}</span>
                      {job.sequenceOrder && (
                        <Badge variant="outline">Step {job.sequenceOrder}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-medium">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={job.status === "scheduled" ? "default" : "secondary"}>
                          {job.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {job.decorationMethod.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="secondary">
                          {job.currentStage?.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.placement}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{job.estimatedHours}h estimated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <span>{job.colours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.artworkApproved ? (
                          <FileCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span>{job.artworkApproved ? "Approved" : "Pending"}</span>
                      </div>
                    </div>

                    {job.scheduledStart && (
                      <>
                        <Separator />
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm font-medium">Scheduled</p>
                          <p className="text-sm text-muted-foreground">
                            {format(job.scheduledStart, "MMM d, h:mm a")} - {format(job.scheduledEnd!, "h:mm a")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Equipment: {job.equipmentId}
                          </p>
                        </div>
                      </>
                    )}

                    {job.specialInstructions && (
                      <>
                        <Separator />
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-yellow-900">Special Instructions</p>
                          <p className="text-sm text-yellow-800">{job.specialInstructions}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Dependencies */}
                {(dependentJobs.length > 0 || blockingJobs.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Dependencies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {dependentJobs.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Must complete first:</p>
                          {dependentJobs.map(depJob => (
                            <div key={depJob.id} className="bg-orange-50 border border-orange-200 rounded p-2">
                              <p className="text-sm font-medium text-orange-900">{depJob.jobNumber}</p>
                              <p className="text-xs text-orange-700">{depJob.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {blockingJobs.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Waiting for this job:</p>
                          {blockingJobs.map(blockJob => (
                            <div key={blockJob.id} className="bg-blue-50 border border-blue-200 rounded p-2">
                              <p className="text-sm font-medium text-blue-900">{blockJob.jobNumber}</p>
                              <p className="text-xs text-blue-700">{blockJob.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Related Jobs */}
              <div className="space-y-4">
                {relatedJobs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Related Jobs in This Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {relatedJobs.map(relJob => (
                        <div key={relJob.id} className={cn(
                          "border rounded-lg p-3 transition-colors",
                          relJob.orderGroupColor
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{relJob.jobNumber}</span>
                              {relJob.sequenceOrder && (
                                <Badge variant="outline" className="text-xs">
                                  Step {relJob.sequenceOrder}
                                </Badge>
                              )}
                            </div>
                            <Badge variant={relJob.status === "scheduled" ? "default" : "secondary"} className="text-xs">
                              {relJob.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{relJob.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{relJob.placement}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{relJob.estimatedHours}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>{relJob.totalQuantity} pieces</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="capitalize">{relJob.decorationMethod.replace("_", " ")}</span>
                            </div>
                          </div>
                          {relJob.scheduledStart && (
                            <div className="mt-2 pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground">
                                Scheduled: {format(relJob.scheduledStart, "MMM d, h:mm a")}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Production Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Production Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>• {job.decorationMethod === "embroidery" ? "Use high-quality thread for durability" : "Ensure proper ink coverage"}</p>
                      <p>• Check garment positioning before starting</p>
                      <p>• Quality control check after completion</p>
                      {relatedJobs.length > 0 && (
                        <p className="text-orange-600">• Coordinate with related jobs for timing</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              {job.status === "scheduled" && onUnschedule && (
                <Button variant="outline" onClick={onUnschedule}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Unschedule
                </Button>
              )}
              {onStageAdvance && job.status === "scheduled" && (
                <Button onClick={onStageAdvance}>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Advance Stage
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}