import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadActivity, EmailThread, CallLog } from '@/types/lead';
import { formatDistanceToNow } from 'date-fns';
import { 
  Activity, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Clock,
  PhoneCall,
  Plus,
  Filter,
  Quote,
  Package,
  Image
} from 'lucide-react';
import EmailThreadDialog from './EmailThreadDialog';

interface ActivityTimelineProps {
  leadId: string;
  filterType?: 'activity' | 'communication';
}

// Mock data for demonstration
const mockActivities: LeadActivity[] = [
  {
    id: '1',
    leadId: '1',
    type: 'email',
    title: 'Initial inquiry received',
    description: 'Customer inquired about custom t-shirt printing for company event',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      emailThread: {
        id: 'thread1',
        subject: 'Custom T-Shirt Printing Inquiry',
        participants: ['john@acmecorp.com', 'sales@printshop.com'],
        messages: [
          {
            id: 'msg-1',
            from: 'john@acmecorp.com',
            to: ['sales@printshop.com'],
            subject: 'Custom T-Shirt Printing Inquiry',
            body: 'Hi, we need custom t-shirts for our company event. About 50 pieces. Can you help?',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          }
        ],
        lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  },
  {
    id: '4',
    leadId: '1',
    type: 'quote',
    title: 'AI Quote Generated',
    description: 'Automatic quote generated based on customer requirements',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    metadata: {
      quoteId: 'Q-2024-001',
      totalAmount: 875.00,
      products: ['Gildan 5000 T-Shirt - Navy'],
      printMethod: 'Screen Print'
    }
  },
  {
    id: '3',
    leadId: '1',
    type: 'logo_upload',
    title: 'Logo received',
    description: 'Customer sent company logo file',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    metadata: {
      fileName: 'company-logo.png',
      fileSize: '2.3 MB'
    }
  },
  {
    id: '2',
    leadId: '1',
    type: 'call',
    title: 'Discovery call completed',
    description: 'Discussed requirements: 100 custom t-shirts, 3-color design, needed by end of month',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      callLog: {
        id: 'call1',
        duration: 1800,
        direction: 'outbound',
        outcome: 'answered',
        notes: 'Very interested, decision maker, budget confirmed at $5000'
      }
    }
  }
];

export default function ActivityTimeline({ leadId, filterType }: ActivityTimelineProps) {
  const [activities] = useState<LeadActivity[]>(mockActivities);
  const [selectedEmailThread, setSelectedEmailThread] = useState(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      case 'quote':
        return <Quote className="h-4 w-4" />;
      case 'logo_upload':
        return <Image className="h-4 w-4" />;
      case 'product_selection':
        return <Package className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const handleViewEmailThread = (emailThread: any) => {
    setSelectedEmailThread(emailThread);
    setEmailDialogOpen(true);
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'call':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'note':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'quote':
        return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'logo_upload':
        return 'bg-violet-100 text-violet-600 border-violet-200';
      case 'product_selection':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatCallDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Filter activities based on filterType prop
  const communicationTypes = ['email', 'call'];
  const activityTypes = ['quote', 'logo_upload', 'product_selection', 'note', 'meeting', 'form_submission'];
  
  const filteredActivities = filterType === 'communication' 
    ? activities.filter(activity => communicationTypes.includes(activity.type))
    : filterType === 'activity'
    ? activities.filter(activity => activityTypes.includes(activity.type))
    : activities;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filterType === 'communication' ? 'Communication History' : 
           filterType === 'activity' ? 'Activity History' : 'Activity & Communication'}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {filterType === 'communication' ? 'Log Communication' : 'Log Activity'}
          </Button>
        </div>
      </div>

      {/* Activities List */}
      <div className="mt-4">
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No {filterType === 'communication' ? 'communications' : 'activities'} found.
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity, index) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Activity Icon */}
                      <div className={`
                        p-2 rounded-full border
                        ${getActivityColor(activity.type)}
                      `}>
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{activity.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {activity.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {activity.description}
                        </p>

                        {/* Activity-specific content */}
                        {activity.type === 'email' && activity.metadata?.emailThread && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                📧 {activity.metadata.emailThread.subject}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewEmailThread(activity.metadata.emailThread)}
                              >
                                View Thread
                              </Button>
                            </div>
                          </div>
                        )}

                        {activity.type === 'quote' && activity.metadata && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                💰 Quote #{activity.metadata.quoteId}
                              </span>
                              <span className="text-sm font-semibold">
                                ${activity.metadata.totalAmount}
                              </span>
                            </div>
                            {activity.metadata.products && (
                              <div className="text-xs text-muted-foreground">
                                Products: {activity.metadata.products.join(', ')}
                              </div>
                            )}
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm">
                                View Quote
                              </Button>
                            </div>
                          </div>
                        )}

                        {activity.type === 'logo_upload' && activity.metadata && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                🖼️ {activity.metadata.fileName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {activity.metadata.fileSize}
                              </span>
                            </div>
                          </div>
                        )}

                        {activity.type === 'call' && activity.metadata?.callLog && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Duration:</span>{' '}
                                {formatCallDuration(activity.metadata.callLog.duration)}
                              </div>
                              <div>
                                <span className="font-medium">Direction:</span>{' '}
                                <Badge variant="outline" className="ml-1 capitalize">
                                  {activity.metadata.callLog.direction}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Outcome:</span>{' '}
                                <Badge variant="outline" className="ml-1 capitalize">
                                  {activity.metadata.callLog.outcome}
                                </Badge>
                              </div>
                            </div>
                            {activity.metadata.callLog.notes && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Notes:</span>{' '}
                                {activity.metadata.callLog.notes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {filterType === 'communication' ? (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <PhoneCall className="h-4 w-4 mr-2" />
                Log Call
              </Button>
            </div>
          ) : filterType === 'activity' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Quote className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <PhoneCall className="h-4 w-4 mr-2" />
                Log Call
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Thread Dialog */}
      <EmailThreadDialog
        emailThread={selectedEmailThread}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        leadName="Sample Lead"
      />
    </div>
  );
}