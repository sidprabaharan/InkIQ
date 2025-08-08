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
  Image,
  FileText
} from 'lucide-react';
import EmailThreadDialog from './EmailThreadDialog';

interface ActivityTimelineProps {
  leadId: string;
  filterType?: 'activity' | 'communication';
}

// Mock data for demonstration
const mockActivities: LeadActivity[] = [
  // Pamela Hunt activities
  {
    id: 'pamela-activity-1',
    leadId: 'pamela-hunt',
    type: 'email',
    title: 'Initial inquiry received',
    description: 'Customer reached out about t-shirts, hoodies, and hats for staff event',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      emailThread: {
        id: 'pamela-thread-1',
        subject: 'Staff Merchandise Order - Western Alliance Transport',
        participants: ['pamela@westernalliancetransport.com', 'kiriakos@merchradar.com'],
        messages: [
          {
            id: 'pamela-msg-1',
            from: 'pamela@westernalliancetransport.com',
            to: ['kiriakos@merchradar.com'],
            subject: 'Staff Merchandise Order',
            body: 'Hello,\n\nWe\'d like to order t-shirts, hoodies, and hats for our staff. We need them for an event next week. How much will this cost, and can you deliver?\n\nPamela Hunt\nWestern Alliance Transport\n514-512-9926',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: 'pamela-msg-2',
            from: 'kiriakos@merchradar.com',
            to: ['pamela@westernalliancetransport.com'],
            subject: 'Re: Staff Merchandise Order',
            body: 'Hi Pamela,\n\nThanks for reaching out—happy to help.\n\nI just need a few quick details so I can put together a quote and some mockups for you:\n• Do you know which t-shirt, hoodie, and hat models you\'re looking for?\n• Do you have a budget in mind?\n• What colors do you want for each item?\n• Can you send me a size/quantity breakdown?\n• Can you send your logo(s) and let me know where you want them placed and how large?\n• What exact date next week do you need delivery by?\n\nLooking forward to your reply.\n\nThanks,\nKiriakos\nMerch Radar\nkiriakos@merchradar.com\n514-834-6659\nmercradar.com',
            timestamp: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: 'pamela-msg-3',
            from: 'pamela@westernalliancetransport.com',
            to: ['kiriakos@merchradar.com'],
            subject: 'Re: Staff Merchandise Order',
            body: 'Hi Kiriakos,\n\nWe need everything delivered no later than next Thursday.\n\nCan you send me a few garment options? I\'m not too picky—just something cotton for the tees and hoodies, and a hat with a buckle. Good quality but affordable.\n\nColors:\n• Black t-shirts and hoodies\n• White hats\n• For the tees and hoodies, we want the black part of the logo to be white\n\nQuantities:\n• Tees & Hoodies: 20 small, 50 medium, 50 large, 20 XL\n• Hats: 140 units\n\nI attached our logos.\n• Print the full logo large on the front of the tees and hoodies\n• Print the slogan large on the back\n• Embroider just the logo on the front of the hats\n\nLet me know if you need anything else.\n\nPamela Hunt\nWestern Alliance Transport\n514-512-9926',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: 'pamela-msg-4',
            from: 'kiriakos@merchradar.com',
            to: ['pamela@westernalliancetransport.com'],
            subject: 'Re: Staff Merchandise Order - Garment Options',
            body: 'Hi Pamela,\n\nThanks for the info—here are some great garment options with prices (includes decoration):\n\nT-Shirts\n• Gildan 5000 – 100% cotton, boxy fit, durable. $7.52\n• Gildan 64000 – 100% cotton, slimmer fit, softer feel. $8.36\n• Bella Canvas 3001C – Premium fit/feel, still budget-friendly. $9.40\n\nHoodies (100% cotton)\nHoodies are a bit tricky—cotton ones are harder to find at low prices. Let me know if you\'d be open to blends for cheaper options.\n• Comfort Colors 1467 – Lightweight, soft, $30.44\n• Allmade AL400 – French terry, lightweight, $36.58\n• Stanley/Stella SXU028 – Premium French terry, $49.40\n• LA Apparel HF-09 – Made in USA, heavy, boxy fit. $52.75\n\nHats\n• Valucap VC300A – Unstructured, buckle closure. $11.40\n• Valucap 9910 – Structured, buckle closure. $12.33\n\nLet me know which ones you want so I can send over the quote and mockups.\n\nThanks,\nKiriakos',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: 'pamela-msg-5',
            from: 'pamela@westernalliancetransport.com',
            to: ['kiriakos@merchradar.com'],
            subject: 'Re: Staff Merchandise Order - Final Selection',
            body: 'Hey Kiriakos,\n\nLet\'s go with:\n• Gildan 5000 t-shirt\n• Comfort Colors 1467 hoodie\n• Valucap VC300A hat\n\nPlease send over the quote and mockups, and let me know the next steps.\n\nPamela Hunt\nWestern Alliance Transport\n514-512-9926',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          },
          {
            id: 'pamela-msg-6',
            from: 'kiriakos@merchradar.com',
            to: ['pamela@westernalliancetransport.com'],
            subject: 'Re: Staff Merchandise Order - Quote & Mockups',
            body: 'Hey Pamela,\n\nJust sent over the formal quote with mockups and instructions to get started. Let me know if you have any questions!\n\nThanks,\nKiriakos',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isRead: true
          }
        ],
        lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  },
  {
    id: 'pamela-activity-2',
    leadId: 'pamela-hunt',
    type: 'logo_upload',
    title: 'Logo files received',
    description: 'Customer uploaded company logos for merchandise decoration',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      fileName: 'western-alliance-logos.zip',
      fileSize: '2.4 MB'
    }
  },
  {
    id: 'pamela-activity-3',
    leadId: 'pamela-hunt',
    type: 'product_selection',
    title: 'Products selected',
    description: 'Final garment selection made: Gildan 5000, Comfort Colors 1467, Valucap VC300A',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      products: ['Gildan 5000 T-Shirt', 'Comfort Colors 1467 Hoodie', 'Valucap VC300A Hat'],
      totalAmount: 12000,
      printMethod: 'Screen Print & Embroidery'
    }
  },
  {
    id: 'pamela-activity-4',
    leadId: 'pamela-hunt',
    type: 'quote',
    title: 'inkIQ auto-replied with quote',
    description: 'AI automatically analyzed conversation and generated formal quote with mockups',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      quoteId: '3046',
      totalAmount: 12000,
      products: ['T-Shirts (140 units)', 'Hoodies (140 units)', 'Hats (140 units)'],
      isAiGenerated: true,
      aiConfidence: 95
    }
  },
  // Existing activities for other leads
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
      case 'form_submission':
        return <FileText className="h-4 w-4" />;
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
      case 'form_submission':
        return 'bg-sky-100 text-sky-600 border-sky-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatCallDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Filter by lead and include Emily Davis PO-to-Quote demo activities, then sort newest first
  const additionalActivities: LeadActivity[] = [
    {
      id: 'emily-po-received',
      leadId: '4',
      type: 'form_submission',
      title: 'Purchase Order received',
      description: 'Emily sent a PO with decoration requirements and art files',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      metadata: { fileName: 'PO_1183_Merchly_Promotional.pdf', fileSize: '1.8 MB' }
    },
    {
      id: 'emily-quote-generated',
      leadId: '4',
      type: 'quote',
      title: 'inkIQ analyzed PO and created quote',
      description: 'inkIQ automatically extracted decoration requirements and generated a quote',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      metadata: { quoteId: 'Q-1183', totalAmount: 3240.00, products: ['Screen Print Setup (3 colors)', 'Screen Print Run (200 shirts)', 'Embroidery Setup (2 positions)', 'Embroidery Run (75 hats)'] }
    },
    {
      id: 'emily-quote-approved',
      leadId: '4',
      type: 'note',
      title: 'Quote approved by Emily',
      description: 'Emily approved the quote and confirmed production timeline',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      metadata: { quoteId: 'Q-1183' }
    }
  ];

  const filteredActivities = [...activities, ...additionalActivities]
    .filter(a => a.leadId === leadId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Activity & Communication
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
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
                          <div className={`p-3 rounded-lg ${activity.metadata.isAiGenerated ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' : 'bg-muted/50'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {activity.metadata.isAiGenerated && (
                                  <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    <span className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                                    </span>
                                    AI Generated
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  💰 Quote #{activity.metadata.quoteId}
                                </span>
                              </div>
                              <span className="text-sm font-semibold">
                                ${activity.metadata.totalAmount}
                              </span>
                            </div>
                            {activity.metadata.isAiGenerated && (
                              <div className="flex items-center space-x-4 mb-2 text-xs">
                                <div className="flex items-center space-x-1">
                                  <span className="text-blue-600">🎯 Confidence:</span>
                                  <span className="font-medium">{activity.metadata.aiConfidence}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-purple-600">⚡ Auto-sent to customer</span>
                                </div>
                              </div>
                            )}
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

                        {activity.type === 'form_submission' && activity.metadata && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                📄 {activity.metadata.fileName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {activity.metadata.fileSize}
                              </span>
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm">View PO</Button>
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