
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Trash2, X, FileText, Image as ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EnhancedMockupUploadDialog } from "./EnhancedMockupUploadDialog";
import { ImprintItem, ImprintFile, IMPRINT_METHODS, getMethodConfig } from "@/types/imprint";
import { toast } from "sonner";

interface ImprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (imprints: ImprintItem[]) => void;
  initialImprints?: ImprintItem[];
}

export function ImprintDialog({ open, onOpenChange, onSave, initialImprints = [] }: ImprintDialogProps) {
  const [imprints, setImprints] = useState<ImprintItem[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentImprintIndex, setCurrentImprintIndex] = useState<number | null>(null);
  const [currentUploadCategory, setCurrentUploadCategory] = useState<'customerArt' | 'productionFiles' | 'proofMockup'>('customerArt');
  
  // Reset state when dialog opens with new initialImprints
  React.useEffect(() => {
    if (open) {
      setImprints(initialImprints.length > 0 ? 
        initialImprints : 
        [{
          id: `imprint-${Math.random().toString(36).substring(2, 9)}`,
          method: "",
          location: "",
          width: 0,
          height: 0,
          colorsOrThreads: "",
          notes: "",
          customerArt: [],
          productionFiles: [],
          proofMockup: []
        }]
      );
    }
  }, [open, initialImprints]);

  const addNewImprint = () => {
    setImprints([...imprints, {
      id: `imprint-${Math.random().toString(36).substring(2, 9)}`,
      method: "",
      location: "",
      width: 0,
      height: 0,
      colorsOrThreads: "",
      notes: "",
      customerArt: [],
      productionFiles: [],
      proofMockup: []
    }]);
  };

  const handleImprintChange = (index: number, field: keyof ImprintItem, value: string | number) => {
    const updatedImprints = [...imprints];
    updatedImprints[index] = {
      ...updatedImprints[index],
      [field]: value
    };
    setImprints(updatedImprints);
  };

  const handleUploadClick = (index: number, category: 'customerArt' | 'productionFiles' | 'proofMockup') => {
    setCurrentImprintIndex(index);
    setCurrentUploadCategory(category);
    setUploadDialogOpen(true);
  };

  const handleDeleteImprint = (index: number) => {
    if (imprints.length > 1) {
      const updatedImprints = imprints.filter((_, i) => i !== index);
      setImprints(updatedImprints);
      toast.success("Imprint deleted successfully");
    } else {
      toast.error("Cannot delete the only imprint");
    }
  };

  const handleUploadComplete = (files: File[]) => {
    if (files.length > 0 && currentImprintIndex !== null) {
      const newFiles: ImprintFile[] = files.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        category: currentUploadCategory
      }));
      
      setImprints(prevImprints => {
        const updatedImprints = [...prevImprints];
        const currentImprint = updatedImprints[currentImprintIndex];
        updatedImprints[currentImprintIndex] = {
          ...currentImprint,
          [currentUploadCategory]: [...currentImprint[currentUploadCategory], ...newFiles]
        };
        return updatedImprints;
      });

      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`);
    }
  };

  const handleRemoveFile = (imprintIndex: number, category: 'customerArt' | 'productionFiles' | 'proofMockup', fileId: string) => {
    setImprints(prevImprints => {
      const updatedImprints = [...prevImprints];
      const currentImprint = updatedImprints[imprintIndex];
      updatedImprints[imprintIndex] = {
        ...currentImprint,
        [category]: currentImprint[category].filter(file => file.id !== fileId)
      };
      return updatedImprints;
    });
  };

  const handleSave = () => {
    // Validate required fields
    const hasErrors = imprints.some(imprint => 
      !imprint.method || !imprint.location || imprint.width <= 0 || imprint.height <= 0
    );
    
    if (hasErrors) {
      toast.error("Please fill in all required fields (Method, Location, Width, Height)");
      return;
    }
    
    onSave(imprints);
    onOpenChange(false);
  };

  const getMethodConfig = (methodValue: string) => {
    return IMPRINT_METHODS.find(method => method.value === methodValue);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Imprint</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4">
            {imprints.map((imprint, index) => {
              const methodConfig = getMethodConfig(imprint.method);
              
              return (
                <div key={imprint.id} className="space-y-4 pb-6 border-b border-gray-200 mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Imprint {index + 1}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteImprint(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete imprint</span>
                    </Button>
                  </div>

                  {/* Method Selection */}
                  <div>
                    <Label htmlFor={`method-${index}`} className="text-sm font-medium">Method *</Label>
                    <Select 
                      value={imprint.method} 
                      onValueChange={(value) => handleImprintChange(index, "method", value)}
                    >
                      <SelectTrigger id={`method-${index}`} className="w-full">
                        <SelectValue placeholder="Select Imprint Method" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {IMPRINT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {methodConfig && (
                      <p className="text-xs text-muted-foreground mt-1">{methodConfig.instructions}</p>
                    )}
                  </div>

                  {/* Location and Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`location-${index}`} className="text-sm font-medium">Location *</Label>
                      <Input
                        id={`location-${index}`}
                        value={imprint.location}
                        onChange={(e) => handleImprintChange(index, "location", e.target.value)}
                        placeholder="e.g., Front chest, Back, Left sleeve"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`width-${index}`} className="text-sm font-medium">Width (in) *</Label>
                      <Input
                        id={`width-${index}`}
                        type="number"
                        step="0.1"
                        min="0"
                        value={imprint.width || ""}
                        onChange={(e) => handleImprintChange(index, "width", parseFloat(e.target.value) || 0)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`height-${index}`} className="text-sm font-medium">Height (in) *</Label>
                      <Input
                        id={`height-${index}`}
                        type="number"
                        step="0.1"
                        min="0"
                        value={imprint.height || ""}
                        onChange={(e) => handleImprintChange(index, "height", parseFloat(e.target.value) || 0)}
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  {/* Colors/Threads */}
                  <div>
                    <Label htmlFor={`colors-${index}`} className="text-sm font-medium">Colors or Threads</Label>
                    <Input
                      id={`colors-${index}`}
                      value={imprint.colorsOrThreads}
                      onChange={(e) => handleImprintChange(index, "colorsOrThreads", e.target.value)}
                      placeholder="e.g., Black, White, Navy Blue | Thread colors: 5563, 5606"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor={`notes-${index}`} className="text-sm font-medium">Notes</Label>
                    <Textarea 
                      id={`notes-${index}`}
                      value={imprint.notes}
                      onChange={(e) => handleImprintChange(index, "notes", e.target.value)}
                      placeholder="Additional details, special instructions..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    {/* Customer Art Upload */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Upload 1: Customer Provided Art</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleUploadClick(index, 'customerArt')}
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                        </Button>
                      </div>
                      {methodConfig && (
                        <p className="text-xs text-muted-foreground mb-2">
                          Accepted: {methodConfig.customerArtTypes.join(', ')}
                        </p>
                      )}
                      {imprint.customerArt && imprint.customerArt.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {imprint.customerArt?.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="flex items-center gap-2 bg-muted rounded p-2 pr-8">
                                <FileText className="h-4 w-4" />
                                <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(index, 'customerArt', file.id)}
                                className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Production Files Upload */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Upload 2: Production-Ready Files</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleUploadClick(index, 'productionFiles')}
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                        </Button>
                      </div>
                      {methodConfig && (
                        <p className="text-xs text-muted-foreground mb-2">
                          Accepted: {methodConfig.productionFileTypes.join(', ')}
                        </p>
                      )}
                      {imprint.productionFiles && imprint.productionFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {imprint.productionFiles?.map((file) => (
                            <div key={file.id} className="relative group">
                              <div className="flex items-center gap-2 bg-muted rounded p-2 pr-8">
                                <FileText className="h-4 w-4" />
                                <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(index, 'productionFiles', file.id)}
                                className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Proof/Mockup Upload */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Optional: Proof/Mockup</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleUploadClick(index, 'proofMockup')}
                        >
                          <ImageIcon className="h-4 w-4" />
                          <span>Upload</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Visual proof, mockup, or reference images
                      </p>
                      {imprint.proofMockup && imprint.proofMockup.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {imprint.proofMockup?.map((file) => (
                            <div key={file.id} className="relative w-16 h-16 border rounded-md overflow-hidden group">
                              {file.type.startsWith('image/') ? (
                                <img 
                                  src={file.url} 
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <FileText className="h-6 w-6" />
                                </div>
                              )}
                              <button
                                onClick={() => handleRemoveFile(index, 'proofMockup', file.id)}
                                className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>

          <div className="flex justify-center border-t border-gray-200 pt-4 mt-2">
            <Button type="button" variant="ghost" onClick={addNewImprint} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Imprint
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Discard</Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>Save Imprint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EnhancedMockupUploadDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUploadComplete}
        allowedFileTypes={
          currentImprintIndex !== null && imprints[currentImprintIndex] ? 
            (currentUploadCategory === 'customerArt' ? 
              getMethodConfig(imprints[currentImprintIndex].method)?.customerArtTypes || [] :
              currentUploadCategory === 'productionFiles' ?
                getMethodConfig(imprints[currentImprintIndex].method)?.productionFileTypes || [] :
                []
            ) : []
        }
        category={currentUploadCategory}
        multiple={currentUploadCategory === 'productionFiles'}
      />
    </>
  );
}
