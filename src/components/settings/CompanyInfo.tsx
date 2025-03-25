
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Globe, Building, Users } from 'lucide-react';

export function CompanyInfo() {
  const { toast } = useToast();
  const [company, setCompany] = useState({
    name: 'InkIQ Printing',
    address: '123 Print Avenue, Suite 100',
    city: 'Inkville',
    state: 'CA',
    zip: '90210',
    country: 'USA',
    phone: '(555) 123-4567',
    email: 'info@inkiq.com',
    website: 'www.inkiq.com',
    taxId: '12-3456789',
    description: 'Leading provider of screen printing, embroidery and promotional products.',
    logoUrl: '/placeholder.svg'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState({...company});

  const handleSave = () => {
    setCompany({...editedCompany});
    setIsEditing(false);
    toast({
      title: 'Company information updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setEditedCompany({...company});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Company Information</h3>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Information</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name" 
                value={editedCompany.name}
                onChange={(e) => setEditedCompany({...editedCompany, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-tax">Tax ID / EIN</Label>
              <Input 
                id="company-tax" 
                value={editedCompany.taxId}
                onChange={(e) => setEditedCompany({...editedCompany, taxId: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-description">Company Description</Label>
            <Textarea 
              id="company-description" 
              value={editedCompany.description}
              onChange={(e) => setEditedCompany({...editedCompany, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-address">Street Address</Label>
              <Input 
                id="company-address" 
                value={editedCompany.address}
                onChange={(e) => setEditedCompany({...editedCompany, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-city">City</Label>
              <Input 
                id="company-city" 
                value={editedCompany.city}
                onChange={(e) => setEditedCompany({...editedCompany, city: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-state">State/Province</Label>
              <Input 
                id="company-state" 
                value={editedCompany.state}
                onChange={(e) => setEditedCompany({...editedCompany, state: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-zip">ZIP/Postal Code</Label>
              <Input 
                id="company-zip" 
                value={editedCompany.zip}
                onChange={(e) => setEditedCompany({...editedCompany, zip: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-country">Country</Label>
              <Input 
                id="company-country" 
                value={editedCompany.country}
                onChange={(e) => setEditedCompany({...editedCompany, country: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone Number</Label>
              <Input 
                id="company-phone" 
                value={editedCompany.phone}
                onChange={(e) => setEditedCompany({...editedCompany, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input 
                id="company-email" 
                value={editedCompany.email}
                onChange={(e) => setEditedCompany({...editedCompany, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input 
                id="company-website" 
                value={editedCompany.website}
                onChange={(e) => setEditedCompany({...editedCompany, website: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              <img src={editedCompany.logoUrl} alt="Company Logo" className="w-16 h-16 object-contain border rounded p-1" />
              <Input 
                id="company-logo" 
                type="file"
                accept="image/*"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <img src={company.logoUrl} alt="Company Logo" className="w-24 h-24 object-contain" />
                <h3 className="text-xl font-bold">{company.name}</h3>
                <p className="text-sm text-muted-foreground">{company.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2"><Building className="h-4 w-4" /> Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{company.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{company.website}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</h4>
              <address className="not-italic space-y-1">
                <p>{company.address}</p>
                <p>{company.city}, {company.state} {company.zip}</p>
                <p>{company.country}</p>
              </address>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Tax ID: {company.taxId}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
