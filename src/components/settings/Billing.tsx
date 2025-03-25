
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Check, ArrowRight, Shield, Star, AlertCircle, CheckCircle } from 'lucide-react';

export function Billing() {
  const { toast } = useToast();
  const [plan, setPlan] = useState('business');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      description: 'For small businesses just getting started',
      features: [
        'Up to 3 users',
        '500 quotes per month',
        'Basic reporting',
        'Email support',
      ]
    },
    {
      id: 'business',
      name: 'Business',
      price: 79,
      description: 'For growing businesses with advanced needs',
      features: [
        'Up to 10 users',
        'Unlimited quotes',
        'Advanced reporting',
        'Priority support',
        'API access',
        'Custom branding'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      description: 'For large businesses with complex requirements',
      features: [
        'Unlimited users',
        'Unlimited everything',
        'Enterprise reporting',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment option'
      ]
    }
  ];
  
  const selectedPlan = plans.find(p => p.id === plan) || plans[1];
  
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    expiry: '12/24',
    cvc: '•••',
    name: 'John Smith'
  });
  
  const handleUpdatePlan = () => {
    toast({
      title: "Plan Updated",
      description: `You are now subscribed to the ${selectedPlan.name} plan.`,
    });
  };
  
  const handleUpdatePayment = () => {
    toast({
      title: "Payment Method Updated",
      description: "Your payment method has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your InkIQ subscription and billing settings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your current subscription plan and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-primary/10 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPlan.name} Plan</h3>
                  <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${selectedPlan.price}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Plan Features</h4>
              <ul className="space-y-2">
                {selectedPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <RadioGroup 
              value={plan} 
              onValueChange={setPlan}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {plans.map((p) => (
                <div 
                  key={p.id}
                  className={`border rounded-md p-4 cursor-pointer hover:border-primary/50 ${plan === p.id ? 'bg-primary/5 border-primary/50' : ''}`}
                  onClick={() => setPlan(p.id)}
                >
                  <div className="flex items-start">
                    <RadioGroupItem value={p.id} id={p.id} className="mt-1" />
                    <div className="ml-2">
                      <Label htmlFor={p.id} className="font-medium">{p.name}</Label>
                      <p className="text-sm text-muted-foreground">${p.price}/mo</p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdatePlan} 
            className="w-full"
          >
            Update Subscription
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="space-y-2"
            >
              <div className={`flex items-center gap-3 border rounded-md p-4 ${paymentMethod === 'card' ? 'bg-primary/5 border-primary/50' : ''}`}>
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Credit Card</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cardDetails.number}
                  </div>
                </Label>
              </div>
              <div className={`flex items-center gap-3 border rounded-md p-4 ${paymentMethod === 'ach' ? 'bg-primary/5 border-primary/50' : ''}`}>
                <RadioGroupItem value="ach" id="ach" />
                <Label htmlFor="ach" className="flex-1 flex items-center gap-2 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <rect width="24" height="24" fill="#fff" />
                    <path d="M21 5H3v14h18V5z" fill="#1A1A1A" />
                    <path d="M3 12h18v2H3v-2z" fill="#fff" />
                  </svg>
                  <span>ACH Bank Transfer</span>
                </Label>
              </div>
            </RadioGroup>
            
            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input 
                    id="card-number" 
                    placeholder="•••• •••• •••• ••••"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiration Date</Label>
                    <Input 
                      id="card-expiry" 
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input 
                      id="card-cvc" 
                      placeholder="•••"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input 
                    id="card-name" 
                    placeholder="John Smith"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                  <Shield className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            )}
            
            {paymentMethod === 'ach' && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="ach-routing">Routing Number</Label>
                  <Input 
                    id="ach-routing" 
                    placeholder="123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ach-account">Account Number</Label>
                  <Input 
                    id="ach-account" 
                    placeholder="•••••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ach-name">Account Holder Name</Label>
                  <Input 
                    id="ach-name" 
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                  <Shield className="h-4 w-4" />
                  <span>Your banking information is secure and encrypted</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpdatePayment} 
            className="w-full"
          >
            Update Payment Method
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past invoices and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #INV-2023-005</p>
                  <p className="text-sm text-muted-foreground">May 1, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${selectedPlan.price}.00</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                    <span>Paid</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #INV-2023-004</p>
                  <p className="text-sm text-muted-foreground">April 1, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${selectedPlan.price}.00</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                    <span>Paid</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #INV-2023-003</p>
                  <p className="text-sm text-muted-foreground">March 1, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${selectedPlan.price}.00</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                    <span>Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
