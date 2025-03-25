
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Zap, Check, ArrowRight, PlugZap } from 'lucide-react';

export function ZapierIntegration() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [zapCount, setZapCount] = useState(0);

  const handleConnect = async () => {
    if (!webhookUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a Zapier webhook URL",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsLoading(false);
      setConnected(true);
      toast({
        title: "Zapier Connected",
        description: "Your Zapier webhook has been successfully connected.",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setWebhookUrl('');
    toast({
      title: "Zapier Disconnected",
      description: "Your Zapier webhook has been disconnected.",
    });
  };

  const handleTestTrigger = async () => {
    if (!connected) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setZapCount(zapCount + 1);
      toast({
        title: "Webhook Triggered",
        description: "Test event successfully sent to Zapier webhook.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Zapier Integration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Connect Zapier to automate workflows with over 3,000+ apps
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Zapier Webhook</CardTitle>
          <CardDescription>
            Connect to Zapier to trigger automated workflows when events occur in InkIQ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!connected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Input
                    placeholder="Enter your Zapier webhook URL"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button onClick={handleConnect} disabled={isLoading || !webhookUrl}>
                    {isLoading ? "Connecting..." : "Connect"}
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" /> How to set up Zapier
                  </h4>
                  <ol className="space-y-2 text-sm pl-5 list-decimal">
                    <li>Log in to your Zapier account</li>
                    <li>Create a new Zap with a "Webhook" trigger</li>
                    <li>Select "Catch Hook" as the trigger event</li>
                    <li>Copy the webhook URL provided by Zapier</li>
                    <li>Paste the URL in the field above and click "Connect"</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-100 p-4 rounded-md flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Zapier Connected</p>
                    <p className="text-sm text-green-700">Your Zapier webhook is active and ready to receive events</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Webhook URL</p>
                    <p className="text-sm text-muted-foreground break-all">
                      {webhookUrl.substring(0, 30)}...{webhookUrl.substring(webhookUrl.length - 20)}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleTestTrigger}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <PlugZap className="h-4 w-4" />
                    {isLoading ? "Sending..." : "Test Trigger"}
                  </Button>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <p className="font-medium">Activity</p>
                  <p className="text-sm text-muted-foreground">
                    {zapCount > 0 
                      ? `${zapCount} event${zapCount === 1 ? '' : 's'} sent to Zapier`
                      : 'No events sent yet'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        {connected && (
          <CardFooter>
            <Button variant="destructive" onClick={handleDisconnect} className="w-full">
              Disconnect Zapier
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Triggers</CardTitle>
          <CardDescription>
            Events from InkIQ that can trigger Zapier workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">New Quote Created</p>
                    <p className="text-sm text-muted-foreground">Triggers when a new quote is created in the system</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Quote Status Changed</p>
                    <p className="text-sm text-muted-foreground">Triggers when a quote status is updated</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">New Customer Created</p>
                    <p className="text-sm text-muted-foreground">Triggers when a new customer is added to the system</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">Triggers when a payment is recorded in the system</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Order Status Updated</p>
                    <p className="text-sm text-muted-foreground">Triggers when an order changes status</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
