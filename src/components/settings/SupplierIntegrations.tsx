
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, RefreshCw, ExternalLink, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for suppliers
const suppliersList = [
  { id: 1, name: 'SanMar', connected: true, productCount: 5420, lastSync: '2 hrs ago' },
  { id: 2, name: 'Alphabroder', connected: true, productCount: 4832, lastSync: '3 hrs ago' },
  { id: 3, name: 'S&S Activewear', connected: false, productCount: 0, lastSync: 'Never' },
  { id: 4, name: 'TSC Apparel', connected: false, productCount: 0, lastSync: 'Never' },
  { id: 5, name: 'Bodek and Rhodes', connected: false, productCount: 0, lastSync: 'Never' },
  { id: 6, name: 'Augusta Sportswear', connected: false, productCount: 0, lastSync: 'Never' },
  { id: 7, name: 'Bella+Canvas', connected: false, productCount: 0, lastSync: 'Never' },
];

export function SupplierIntegrations() {
  const [suppliers, setSuppliers] = useState(suppliersList);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', apiKey: '', username: '', password: '' });
  const [currentSupplier, setCurrentSupplier] = useState<any>(null);
  const { toast } = useToast();

  const handleToggleSupplier = (id: number) => {
    setSuppliers(suppliers.map(supplier => {
      if (supplier.id === id) {
        const newState = !supplier.connected;
        // If connecting a previously disconnected supplier
        if (newState && supplier.productCount === 0) {
          return { ...supplier, connected: newState, productCount: Math.floor(Math.random() * 5000) + 1000, lastSync: 'Just now' };
        }
        return { ...supplier, connected: newState };
      }
      return supplier;
    }));

    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      toast({
        title: supplier.connected ? "Supplier Disconnected" : "Supplier Connected",
        description: `${supplier.name} has been ${supplier.connected ? "disconnected" : "connected"} successfully.`,
      });
    }
  };

  const handleSyncSupplier = (id: number) => {
    setSuppliers(suppliers.map(supplier => {
      if (supplier.id === id && supplier.connected) {
        // Random number of new products for demo purposes
        const newProducts = Math.floor(Math.random() * 100) + 1;
        return { 
          ...supplier, 
          productCount: supplier.productCount + newProducts,
          lastSync: 'Just now'
        };
      }
      return supplier;
    }));

    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      toast({
        title: "Products Synchronized",
        description: `${supplier.name}'s products have been updated successfully.`,
      });
    }
  };

  const handleConnectSupplier = () => {
    if (!newSupplier.name || (!newSupplier.apiKey && (!newSupplier.username || !newSupplier.password))) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide all required connection details.",
      });
      return;
    }

    const id = Math.max(0, ...suppliers.map(s => s.id)) + 1;
    const newSupplierEntry = {
      id,
      name: newSupplier.name,
      connected: true,
      productCount: Math.floor(Math.random() * 3000) + 500, // Random initial product count
      lastSync: 'Just now'
    };

    setSuppliers([...suppliers, newSupplierEntry]);
    setNewSupplier({ name: '', apiKey: '', username: '', password: '' });
    setIsConnectOpen(false);
    
    toast({
      title: "Supplier Added",
      description: `${newSupplier.name} has been connected successfully.`,
    });
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openSupplierDetails = (supplier: any) => {
    setCurrentSupplier(supplier);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Supplier Integrations</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with your suppliers to import products directly into InkIQ
          </p>
        </div>
        <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect to Supplier</DialogTitle>
              <DialogDescription>
                Enter your supplier's connection details to import their products.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier-name" className="text-right">Supplier Name</Label>
                <Input
                  id="supplier-name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  className="col-span-3"
                  placeholder="e.g., SanMar, Alphabroder"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api-key" className="text-right">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={newSupplier.apiKey}
                  onChange={(e) => setNewSupplier({...newSupplier, apiKey: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter API key (if available)"
                />
              </div>
              <div className="border-t my-2 pt-2">
                <p className="text-sm text-muted-foreground mb-2">Or connect using credentials:</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input
                  id="username"
                  value={newSupplier.username}
                  onChange={(e) => setNewSupplier({...newSupplier, username: e.target.value})}
                  className="col-span-3"
                  placeholder="Your supplier account username"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newSupplier.password}
                  onChange={(e) => setNewSupplier({...newSupplier, password: e.target.value})}
                  className="col-span-3"
                  placeholder="Your supplier account password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConnectOpen(false)}>Cancel</Button>
              <Button onClick={handleConnectSupplier}>Connect Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search suppliers..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-base">Available Suppliers</CardTitle>
          <CardDescription>
            Toggle to enable or disable product imports from each supplier
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium px-6">{supplier.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={supplier.connected} 
                        onCheckedChange={() => handleToggleSupplier(supplier.id)}
                      />
                      <span className={supplier.connected ? "text-green-600" : "text-muted-foreground"}>
                        {supplier.connected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {supplier.connected ? (
                      <Badge variant="outline" className="font-mono">
                        {supplier.productCount.toLocaleString()}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{supplier.lastSync}</TableCell>
                  <TableCell className="text-right space-x-2 px-6">
                    {supplier.connected && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSyncSupplier(supplier.id)}
                          className="h-8 gap-1"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Sync
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSupplierDetails(supplier)}
                          className="h-8 gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Details
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No suppliers found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {currentSupplier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentSupplier.name}
              {currentSupplier.connected && <Check size={16} className="text-green-500" />}
            </CardTitle>
            <CardDescription>
              {currentSupplier.connected 
                ? `Connected with ${currentSupplier.productCount.toLocaleString()} products`
                : "Not connected"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Connection Details</h4>
              <div className="text-sm space-y-1">
                <p>API Version: v2.0</p>
                <p>Connection Method: Rest API</p>
                <p>Last Sync: {currentSupplier.lastSync}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Pricing Settings</h4>
              <div className="flex gap-2 items-center">
                <Switch id="include-pricing" defaultChecked />
                <Label htmlFor="include-pricing">Import price data with products</Label>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Import Settings</h4>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Switch id="import-images" defaultChecked />
                  <Label htmlFor="import-images">Import product images</Label>
                </div>
                <div className="flex gap-2 items-center">
                  <Switch id="import-inventory" defaultChecked />
                  <Label htmlFor="import-inventory">Import inventory levels</Label>
                </div>
                <div className="flex gap-2 items-center">
                  <Switch id="auto-sync" defaultChecked />
                  <Label htmlFor="auto-sync">Enable daily auto-sync</Label>
                </div>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button variant="outline" className="mr-2">Reset Connection</Button>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How Product Import Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">1. Connect Your Suppliers</h4>
              <p className="text-sm text-muted-foreground">Enable the suppliers you work with to import their product catalogs</p>
            </div>
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">2. View Combined Catalog</h4>
              <p className="text-sm text-muted-foreground">Browse all supplier products in one place with pricing information</p>
            </div>
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">3. Compare Prices</h4>
              <p className="text-sm text-muted-foreground">Easily see which supplier offers the best price for the same product</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
            <p className="font-medium mb-1">Note: Product Data Synchronization</p>
            <p>
              Products are synchronized once per day automatically. You can manually sync at any time 
              by clicking the "Sync" button next to a supplier. Updates include pricing, inventory, 
              and any new products.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
