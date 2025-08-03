import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { User, Mail, Phone, MapPin, Edit, ExternalLink } from 'lucide-react';

interface ContactInfoSectionProps {
  lead: Lead;
  onEdit?: () => void;
}

export default function ContactInfoSection({ lead, onEdit }: ContactInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };

  const socialLinks = [
    { platform: 'LinkedIn', url: lead.socialProfiles?.linkedin, icon: '💼' },
  ].filter(link => link.url);

  const formatAddress = () => {
    const addr = lead.address;
    if (!addr) return null;
    
    const parts = [
      addr.street,
      addr.city,
      addr.state,
      addr.zip,
      addr.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center">
          <User className="h-5 w-5 mr-2" />
          Contact Information
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Contact Info */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{lead.name}</div>
              <div className="text-sm text-muted-foreground">Contact Name</div>
            </div>
          </div>

          {lead.jobTitle && (
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{lead.jobTitle}</div>
                <div className="text-sm text-muted-foreground">Job Title</div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{lead.email}</div>
              <div className="text-sm text-muted-foreground">Email Address</div>
            </div>
          </div>

          {lead.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{lead.phone}</div>
                <div className="text-sm text-muted-foreground">Phone Number</div>
              </div>
            </div>
          )}

          {formatAddress() && (
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{formatAddress()}</div>
                <div className="text-sm text-muted-foreground">Address</div>
              </div>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        {socialLinks.length > 0 && (
          <>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Social Media Profiles</h4>
              <div className="grid grid-cols-1 gap-2">
                {socialLinks.map((link) => (
                  <div key={link.platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-medium">{link.platform}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}