
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Mail, LogIn, Check } from 'lucide-react';

export function EmailIntegration() {
  const { toast } = useToast();
  const [emailProvider, setEmailProvider] = useState('gmail');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [emailCredentials, setEmailCredentials] = useState({
    email: '',
    password: '',
    server: '',
    port: ''
  });

  const handleConnect = () => {
    if (!emailCredentials.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email address is required",
      });
      return;
    }

    if (emailProvider === 'other' && (!emailCredentials.server || !emailCredentials.port)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Server details are required for custom email providers",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast({
        title: "Email Connected",
        description: `Your ${emailProvider === 'gmail' ? 'Gmail' : emailProvider === 'outlook' ? 'Outlook' : 'email'} account has been connected successfully.`,
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Email Disconnected",
      description: "Your email account has been disconnected.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Email Integration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your email accounts to send notifications and messages
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connect Email Account</CardTitle>
          <CardDescription>
            Link your email account to send emails from InkIQ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-6">
              <RadioGroup 
                value={emailProvider} 
                onValueChange={setEmailProvider}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="gmail" id="gmail" />
                  <Label htmlFor="gmail" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#EA4335" d="M5.266 9.805h1.2v4.39h-1.2z"/>
                      <path fill="#FBBC04" d="M11.966 9.805h-1.2v4.39h1.2z"/>
                      <path fill="#34A853" d="M12.066 13.397v4.5h1.2v-4.5z"/>
                      <path fill="#4285F4" d="M23.766 13.397h-1.2v4.5h1.2z"/>
                      <path fill="#EA4335" d="M17.766 7.5h-1.2v3h1.2z"/>
                      <path fill="#EA4335" d="M12 2 4 6v12l8 4 8-4V6l-8-4zm6.5 14.7-6.5 3.25-6.5-3.25v-9.4L12 3.5l6.5 3.8v9.4z"/>
                    </svg>
                    Gmail
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="outlook" id="outlook" />
                  <Label htmlFor="outlook" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#0078D4" d="M13.27 11.33L21 4v17l-7.73-7.33v-2.34z"/>
                      <path fill="#0078D4" d="M21 4h-4.54L12 8.45v2.72l6.26 6.26H21V4z"/>
                      <path fill="#0078D4" d="M3 4.36h5.84v15.28H3z"/>
                      <path fill="#0078D4" d="M0 4.36h11.68v15.28H0z"/>
                    </svg>
                    Outlook
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-4">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Other
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={emailCredentials.email}
                    onChange={(e) => setEmailCredentials({...emailCredentials, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-password">Password</Label>
                  <Input
                    id="email-password"
                    type="password"
                    placeholder="••••••••"
                    value={emailCredentials.password}
                    onChange={(e) => setEmailCredentials({...emailCredentials, password: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    For Gmail and Outlook, you may need to create an app password instead of using your actual password.
                  </p>
                </div>
                
                {emailProvider === 'other' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-server">SMTP Server</Label>
                      <Input
                        id="email-server"
                        placeholder="smtp.example.com"
                        value={emailCredentials.server}
                        onChange={(e) => setEmailCredentials({...emailCredentials, server: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-port">SMTP Port</Label>
                      <Input
                        id="email-port"
                        placeholder="587"
                        value={emailCredentials.port}
                        onChange={(e) => setEmailCredentials({...emailCredentials, port: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-100 p-4 rounded-md flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Email Connected</p>
                  <p className="text-sm text-green-700">
                    Your {emailProvider === 'gmail' ? 'Gmail' : emailProvider === 'outlook' ? 'Outlook' : 'email'} account is connected and ready to use
                  </p>
                </div>
              </div>
              
              <div>
                <p className="font-medium">Connected Account</p>
                <p className="text-muted-foreground">{emailCredentials.email}</p>
              </div>
              
              <div>
                <p className="font-medium">Email Provider</p>
                <p className="text-muted-foreground capitalize">{emailProvider}</p>
              </div>
              
              {emailProvider === 'other' && (
                <div>
                  <p className="font-medium">SMTP Settings</p>
                  <p className="text-muted-foreground">
                    Server: {emailCredentials.server}, Port: {emailCredentials.port}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting} 
              className="w-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Email"}
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              onClick={handleDisconnect} 
              className="w-full"
            >
              Disconnect Email
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Configure how emails are sent from your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Connect an email account to configure these settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
