import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lead } from '@/types/lead';
import { X, Edit, Building2, User, Globe, Phone, Mail, MapPin, DollarSign, Calendar, Activity, Bot, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ContactInfoSection from './ContactInfoSection';
import CompanyIntelligenceCard from './CompanyIntelligenceCard';
import ActivityTimeline from './ActivityTimeline';
import AIInsightsPanel from './AIInsightsPanel';

interface EnhancedLeadDetailsProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditLead?: (lead: Lead) => void;
}

export default function EnhancedLeadDetails({ 
  lead, 
  open, 
  onOpenChange, 
  onEditLead 
}: EnhancedLeadDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!lead) return null;

  const createdAt = new Date(lead.createdAt);
  const lastContactedAt = lead.lastContactedAt ? new Date(lead.lastContactedAt) : null;

  const handleEdit = () => {
    if (onEditLead) {
      onEditLead(lead);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-xl font-semibold">{lead.name}</DialogTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={lead.customerType === 'new' ? 'default' : 'secondary'}>
                  {lead.customerType === 'new' ? 'New Customer' : 'Existing Customer'}
                </Badge>
                {lead.aiEnriched && (
                  <Badge variant="outline" className="text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Enriched
                  </Badge>
                )}
                {lead.dataSource && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {lead.dataSource}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button size="sm">
                Schedule Follow-up
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              {lead.company}
            </span>
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              ${lead.value.toLocaleString()}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="company">Company Intelligence</TabsTrigger>
              <TabsTrigger value="activity">Activity & Communication</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto px-6 pb-6">
              <TabsContent value="overview" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ContactInfoSection lead={lead} />
                  <CompanyIntelligenceCard lead={lead} />
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-semibold">{lead.totalActivities || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Activities</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-semibold">
                      {lead.lastActivityType || 'None'}
                    </div>
                    <div className="text-sm text-muted-foreground">Last Activity</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-semibold">
                      {lead.confidenceScore ? `${Math.round(lead.confidenceScore * 100)}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Confidence</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-semibold">
                      {lead.companyInfo?.estimatedAnnualSpend 
                        ? `$${(lead.companyInfo.estimatedAnnualSpend / 1000).toFixed(0)}K`
                        : 'Unknown'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Est. Annual Spend</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="company" className="mt-4">
                <CompanyIntelligenceCard lead={lead} expanded />
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <ActivityTimeline leadId={lead.id} />
              </TabsContent>

              <TabsContent value="ai-insights" className="mt-4">
                <AIInsightsPanel lead={lead} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}