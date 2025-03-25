
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, Upload, FileSpreadsheet, Database, 
  RefreshCw, DownloadCloud, UploadCloud, CheckCircle2
} from 'lucide-react';

export function DataManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('import');
  const [importType, setImportType] = useState('customers');
  const [exportType, setExportType] = useState('all');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleImport = () => {
    setIsImporting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Import Complete",
        description: `Successfully imported ${importType} data.`,
      });
    }, 1500);
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Complete",
        description: `Successfully exported ${exportType} data.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data Import & Export</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Import or export data to and from InkIQ
        </p>
      </div>
      
      <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Import customer, product, or other data into InkIQ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">What would you like to import?</label>
                  <Select 
                    value={importType} 
                    onValueChange={setImportType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customers">Customer Data</SelectItem>
                      <SelectItem value="products">Product Catalog</SelectItem>
                      <SelectItem value="quotes">Quotes & Orders</SelectItem>
                      <SelectItem value="vendors">Vendors & Suppliers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-4">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      CSV, Excel, or JSON files supported
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".csv,.xlsx,.xls,.json"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Select File
                  </Button>
                </div>
                
                <div className="flex flex-col gap-2 items-center">
                  <Button 
                    onClick={handleImport}
                    disabled={isImporting}
                    className="w-full gap-2"
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Begin Import
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    Need help? <a href="#" className="text-primary underline">View import guide</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export your data for use in other applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">What would you like to export?</label>
                  <Select 
                    value={exportType} 
                    onValueChange={setExportType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Data</SelectItem>
                      <SelectItem value="customers">Customer Data</SelectItem>
                      <SelectItem value="products">Product Catalog</SelectItem>
                      <SelectItem value="quotes">Quotes & Orders</SelectItem>
                      <SelectItem value="financial">Financial Reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="gap-2 justify-center">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button variant="outline" className="gap-2 justify-center">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </Button>
                    <Button variant="outline" className="gap-2 justify-center">
                      <Database className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 items-center">
                  <Button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full gap-2"
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Preparing Export...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export Data
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    Exports are encrypted and compliant with data protection regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Backup</CardTitle>
          <CardDescription>
            Schedule regular backups of your InkIQ data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <p className="font-medium">Automatic Backups</p>
                <p className="text-sm text-muted-foreground">Weekly backups on Sunday</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Enabled
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground">May 15, 2023 at 2:30 AM</p>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <DownloadCloud className="h-4 w-4" />
                Download
              </Button>
            </div>
            
            <Button className="w-full mt-2">Create Manual Backup</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
