import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useArtworkFiles, type ArtworkFile } from "@/hooks/useArtworkFiles";
import { Upload, X, FileImage, FileText, Loader2 } from 'lucide-react';

interface ImprintUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteItemId: string;
  onUploadComplete?: (files: ArtworkFile[]) => void;
}

interface UploadSection {
  category: 'customer_art' | 'production_files' | 'proof_mockup';
  title: string;
  description: string;
  files: File[];
}

export function ImprintUploadDialog({ 
  open, 
  onOpenChange, 
  quoteItemId,
  onUploadComplete 
}: ImprintUploadDialogProps) {
  const { toast } = useToast();
  const { uploadArtworkFile, uploading, uploadProgress } = useArtworkFiles();
  
  const [colorsOrThreads, setColorsOrThreads] = useState('');
  const [notes, setNotes] = useState('');
  const [imprintMethod, setImprintMethod] = useState('');
  const [imprintLocation, setImprintLocation] = useState('');
  const [imprintSize, setImprintSize] = useState('');
  
  const [uploadSections, setUploadSections] = useState<UploadSection[]>([
    {
      category: 'customer_art',
      title: 'Upload 1: Customer Provided Art',
      description: 'Original artwork files provided by customer',
      files: []
    },
    {
      category: 'production_files',
      title: 'Upload 2: Production-Ready Files',
      description: 'Print-ready files for production',
      files: []
    },
    {
      category: 'proof_mockup',
      title: 'Optional: Proof/Mockup',
      description: 'Visual proof, mockup, or reference images',
      files: []
    }
  ]);

  const fileInputRefs = {
    customer_art: useRef<HTMLInputElement>(null),
    production_files: useRef<HTMLInputElement>(null),
    proof_mockup: useRef<HTMLInputElement>(null)
  };

  const handleFileSelect = (category: 'customer_art' | 'production_files' | 'proof_mockup', files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadSections(prev => prev.map(section => 
      section.category === category 
        ? { ...section, files: [...section.files, ...newFiles] }
        : section
    ));
  };

  const removeFile = (category: 'customer_art' | 'production_files' | 'proof_mockup', fileIndex: number) => {
    setUploadSections(prev => prev.map(section =>
      section.category === category
        ? { ...section, files: section.files.filter((_, index) => index !== fileIndex) }
        : section
    ));
  };

  const triggerFileInput = (category: 'customer_art' | 'production_files' | 'proof_mockup') => {
    fileInputRefs[category].current?.click();
  };

  const handleSaveImprint = async () => {
    try {
      // Validate that we have files to upload
      const totalFiles = uploadSections.reduce((acc, section) => acc + section.files.length, 0);
      if (totalFiles === 0) {
        toast({
          title: "No files selected",
          description: "Please select at least one file to upload",
          variant: "destructive"
        });
        return;
      }

      const uploadedFiles: ArtworkFile[] = [];

      // Upload all files
      for (const section of uploadSections) {
        for (const file of section.files) {
          const result = await uploadArtworkFile({
            quoteItemId,
            file,
            category: section.category,
            imprintMethod: imprintMethod || undefined,
            imprintLocation: imprintLocation || undefined,
            imprintSize: imprintSize || undefined,
            colorsOrThreads: colorsOrThreads || undefined,
            notes: notes || undefined
          });

          if (result.success && result.file) {
            uploadedFiles.push(result.file);
          } else {
            toast({
              title: "Upload failed",
              description: `Failed to upload ${file.name}: ${result.error}`,
              variant: "destructive"
            });
            return;
          }
        }
      }

      toast({
        title: "Upload successful",
        description: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      });

      // Reset form
      setUploadSections(prev => prev.map(section => ({ ...section, files: [] })));
      setColorsOrThreads('');
      setNotes('');
      setImprintMethod('');
      setImprintLocation('');
      setImprintSize('');

      // Callback with uploaded files
      onUploadComplete?.(uploadedFiles);
      onOpenChange(false);

    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred while uploading files",
        variant: "destructive"
      });
    }
  };

  const handleDiscard = () => {
    setUploadSections(prev => prev.map(section => ({ ...section, files: [] })));
    setColorsOrThreads('');
    setNotes('');
    setImprintMethod('');
    setImprintLocation('');
    setImprintSize('');
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (file: File) => file.type.startsWith('image/');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Imprint</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imprint Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Colors or Threads</label>
              <Input
                value={colorsOrThreads}
                onChange={(e) => setColorsOrThreads(e.target.value)}
                placeholder="e.g., Black, White, Navy Blue | Thread colors: 5563, 5606"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Method</label>
                <Input
                  value={imprintMethod}
                  onChange={(e) => setImprintMethod(e.target.value)}
                  placeholder="e.g., Screen Print"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Input
                  value={imprintLocation}
                  onChange={(e) => setImprintLocation(e.target.value)}
                  placeholder="e.g., Front Center"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Size</label>
                <Input
                  value={imprintSize}
                  onChange={(e) => setImprintSize(e.target.value)}
                  placeholder="e.g., 8&quot; x 6&quot;"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional details, special instructions..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Upload Sections */}
          {uploadSections.map((section) => (
            <div key={section.category} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{section.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{section.description}</p>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRefs[section.category]}
                onChange={(e) => handleFileSelect(section.category, e.target.files)}
                multiple
                accept="image/*,.pdf,.ai,.eps,.svg"
                className="hidden"
              />

              {/* Upload area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => triggerFileInput(section.category)}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop files
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: Images, PDF, AI, EPS, SVG
                </p>
              </div>

              {/* Selected files */}
              {section.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {section.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {isImage(file) ? (
                          <FileImage className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm font-medium truncate max-w-xs">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(section.category, index);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Uploading files... {uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleDiscard}
              disabled={uploading}
            >
              Discard
            </Button>
            <Button 
              onClick={handleSaveImprint}
              disabled={uploading || uploadSections.every(section => section.files.length === 0)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Save Imprint'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
