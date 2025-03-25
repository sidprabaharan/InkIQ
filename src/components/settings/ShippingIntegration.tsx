
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Truck, Package, Check, AlertTriangle } from 'lucide-react';

export function ShippingIntegration() {
  const { toast } = useToast();
  const [upsConnected, setUpsConnected] = useState(false);
  const [fedexConnected, setFedexConnected] = useState(false);
  const [uspsConnected, setUspsConnected] = useState(false);
  
  const [upsCredentials, setUpsCredentials] = useState({
    accessKey: '',
    username: '',
    password: '',
    accountNumber: ''
  });
  
  const [fedexCredentials, setFedexCredentials] = useState({
    apiKey: '',
    password: '',
    accountNumber: '',
    meterNumber: ''
  });
  
  const [uspsCredentials, setUspsCredentials] = useState({
    username: '',
    apiKey: ''
  });
  
  const [isTestMode, setIsTestMode] = useState(true);

  const handleConnectUPS = () => {
    if (!upsCredentials.accessKey || !upsCredentials.username || !upsCredentials.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All UPS credential fields are required",
      });
      return;
    }
    
    setUpsConnected(true);
    toast({
      title: "UPS Connected",
      description: "Your UPS shipping account has been successfully connected.",
    });
  };
  
  const handleConnectFedEx = () => {
    if (!fedexCredentials.apiKey || !fedexCredentials.password || !fedexCredentials.accountNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All FedEx credential fields are required",
      });
      return;
    }
    
    setFedexConnected(true);
    toast({
      title: "FedEx Connected",
      description: "Your FedEx shipping account has been successfully connected.",
    });
  };
  
  const handleConnectUSPS = () => {
    if (!uspsCredentials.username || !uspsCredentials.apiKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All USPS credential fields are required",
      });
      return;
    }
    
    setUspsConnected(true);
    toast({
      title: "USPS Connected",
      description: "Your USPS shipping account has been successfully connected.",
    });
  };
  
  const handleDisconnectUPS = () => {
    setUpsConnected(false);
    setUpsCredentials({
      accessKey: '',
      username: '',
      password: '',
      accountNumber: ''
    });
    toast({
      title: "UPS Disconnected",
      description: "Your UPS shipping account has been disconnected.",
    });
  };
  
  const handleDisconnectFedEx = () => {
    setFedexConnected(false);
    setFedexCredentials({
      apiKey: '',
      password: '',
      accountNumber: '',
      meterNumber: ''
    });
    toast({
      title: "FedEx Disconnected",
      description: "Your FedEx shipping account has been disconnected.",
    });
  };
  
  const handleDisconnectUSPS = () => {
    setUspsConnected(false);
    setUspsCredentials({
      username: '',
      apiKey: ''
    });
    toast({
      title: "USPS Disconnected",
      description: "Your USPS shipping account has been disconnected.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Shipping Providers</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Connect shipping carriers to generate shipping labels and track packages
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* UPS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <rect width="24" height="24" fill="#351C15" />
                  <path d="M12 5L8 12H11V19L15 12H12V5Z" fill="#FFBE00" />
                </svg>
                UPS
              </CardTitle>
              <CardDescription>
                United Parcel Service shipping integration
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {upsConnected ? (
                <div className="flex items-center text-sm text-green-600 gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <Check size={14} />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-orange-600 gap-1 px-2 py-1 bg-orange-50 rounded-full">
                  <AlertTriangle size={14} />
                  <span>Not Connected</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!upsConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ups-access-key">Access Key</Label>
                  <Input 
                    id="ups-access-key" 
                    value={upsCredentials.accessKey}
                    onChange={(e) => setUpsCredentials({...upsCredentials, accessKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ups-username">Username</Label>
                  <Input 
                    id="ups-username" 
                    value={upsCredentials.username}
                    onChange={(e) => setUpsCredentials({...upsCredentials, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ups-password">Password</Label>
                  <Input
                    id="ups-password"
                    type="password"
                    value={upsCredentials.password}
                    onChange={(e) => setUpsCredentials({...upsCredentials, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ups-account">Account Number</Label>
                  <Input 
                    id="ups-account" 
                    value={upsCredentials.accountNumber}
                    onChange={(e) => setUpsCredentials({...upsCredentials, accountNumber: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="ups-test-mode" 
                    checked={isTestMode}
                    onCheckedChange={setIsTestMode}
                  />
                  <Label htmlFor="ups-test-mode">Test Mode</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Mode</p>
                    <p className="text-sm text-muted-foreground">{isTestMode ? 'Test Mode' : 'Live Mode'}</p>
                  </div>
                  <Switch 
                    id="ups-test-mode-connected" 
                    checked={isTestMode}
                    onCheckedChange={setIsTestMode}
                  />
                </div>
                <div>
                  <p className="font-medium">Account</p>
                  <p className="text-sm text-muted-foreground">
                    UPS Account: {upsCredentials.accountNumber ? 
                      `${upsCredentials.accountNumber.substring(0, 4)}...${upsCredentials.accountNumber.substring(upsCredentials.accountNumber.length - 4)}` : 
                      'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">{upsCredentials.username}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!upsConnected ? (
              <Button onClick={handleConnectUPS} className="w-full gap-2">
                <Truck className="h-4 w-4" />
                Connect UPS
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDisconnectUPS} className="w-full">
                Disconnect UPS
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* FedEx */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <rect width="24" height="24" fill="#4D148C" />
                  <path d="M2 6H10V9H6V12H10V15H2V6Z" fill="#FF6600" />
                  <path d="M12 6H22V9H16V12H20V15H12V6Z" fill="#FF6600" />
                </svg>
                FedEx
              </CardTitle>
              <CardDescription>
                Federal Express shipping integration
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {fedexConnected ? (
                <div className="flex items-center text-sm text-green-600 gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <Check size={14} />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-orange-600 gap-1 px-2 py-1 bg-orange-50 rounded-full">
                  <AlertTriangle size={14} />
                  <span>Not Connected</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!fedexConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fedex-api-key">API Key</Label>
                  <Input 
                    id="fedex-api-key" 
                    value={fedexCredentials.apiKey}
                    onChange={(e) => setFedexCredentials({...fedexCredentials, apiKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fedex-password">Password</Label>
                  <Input
                    id="fedex-password"
                    type="password"
                    value={fedexCredentials.password}
                    onChange={(e) => setFedexCredentials({...fedexCredentials, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fedex-account">Account Number</Label>
                  <Input 
                    id="fedex-account" 
                    value={fedexCredentials.accountNumber}
                    onChange={(e) => setFedexCredentials({...fedexCredentials, accountNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fedex-meter">Meter Number</Label>
                  <Input 
                    id="fedex-meter" 
                    value={fedexCredentials.meterNumber}
                    onChange={(e) => setFedexCredentials({...fedexCredentials, meterNumber: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Account</p>
                  <p className="text-sm text-muted-foreground">
                    FedEx Account: {fedexCredentials.accountNumber ? 
                      `${fedexCredentials.accountNumber.substring(0, 4)}...${fedexCredentials.accountNumber.substring(fedexCredentials.accountNumber.length - 4)}` : 
                      'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Meter Number</p>
                  <p className="text-sm text-muted-foreground">
                    {fedexCredentials.meterNumber}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!fedexConnected ? (
              <Button onClick={handleConnectFedEx} className="w-full gap-2">
                <Package className="h-4 w-4" />
                Connect FedEx
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDisconnectFedEx} className="w-full">
                Disconnect FedEx
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* USPS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <rect width="24" height="24" fill="#004B87" />
                  <path d="M3 6H21V18H3V6Z" fill="#fff" />
                  <path d="M5 8L19 8V16H5V8Z" fill="#DA291C" />
                </svg>
                USPS
              </CardTitle>
              <CardDescription>
                US Postal Service shipping integration
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {uspsConnected ? (
                <div className="flex items-center text-sm text-green-600 gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <Check size={14} />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-orange-600 gap-1 px-2 py-1 bg-orange-50 rounded-full">
                  <AlertTriangle size={14} />
                  <span>Not Connected</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!uspsConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usps-username">Web Tools Username</Label>
                  <Input 
                    id="usps-username" 
                    value={uspsCredentials.username}
                    onChange={(e) => setUspsCredentials({...uspsCredentials, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usps-api-key">API Key</Label>
                  <Input 
                    id="usps-api-key" 
                    value={uspsCredentials.apiKey}
                    onChange={(e) => setUspsCredentials({...uspsCredentials, apiKey: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Web Tools Username</p>
                  <p className="text-sm text-muted-foreground">
                    {uspsCredentials.username}
                  </p>
                </div>
                <div>
                  <p className="font-medium">API Key</p>
                  <p className="text-sm text-muted-foreground">
                    {uspsCredentials.apiKey ? 
                      `${uspsCredentials.apiKey.substring(0, 4)}...${uspsCredentials.apiKey.substring(uspsCredentials.apiKey.length - 4)}` : 
                      'Not provided'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!uspsConnected ? (
              <Button onClick={handleConnectUSPS} className="w-full gap-2">
                <Truck className="h-4 w-4" />
                Connect USPS
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDisconnectUSPS} className="w-full">
                Disconnect USPS
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
