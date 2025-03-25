
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Workflow, Mail, Bell, Clock, Calendar, FileText } from 'lucide-react';

export function Automations() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Workflow Automations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Setup automated workflows to save time and reduce manual effort
        </p>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Automatically send emails when specific events occur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Quote Created</p>
                  <p className="text-sm text-muted-foreground">Send email when a new quote is created</p>
                </div>
                <Toggle aria-label="Toggle email for quote creation" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Status Change</p>
                  <p className="text-sm text-muted-foreground">Send email when order status changes</p>
                </div>
                <Toggle aria-label="Toggle email for status changes" defaultPressed />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-muted-foreground">Send payment receipt to customers</p>
                </div>
                <Toggle aria-label="Toggle email for payments" defaultPressed />
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">Configure Email Templates</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Internal Notifications
            </CardTitle>
            <CardDescription>
              Automatic notifications for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Customer Alert</p>
                  <p className="text-sm text-muted-foreground">Notify when new customer is created</p>
                </div>
                <Toggle aria-label="Toggle new customer alert" defaultPressed />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Order Alert</p>
                  <p className="text-sm text-muted-foreground">Notify when order is placed</p>
                </div>
                <Toggle aria-label="Toggle new order alert" defaultPressed />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Task Due Soon</p>
                  <p className="text-sm text-muted-foreground">Notify about upcoming task deadlines</p>
                </div>
                <Toggle aria-label="Toggle task due alert" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflow Rules
            </CardTitle>
            <CardDescription>
              Create custom automation rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-assign Tasks</p>
                  <p className="text-sm text-muted-foreground">Automatically assign tasks based on order type</p>
                </div>
                <Toggle aria-label="Toggle auto-assign tasks" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lead Follow-up</p>
                  <p className="text-sm text-muted-foreground">Create follow-up tasks for stale leads</p>
                </div>
                <Toggle aria-label="Toggle lead follow-up" defaultPressed />
              </div>
            </div>
            <Button className="mt-4 w-full">Add Custom Automation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
