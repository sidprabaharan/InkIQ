import React, { useState, useMemo } from 'react';
import { Search, Upload, Filter, Grid, List, FolderOpen, FileImage, Download, Eye, MoreVertical, Calendar, User, Tag, Layers, Folder } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockArtworkLibrary, CustomerArtworkLibrary, MasterArtwork, ArtworkFile, ArtworkFolder } from '@/types/artwork';
import { IMPRINT_METHODS } from '@/types/imprint';

export default function ArtworkFiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedArtwork, setSelectedArtwork] = useState<MasterArtwork | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<ArtworkFolder | null>(null);
  const [folderViewOpen, setFolderViewOpen] = useState(false);

  // Get unique customers for filter
  const customers = useMemo(() => {
    const uniqueCustomers = mockArtworkLibrary.map(lib => ({
      id: lib.customerId,
      name: lib.customerName
    }));
    return uniqueCustomers;
  }, []);

  // Get folders organized by method
  const methodFolders = useMemo(() => {
    const folders: ArtworkFolder[] = [];
    
    mockArtworkLibrary.forEach(library => {
      library.folders.forEach(folder => {
        // Apply customer filter
        if (selectedCustomer === 'all' || library.customerId === selectedCustomer) {
          // Apply method filter
          if (selectedMethod === 'all' || folder.method === selectedMethod) {
            // Apply search filter
            if (!searchTerm || 
                folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                library.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                folder.artworks.some(art => 
                  art.designName.toLowerCase().includes(searchTerm.toLowerCase())
                )) {
              folders.push({
                ...folder,
                artworks: folder.artworks.filter(art => {
                  if (searchTerm) {
                    return art.designName.toLowerCase().includes(searchTerm.toLowerCase());
                  }
                  return true;
                })
              });
            }
          }
        }
      });
    });
    
    return folders;
  }, [searchTerm, selectedCustomer, selectedMethod]);

  // Filter artwork (for when viewing folder contents)
  const filteredArtwork = useMemo(() => {
    if (!selectedFolder) return [];
    return selectedFolder.artworks;
  }, [selectedFolder]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handlePreviewArtwork = (artwork: MasterArtwork) => {
    setSelectedArtwork(artwork);
    setPreviewDialogOpen(true);
  };

  const handleFolderClick = (folder: ArtworkFolder) => {
    setSelectedFolder(folder);
    setFolderViewOpen(true);
  };

  const getTotalStats = () => {
    const totalFolders = mockArtworkLibrary.reduce((sum, lib) => sum + lib.folders.length, 0);
    const totalArtwork = mockArtworkLibrary.reduce((sum, lib) => sum + lib.artworkCount, 0);
    const totalSize = mockArtworkLibrary.reduce((sum, lib) => sum + lib.totalSizeBytes, 0);
    const totalCustomers = mockArtworkLibrary.length;
    
    return { totalFolders, totalArtwork, totalSize, totalCustomers };
  };

  const stats = getTotalStats();

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artwork Files</h1>
          <p className="text-muted-foreground">
            Manage customer artwork, production files, and mockups
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Artwork
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artwork</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArtwork}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.totalCustomers} customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              Production files & mockups
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              With artwork on file
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search artwork by name or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {IMPRINT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {!folderViewOpen ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {methodFolders.length} folder{methodFolders.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Folder View */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {methodFolders.map((folder) => {
                const customer = mockArtworkLibrary.find(lib => 
                  lib.folders.some(f => f.id === folder.id)
                );
                return (
                  <Card 
                    key={folder.id} 
                    className="group cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleFolderClick(folder)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-muted rounded-lg">
                            <Folder className="h-8 w-8 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg truncate">{folder.name}</CardTitle>
                            <CardDescription className="truncate">{customer?.customerName}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Files
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download All
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {IMPRINT_METHODS.find(m => m.value === folder.method)?.label || folder.method}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="text-center">
                          <div className="font-medium">{folder.artworkCount}</div>
                          <div>Artwork{folder.artworkCount !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{formatFileSize(folder.totalSizeBytes)}</div>
                          <div>Size</div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <div>Last updated: {formatDate(folder.lastUpdatedAt)}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFolderViewOpen(false)}
                  className="gap-2"
                >
                  <Folder className="h-4 w-4" />
                  Back to Folders
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{selectedFolder?.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredArtwork.length} artwork file{filteredArtwork.length !== 1 ? 's' : ''} in folder
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredArtwork.map((artwork) => (
                  <Card key={artwork.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{artwork.designName}</CardTitle>
                          <CardDescription className="truncate">{artwork.customerName}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreviewArtwork(artwork)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `/imprint/${artwork.id}`}>
                              <FileImage className="h-4 w-4 mr-2" />
                              View Imprint Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Image Preview */}
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {artwork.customerArt.length > 0 ? (
                          <img 
                            src={artwork.customerArt[0].url} 
                            alt={artwork.designName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`flex flex-col items-center text-muted-foreground ${artwork.customerArt.length > 0 ? 'hidden' : ''}`}>
                          <FileImage className="h-8 w-8 mb-2" />
                          <span className="text-xs">No Preview</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {IMPRINT_METHODS.find(m => m.value === artwork.method)?.label || artwork.method}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {artwork.size.width}" × {artwork.size.height}"
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="text-center">
                          <div className="font-medium">{artwork.customerArt.length}</div>
                          <div>Customer</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{artwork.productionFiles.length}</div>
                          <div>Production</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{artwork.mockups.length}</div>
                          <div>Mockups</div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Last used: {artwork.lastUsedAt ? formatDate(artwork.lastUsedAt) : 'Never'}</div>
                        <div>Used {artwork.usageCount} times</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredArtwork.map((artwork) => (
                      <div key={artwork.id} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                        {/* Image Preview */}
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {artwork.customerArt.length > 0 ? (
                            <img 
                              src={artwork.customerArt[0].url} 
                              alt={artwork.designName}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`flex flex-col items-center text-muted-foreground text-xs ${artwork.customerArt.length > 0 ? 'hidden' : ''}`}>
                            <FileImage className="h-6 w-6" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{artwork.designName}</h3>
                            <Badge variant="secondary">
                              {IMPRINT_METHODS.find(m => m.value === artwork.method)?.label || artwork.method}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{artwork.customerName}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{artwork.size.width}" × {artwork.size.height}"</span>
                            <span>{artwork.fileCount} files</span>
                            <span>{formatFileSize(artwork.totalSizeBytes)}</span>
                            <span>Used {artwork.usageCount} times</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handlePreviewArtwork(artwork)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download All
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedArtwork?.designName}</DialogTitle>
          </DialogHeader>
          {selectedArtwork && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Customer:</span> {selectedArtwork.customerName}
                </div>
                <div>
                  <span className="font-medium">Method:</span>{' '}
                  {IMPRINT_METHODS.find(m => m.value === selectedArtwork.method)?.label || selectedArtwork.method}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {selectedArtwork.size.width}" × {selectedArtwork.size.height}"
                </div>
                <div>
                  <span className="font-medium">Files:</span> {selectedArtwork.fileCount}
                </div>
              </div>
              
              {selectedArtwork.description && (
                <div>
                  <span className="font-medium">Description:</span> {selectedArtwork.description}
                </div>
              )}

              <Tabs defaultValue="customer-art" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="customer-art">Customer Art ({selectedArtwork.customerArt.length})</TabsTrigger>
                  <TabsTrigger value="production">Production ({selectedArtwork.productionFiles.length})</TabsTrigger>
                  <TabsTrigger value="mockups">Mockups ({selectedArtwork.mockups.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="customer-art" className="space-y-2">
                  <ScrollArea className="h-[200px]">
                    {selectedArtwork.customerArt.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(file.sizeBytes)} • {formatDate(file.uploadedAt)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="production" className="space-y-2">
                  <ScrollArea className="h-[200px]">
                    {selectedArtwork.productionFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(file.sizeBytes)} • {formatDate(file.uploadedAt)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="mockups" className="space-y-2">
                  <ScrollArea className="h-[200px]">
                    {selectedArtwork.mockups.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(file.sizeBytes)} • {formatDate(file.uploadedAt)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}