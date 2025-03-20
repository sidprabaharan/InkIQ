
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MockupUploadDialog } from "./MockupUploadDialog";
import { toast } from "sonner";

export interface ImprintItem {
  id: string;
  matrix: string;
  column: string;
  typeOfWork: string;
  details: string;
  mockups: ImprintMockup[];
}

interface ImprintMockup {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface ImprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (imprints: ImprintItem[]) => void;
  initialImprints?: ImprintItem[];
}

export function ImprintDialog({ open, onOpenChange, onSave, initialImprints = [] }: ImprintDialogProps) {
  const [imprints, setImprints] = useState<ImprintItem[]>(initialImprints.length > 0 ? 
    initialImprints : 
    [{
      id: `imprint-${Math.random().toString(36).substring(2, 9)}`,
      matrix: "",
      column: "",
      typeOfWork: "",
      details: "",
      mockups: []
    }]
  );

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentImprintIndex, setCurrentImprintIndex] = useState<number | null>(null);

  const addNewImprint = () => {
    setImprints([...imprints, {
      id: `imprint-${Math.random().toString(36).substring(2, 9)}`,
      matrix: "",
      column: "",
      typeOfWork: "",
      details: "",
      mockups: []
    }]);
  };

  const handleImprintChange = (index: number, field: string, value: string) => {
    const updatedImprints = [...imprints];
    updatedImprints[index] = {
      ...updatedImprints[index],
      [field]: value
    };
    setImprints(updatedImprints);
  };

  const handleAttachMockup = (index: number) => {
    setCurrentImprintIndex(index);
    setUploadDialogOpen(true);
  };

  const handleUploadComplete = (files: File[]) => {
    if (files.length > 0 && currentImprintIndex !== null) {
      const newMockups = files.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      
      setImprints(prevImprints => {
        const updatedImprints = [...prevImprints];
        updatedImprints[currentImprintIndex] = {
          ...updatedImprints[currentImprintIndex],
          mockups: [...updatedImprints[currentImprintIndex].mockups, ...newMockups]
        };
        return updatedImprints;
      });

      toast.success(`${files.length} mockup${files.length > 1 ? 's' : ''} attached successfully`);
    }
  };

  const handleSave = () => {
    onSave(imprints);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Imprint</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            {imprints.map((imprint, index) => (
              <div key={imprint.id} className="space-y-4 pb-6 border-b border-gray-200 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`matrix-${index}`} className="block text-sm font-medium mb-1">Matrix</label>
                    <Select 
                      value={imprint.matrix} 
                      onValueChange={(value) => handleImprintChange(index, "matrix", value)}
                    >
                      <SelectTrigger id={`matrix-${index}`} className="w-full">
                        <SelectValue placeholder="Select Matrix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matrix1">Matrix 1</SelectItem>
                        <SelectItem value="matrix2">Matrix 2</SelectItem>
                        <SelectItem value="matrix3">Matrix 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor={`column-${index}`} className="block text-sm font-medium mb-1">Column</label>
                    <Select 
                      value={imprint.column} 
                      onValueChange={(value) => handleImprintChange(index, "column", value)}
                    >
                      <SelectTrigger id={`column-${index}`} className="w-full">
                        <SelectValue placeholder="Select Column" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="column1">Column 1</SelectItem>
                        <SelectItem value="column2">Column 2</SelectItem>
                        <SelectItem value="column3">Column 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor={`type-of-work-${index}`} className="block text-sm font-medium mb-1">Type of Work</label>
                  <Select 
                    value={imprint.typeOfWork} 
                    onValueChange={(value) => handleImprintChange(index, "typeOfWork", value)}
                  >
                    <SelectTrigger id={`type-of-work-${index}`} className="w-full">
                      <SelectValue placeholder="Select Type of Work" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screenPrinting">Screen Printing</SelectItem>
                      <SelectItem value="embroidery">Embroidery</SelectItem>
                      <SelectItem value="dtg">Direct to Garment</SelectItem>
                      <SelectItem value="sublimation">Sublimation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor={`details-${index}`} className="block text-sm font-medium mb-1">Details</label>
                  <Textarea 
                    id={`details-${index}`}
                    value={imprint.details}
                    onChange={(e) => handleImprintChange(index, "details", e.target.value)}
                    placeholder="Write imprint Details here"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Mockup</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleAttachMockup(index)}
                    >
                      <Image className="h-4 w-4" />
                      <span>Add</span>
                    </Button>
                  </div>
                  {imprint.mockups.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {imprint.mockups.map((mockup) => (
                        <div key={mockup.id} className="relative w-16 h-16 border rounded-md overflow-hidden">
                          <img 
                            src={mockup.url} 
                            alt={mockup.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
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

      <MockupUploadDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUploadComplete}
      />
    </>
  );
}
