import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImprintJob } from "@/types/imprint-job";
import { Calendar, Clock, Package, User, MapPin, FileCheck, AlertCircle, ChevronRight, XCircle, Palette, Shirt, Link, Image, FileText, ArrowRight, Truck, Scissors, Route, CheckCircle } from "lucide-react";
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
            {/* Visual Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Visual Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {job.mockupImage && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Garment Mockup</p>
                      <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                        <img 
                          src={job.mockupImage} 
                          alt="Garment mockup" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {job.imprintLogo && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Imprint Logo</p>
                      <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                        <img 
                          src={job.imprintLogo} 
                          alt="Imprint logo" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Job Dependencies and Related Jobs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Dependencies */}
              <div className="space-y-4">
                {/* Dependencies */}
                {(dependentJobs.length > 0 || blockingJobs.length > 0) && (
                  <Card className="bg-background h-full">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Dependencies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {dependentJobs.length > 0 && (
                        <div>
                          {dependentJobs.map(depJob => (
                            <div key={depJob.id} className={cn(
                              "border rounded-lg p-3 mb-3 transition-colors",
                              depJob.orderGroupColor
                            )}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{depJob.jobNumber}</span>
                                  {depJob.sequenceOrder && (
                                    <Badge variant="outline" className="text-xs">
                                      Step {depJob.sequenceOrder}
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {depJob.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="flex gap-3 mb-3">
                                {depJob.mockupImage && (
                                  <div className="w-16 h-16 rounded border overflow-hidden bg-white flex-shrink-0">
                                    <img 
                                      src={depJob.mockupImage} 
                                      alt="Job mockup" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                  </div>
                                )}
                                {depJob.imprintLogo && (
                                  <div className="w-16 h-16 rounded border overflow-hidden bg-white flex-shrink-0">
                                    <img 
                                      src={depJob.imprintLogo} 
                                      alt="Imprint logo" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium mb-1">{depJob.description}</p>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{depJob.placement}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{depJob.estimatedHours}h</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Package className="h-3 w-3" />
                                      <span>{depJob.totalQuantity} pieces</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="capitalize">{depJob.decorationMethod.replace("_", " ")}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {blockingJobs.length > 0 && (
                        <div>
                          {blockingJobs.map(blockJob => (
                            <div key={blockJob.id} className={cn(
                              "border rounded-lg p-3 transition-colors",
                              blockJob.orderGroupColor
                            )}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{blockJob.jobNumber}</span>
                                  {blockJob.sequenceOrder && (
                                    <Badge variant="outline" className="text-xs">
                                      Step {blockJob.sequenceOrder}
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant={blockJob.status === "scheduled" ? "default" : "secondary"} className="text-xs">
                                  {blockJob.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="flex gap-3 mb-3">
                                {blockJob.mockupImage && (
                                  <div className="w-16 h-16 rounded border overflow-hidden bg-muted flex-shrink-0">
                                    <img 
                                      src={blockJob.mockupImage} 
                                      alt="Job mockup" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                  </div>
                                )}
                                {blockJob.imprintLogo && (
                                  <div className="w-16 h-16 rounded border overflow-hidden bg-muted flex-shrink-0">
                                    <img 
                                      src={blockJob.imprintLogo} 
                                      alt="Imprint logo" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium mb-1">{blockJob.description}</p>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{blockJob.placement}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{blockJob.estimatedHours}h</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Package className="h-3 w-3" />
                                      <span>{blockJob.totalQuantity} pieces</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="capitalize">{blockJob.decorationMethod.replace("_", " ")}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {blockJob.scheduledStart && (
                                <div className="pt-2 border-t border-border">
                                  <p className="text-xs text-muted-foreground">
                                    Scheduled: {format(blockJob.scheduledStart, "MMM d, h:mm a")}
                                  </p>
                                </div>
                              )}
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
                  <Card className="bg-background h-full">
                    <CardHeader>
                      <CardTitle className="text-base">Related Imprints</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {relatedJobs.map(relJob => (
                        <div key={relJob.id} className={cn(
                          "border rounded-lg p-3 transition-colors",
                          relJob.orderGroupColor
                        )}>
                          {/* Header with job number and status */}
                          <div className="flex items-center justify-between mb-3">
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

                          {/* Visual mockup and logo */}
                          <div className="flex gap-3 mb-3">
                            {relJob.mockupImage && (
                              <div className="w-16 h-16 rounded border overflow-hidden bg-muted flex-shrink-0">
                                <img 
                                  src={relJob.mockupImage} 
                                  alt="Job mockup" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                            )}
                            {relJob.imprintLogo && (
                              <div className="w-16 h-16 rounded border overflow-hidden bg-muted flex-shrink-0">
                                <img 
                                  src={relJob.imprintLogo} 
                                  alt="Imprint logo" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1">{relJob.description}</p>
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
                            </div>
                          </div>

                          {relJob.scheduledStart && (
                            <div className="pt-2 border-t border-border">
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
              </div>
            </div>

            {/* Routing Section */}
            {job.routingInstructions && job.routingInstructions.length > 0 && (
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Routing Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {job.routingInstructions.map((routing) => (
                    <div key={routing.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {routing.type === 'imprint_routing' && <Scissors className="h-4 w-4 text-blue-500" />}
                          {routing.type === 'shipping_routing' && <Truck className="h-4 w-4 text-green-500" />}
                          {routing.type === 'size_split' && <Package className="h-4 w-4 text-orange-500" />}
                          {routing.type === 'general_routing' && <MapPin className="h-4 w-4 text-purple-500" />}
                          <h4 className="font-medium">{routing.title}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {routing.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      {routing.description && (
                        <p className="text-sm text-muted-foreground">
                          {routing.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {routing.splits
                          .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                          .map((split) => (
                          <div key={split.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {split.destinationType === 'next_imprint' && <ArrowRight className="h-4 w-4 text-blue-500" />}
                                {split.destinationType === 'shipping_location' && <Truck className="h-4 w-4 text-green-500" />}
                                {split.destinationType === 'quality_check' && <CheckCircle className="h-4 w-4 text-yellow-500" />}
                                {split.destinationType === 'storage' && <Package className="h-4 w-4 text-gray-500" />}
                                <span className="font-medium text-sm">
                                  {split.destinationName}
                                </span>
                              </div>
                              {split.priority && (
                                <Badge variant="secondary" className="text-xs">
                                  #{split.priority}
                                </Badge>
                              )}
                            </div>

                            {/* Criteria */}
                            <div className="space-y-2">
                              {split.criteria.sizes && split.criteria.sizes.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Sizes:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {split.criteria.sizes.map((size) => (
                                      <Badge key={size} variant="outline" className="text-xs">
                                        {size}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {split.criteria.quantities && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Quantities:</p>
                                  <div className="space-y-1">
                                    {Object.entries(split.criteria.quantities).map(([size, qty]) => (
                                      <div key={size} className="flex justify-between text-xs">
                                        <span>{size}:</span>
                                        <span className="font-medium">{qty}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {split.criteria.conditions && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Conditions:</p>
                                  <p className="text-xs">{split.criteria.conditions}</p>
                                </div>
                              )}
                            </div>

                            {/* Instructions */}
                            <div className="pt-2 border-t">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Instructions:</p>
                              <p className="text-xs">{split.instructions}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Imprint Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Imprint Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Method</p>
                    <p className="font-medium">{job.imprintMethod || job.decorationMethod.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{job.imprintLocation || job.placement}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{job.imprintSize || job.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Colors/Threads</p>
                    <p className="font-medium">{job.imprintColors || job.colours}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Time</p>
                    <p className="font-medium">{job.estimatedHours}h</p>
                  </div>
                </div>
                
                {job.imprintNotes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm bg-muted p-3 rounded-lg">{job.imprintNotes}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {job.customerArt && job.customerArt.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Customer Art</p>
                      <div className="space-y-1">
                        {job.customerArt.map((file) => (
                          <div key={file.id} className="text-xs p-2 bg-muted rounded flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {job.productionFiles && job.productionFiles.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Production Files</p>
                      <div className="space-y-1">
                        {job.productionFiles.map((file) => (
                          <div key={file.id} className="text-xs p-2 bg-muted rounded flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {job.proofMockup && job.proofMockup.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Proof/Mockup</p>
                      <div className="space-y-1">
                        {job.proofMockup.map((file) => (
                          <div key={file.id} className="text-xs p-2 bg-muted rounded flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Line Items with Size Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Line Items & Size Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item #</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>S</TableHead>
                      <TableHead>M</TableHead>
                      <TableHead>L</TableHead>
                      <TableHead>XL</TableHead>
                      <TableHead>XXL</TableHead>
                      <TableHead>Total Qty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {job.products?.map((product) => {
                      const sizes = job.sizeBreakdown?.[product.id] || {};
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.itemNumber}</TableCell>
                          <TableCell>{product.color}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>{sizes.S || 0}</TableCell>
                          <TableCell>{sizes.M || 0}</TableCell>
                          <TableCell>{sizes.L || 0}</TableCell>
                          <TableCell>{sizes.XL || 0}</TableCell>
                          <TableCell>{sizes.XXL || 0}</TableCell>
                          <TableCell className="font-medium">{product.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={product.status === "Complete" ? "default" : "secondary"}>
                              {product.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

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