
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Check, AlertTriangle } from 'lucide-react';

export function PaymentIntegration() {
  const { toast } = useToast();
  const [stripeConnected, setStripeConnected] = useState(false);
  const [paypalConnected, setPaypalConnected] = useState(false);
  const [squareConnected, setSquareConnected] = useState(false);
  
  const [stripeTestMode, setStripeTestMode] = useState(true);
  const [paypalTestMode, setPaypalTestMode] = useState(true);
  const [squareTestMode, setSquareTestMode] = useState(true);
  
  const [stripeKeys, setStripeKeys] = useState({
    publishableKey: '',
    secretKey: ''
  });
  
  const [paypalKeys, setPaypalKeys] = useState({
    clientId: '',
    clientSecret: ''
  });
  
  const [squareKeys, setSquareKeys] = useState({
    applicationId: '',
    accessToken: ''
  });

  const handleConnectStripe = () => {
    if (!stripeKeys.publishableKey || !stripeKeys.secretKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both Stripe API keys",
      });
      return;
    }
    
    setStripeConnected(true);
    toast({
      title: "Stripe Connected",
      description: "Your Stripe account has been successfully connected.",
    });
  };
  
  const handleConnectPaypal = () => {
    if (!paypalKeys.clientId || !paypalKeys.clientSecret) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both PayPal API keys",
      });
      return;
    }
    
    setPaypalConnected(true);
    toast({
      title: "PayPal Connected",
      description: "Your PayPal account has been successfully connected.",
    });
  };
  
  const handleConnectSquare = () => {
    if (!squareKeys.applicationId || !squareKeys.accessToken) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both Square API keys",
      });
      return;
    }
    
    setSquareConnected(true);
    toast({
      title: "Square Connected",
      description: "Your Square account has been successfully connected.",
    });
  };
  
  const handleDisconnectStripe = () => {
    setStripeConnected(false);
    setStripeKeys({
      publishableKey: '',
      secretKey: ''
    });
    toast({
      title: "Stripe Disconnected",
      description: "Your Stripe account has been disconnected.",
    });
  };
  
  const handleDisconnectPaypal = () => {
    setPaypalConnected(false);
    setPaypalKeys({
      clientId: '',
      clientSecret: ''
    });
    toast({
      title: "PayPal Disconnected",
      description: "Your PayPal account has been disconnected.",
    });
  };
  
  const handleDisconnectSquare = () => {
    setSquareConnected(false);
    setSquareKeys({
      applicationId: '',
      accessToken: ''
    });
    toast({
      title: "Square Disconnected",
      description: "Your Square account has been disconnected.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Payment Providers</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Connect payment providers to accept online payments from your customers.
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* Stripe */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Stripe</CardTitle>
              <CardDescription>
                Accept credit card payments directly on your quotes and invoices
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {stripeConnected ? (
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
            {!stripeConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe-publishable">Publishable Key</Label>
                  <Input 
                    id="stripe-publishable" 
                    value={stripeKeys.publishableKey}
                    onChange={(e) => setStripeKeys({...stripeKeys, publishableKey: e.target.value})}
                    placeholder="pk_test_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Secret Key</Label>
                  <Input
                    id="stripe-secret"
                    type="password"
                    value={stripeKeys.secretKey}
                    onChange={(e) => setStripeKeys({...stripeKeys, secretKey: e.target.value})}
                    placeholder="sk_test_..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="stripe-test-mode" 
                    checked={stripeTestMode}
                    onCheckedChange={setStripeTestMode}
                  />
                  <Label htmlFor="stripe-test-mode">Test Mode</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Mode</p>
                    <p className="text-sm text-muted-foreground">{stripeTestMode ? 'Test Mode' : 'Live Mode'}</p>
                  </div>
                  <Switch 
                    id="stripe-test-mode-connected" 
                    checked={stripeTestMode}
                    onCheckedChange={setStripeTestMode}
                  />
                </div>
                <div>
                  <p className="font-medium">Publishable Key</p>
                  <p className="text-sm text-muted-foreground">
                    {stripeKeys.publishableKey.substring(0, 8)}...{stripeKeys.publishableKey.substring(stripeKeys.publishableKey.length - 4)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!stripeConnected ? (
              <Button onClick={handleConnectStripe} className="w-full gap-2">
                <CreditCard className="h-4 w-4" />
                Connect Stripe
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDisconnectStripe} className="w-full">
                Disconnect Stripe
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* PayPal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">PayPal</CardTitle>
              <CardDescription>
                Accept PayPal payments from your customers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {paypalConnected ? (
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
            {!paypalConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-id">Client ID</Label>
                  <Input 
                    id="paypal-client-id" 
                    value={paypalKeys.clientId}
                    onChange={(e) => setPaypalKeys({...paypalKeys, clientId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-secret">Client Secret</Label>
                  <Input
                    id="paypal-client-secret"
                    type="password"
                    value={paypalKeys.clientSecret}
                    onChange={(e) => setPaypalKeys({...paypalKeys, clientSecret: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="paypal-test-mode" 
                    checked={paypalTestMode}
                    onCheckedChange={setPaypalTestMode}
                  />
                  <Label htmlFor="paypal-test-mode">Sandbox Mode</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Mode</p>
                    <p className="text-sm text-muted-foreground">{paypalTestMode ? 'Sandbox Mode' : 'Live Mode'}</p>
                  </div>
                  <Switch 
                    id="paypal-test-mode-connected" 
                    checked={paypalTestMode}
                    onCheckedChange={setPaypalTestMode}
                  />
                </div>
                <div>
                  <p className="font-medium">Client ID</p>
                  <p className="text-sm text-muted-foreground">
                    {paypalKeys.clientId.substring(0, 8)}...{paypalKeys.clientId.substring(paypalKeys.clientId.length - 4)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!paypalConnected ? (
              <Button onClick={handleConnectPaypal} className="w-full gap-2">
                Connect PayPal
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDisconnectPaypal} className="w-full">
                Disconnect PayPal
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Square */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Square</CardTitle>
              <CardDescription>
                Connect Square for payments and POS integration
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {squareConnected ? (
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
            {!squareConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="square-app-id">Application ID</Label>
                  <Input 
                    id="square-app-id" 
                    value={squareKeys.applicationId}
                    onChange={(e) => setSquareKeys({...squareKeys, applicationId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square-access-token">Access Token</Label>
                  <Input
                    id="square-access-token"
                    type="password"
                    value={squareKeys.accessToken}
                    onChange={(e) => setSquareKeys({...squareKeys, accessToken: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="square-test-mode" 
                    checked={squareTestMode}
                    onCheckedChange={setSquareTestMode}
                  />
                  <Label htmlFor="square-test-mode">Test Mode</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Mode</p>
                    <p className="text-sm text-muted-foreground">{squareTestMode ? 'Test Mode' : 'Live Mode'}</p>
                  </div>
                  <Switch 
                    id="square-test-mode-connected" 
                    checked={squareTestMode}
                    onCheckedChange={setSquareTestMode}
                  />
                </div>
                <div>
                  <p className="font-medium">Application ID</p>
                  <p className="text-sm text-muted-foreground">
                    {squareKeys.applicationId.substring(0, 8)}...{squareKeys.applicationId.substring(squareKeys.applicationId.length - 4)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!squareConnected ? (
              <Button onClick={handleConnectSquare} className="w-full gap-2">
                Connect Square
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDisconnectSquare} className="w-full">
                Disconnect Square
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
