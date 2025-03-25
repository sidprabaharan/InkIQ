
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, Check, RefreshCw, ArrowRight, LogIn } from 'lucide-react';

export function QuickbooksIntegration() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncSettings, setSyncSettings] = useState({
    customers: true,
    invoices: true,
    payments: true,
    expenses: true,
    products: false
  });
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setLastSyncDate(new Date().toISOString());
      toast({
        title: "QuickBooks Connected",
        description: "Your QuickBooks account has been successfully connected.",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setLastSyncDate(null);
    toast({
      title: "QuickBooks Disconnected",
      description: "Your QuickBooks account has been disconnected.",
    });
  };

  const handleSyncNow = () => {
    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      setLastSyncDate(new Date().toISOString());
      toast({
        title: "Sync Complete",
        description: "Your data has been synced with QuickBooks.",
      });
    }, 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">QuickBooks Integration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Connect to QuickBooks to sync your financial data
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            QuickBooks Online
          </CardTitle>
          <CardDescription>
            Sync your customers, invoices, and payments with QuickBooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="bg-cyan-50 p-4 rounded-full">
                <FileSpreadsheet className="h-12 w-12 text-cyan-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Connect to QuickBooks</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Link your QuickBooks account to sync your financial data
                </p>
              </div>
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="mt-4 gap-2"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Connect QuickBooks
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-100 p-4 rounded-md flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">QuickBooks Connected</p>
                  <p className="text-sm text-green-700">Your QuickBooks account is connected and syncing</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Sync</p>
                  <p className="text-sm text-muted-foreground">Sync data automatically daily</p>
                </div>
                <Switch 
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>
              
              <div>
                <p className="font-medium">Last Synced</p>
                <p className="text-sm text-muted-foreground">{formatDate(lastSyncDate)}</p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleSyncNow}
                disabled={isConnecting}
                className="w-full gap-2"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
        {isConnected && (
          <CardFooter className="flex flex-col">
            <Button variant="destructive" onClick={handleDisconnect} className="w-full">
              Disconnect QuickBooks
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
            <CardDescription>
              Choose what information to sync with QuickBooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Customers</p>
                    <p className="text-sm text-muted-foreground">Sync customer data to QuickBooks</p>
                  </div>
                </div>
                <Switch 
                  checked={syncSettings.customers}
                  onCheckedChange={(checked) => setSyncSettings({...syncSettings, customers: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Invoices</p>
                    <p className="text-sm text-muted-foreground">Sync invoices to QuickBooks</p>
                  </div>
                </div>
                <Switch 
                  checked={syncSettings.invoices}
                  onCheckedChange={(checked) => setSyncSettings({...syncSettings, invoices: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Payments</p>
                    <p className="text-sm text-muted-foreground">Sync payment records to QuickBooks</p>
                  </div>
                </div>
                <Switch 
                  checked={syncSettings.payments}
                  onCheckedChange={(checked) => setSyncSettings({...syncSettings, payments: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Expenses</p>
                    <p className="text-sm text-muted-foreground">Sync expenses to QuickBooks</p>
                  </div>
                </div>
                <Switch 
                  checked={syncSettings.expenses}
                  onCheckedChange={(checked) => setSyncSettings({...syncSettings, expenses: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Products</p>
                    <p className="text-sm text-muted-foreground">Sync product catalog to QuickBooks</p>
                  </div>
                </div>
                <Switch 
                  checked={syncSettings.products}
                  onCheckedChange={(checked) => setSyncSettings({...syncSettings, products: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
