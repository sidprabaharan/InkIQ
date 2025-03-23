
import { useState } from "react";
import { Mail, MailPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConnectEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectEmailDialog({ open, onOpenChange }: ConnectEmailDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = (provider: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      
      toast({
        title: "Email connected",
        description: `Your ${provider} account has been successfully connected.`,
      });
    }, 1500);
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      
      toast({
        title: "Email connected",
        description: `Your email account ${email} has been successfully connected.`,
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Email Account</DialogTitle>
          <DialogDescription>
            Connect your email account to manage all your messages in one place.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="oauth" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oauth">Quick Connect</TabsTrigger>
            <TabsTrigger value="manual">Manual Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="oauth" className="mt-4 space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 h-12"
              onClick={() => handleConnect("Gmail")}
              disabled={loading}
            >
              <div className="bg-red-500 text-white rounded-full p-1">
                <Mail className="h-4 w-4" />
              </div>
              Connect with Gmail
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 h-12"
              onClick={() => handleConnect("Outlook")}
              disabled={loading}
            >
              <div className="bg-blue-500 text-white rounded-full p-1">
                <Mail className="h-4 w-4" />
              </div>
              Connect with Outlook
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 h-12"
              onClick={() => handleConnect("Yahoo Mail")}
              disabled={loading}
            >
              <div className="bg-purple-500 text-white rounded-full p-1">
                <Mail className="h-4 w-4" />
              </div>
              Connect with Yahoo Mail
            </Button>
          </TabsContent>
          
          <TabsContent value="manual" className="mt-4">
            <form onSubmit={handleManualConnect}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password or App Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password or app password" 
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    For Gmail or other services with 2FA, you'll need to use an app password.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Mail Server Settings</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input placeholder="IMAP Server" />
                    </div>
                    <div>
                      <Input placeholder="Port" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input placeholder="SMTP Server" />
                    </div>
                    <div>
                      <Input placeholder="Port" />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? "Connecting..." : "Connect"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
