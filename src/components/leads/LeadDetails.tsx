
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { formatDistanceToNow } from 'date-fns';
import { Lead } from '@/types/lead';
import { Users, Building2, Mail, Phone, DollarSign, Calendar, MessageSquare, Edit } from 'lucide-react';

interface LeadDetailsProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LeadDetails({ lead, open, onOpenChange }: LeadDetailsProps) {
  if (!lead) return null;

  const createdAt = new Date(lead.createdAt);
  const lastContactedAt = lead.lastContactedAt ? new Date(lead.lastContactedAt) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <span className="mr-2">{lead.name}</span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                Click to edit lead
              </HoverCardContent>
            </HoverCard>
          </SheetTitle>
          <SheetDescription>
            Lead details and contact information
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-6">
          <div className="flex items-start space-x-4">
            <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Contact</p>
              <p className="text-sm text-muted-foreground">{lead.name}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Company</p>
              <p className="text-sm text-muted-foreground">{lead.company}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Email</p>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
            </div>
          </div>

          {lead.phone && (
            <div className="flex items-start space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Phone</p>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-4">
            <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Deal Value</p>
              <p className="text-sm text-muted-foreground">${lead.value.toLocaleString()}</p>
            </div>
          </div>

          <Separator />
          
          <div className="flex items-start space-x-4">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Created</p>
              <p className="text-sm text-muted-foreground">
                {createdAt.toLocaleDateString()} ({formatDistanceToNow(createdAt, { addSuffix: true })})
              </p>
            </div>
          </div>

          {lastContactedAt && (
            <div className="flex items-start space-x-4">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Last Contacted</p>
                <p className="text-sm text-muted-foreground">
                  {lastContactedAt.toLocaleDateString()} ({formatDistanceToNow(lastContactedAt, { addSuffix: true })})
                </p>
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="flex items-start space-x-4">
              <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{lead.notes}</p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button>Schedule Follow-up</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
