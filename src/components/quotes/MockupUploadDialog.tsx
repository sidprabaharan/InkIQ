
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogClose, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudIcon, X, Upload, Pencil, Trash2, Plus } from "lucide-react";

interface MockupUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => void;
}

export function MockupUploadDialog({ open, onOpenChange, onUpload }: MockupUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onOpenChange(false);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload Attachment</h2>
          <DialogClose asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        {selectedFiles.length > 0 ? (
          <>
            <div className="mb-3 flex justify-between items-center">
              <h3 className="text-base font-medium">Images</h3>
              <Button 
                variant="ghost" 
                className="text-primary flex items-center gap-1 px-2 py-1 h-auto"
                onClick={() => document.getElementById('fileUpload')?.click()}
              >
                <span>Add More</span>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      ) : (
                        <Upload className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[180px]">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)} {getFileExtension(file.name)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4 text-gray-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 hover:text-red-500" 
                      onClick={() => handleRemoveFile(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mb-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <CloudIcon className="h-12 w-12 text-gray-400" />
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">Select File</p>
                  <p className="text-xs text-gray-400">Browser From computer</p>
                </div>
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                >
                  Choose Files
                </label>
                <p className="text-xs text-gray-400">or drag and drop files here</p>
              </div>
            </div>
          </div>
        )}

        <input
          type="file"
          multiple
          className="hidden"
          id="fileUpload"
          onChange={handleFileChange}
        />

        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
          >
            Upload Attachment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
