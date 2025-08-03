import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lead } from '@/types/lead';
import { 
  CheckCircle, 
  Circle, 
  Package, 
  Palette, 
  Image, 
  MapPin, 
  Calculator,
  Edit,
  Upload
} from 'lucide-react';

interface OrderRequirementsProps {
  lead: Lead;
  onEdit?: () => void;
}

interface RequirementItem {
  id: string;
  label: string;
  completed: boolean;
  icon: React.ReactNode;
  description?: string;
  value?: string;
}

export default function OrderRequirements({ lead, onEdit }: OrderRequirementsProps) {
  // Mock data - this would come from the lead object in real implementation
  const requirements: RequirementItem[] = [
    {
      id: 'product',
      label: 'Product Selection',
      completed: !!lead.companyInfo?.industry, // Mock check
      icon: <Package className="h-4 w-4" />,
      description: 'Customer has chosen specific products',
      value: lead.companyInfo?.industry || 'Not specified'
    },
    {
      id: 'quantities',
      label: 'Quantities & Sizes',
      completed: false,
      icon: <Calculator className="h-4 w-4" />,
      description: 'Breakdown of quantities needed in each size'
    },
    {
      id: 'logo',
      label: 'Logo/Design',
      completed: false,
      icon: <Image className="h-4 w-4" />,
      description: 'High-resolution logo or design files'
    },
    {
      id: 'method',
      label: 'Print Method',
      completed: false,
      icon: <Palette className="h-4 w-4" />,
      description: 'Embroidery or screen printing preference'
    },
    {
      id: 'placement',
      label: 'Logo Placement',
      completed: false,
      icon: <MapPin className="h-4 w-4" />,
      description: 'Where the logo should be placed on the garment'
    }
  ];

  const completedCount = requirements.filter(req => req.completed).length;
  const completionPercentage = (completedCount / requirements.length) * 100;

  const getStatusBadge = () => {
    if (completionPercentage === 100) {
      return <Badge className="bg-green-500">Ready for Quote</Badge>;
    } else if (completionPercentage >= 60) {
      return <Badge variant="secondary">Partially Complete</Badge>;
    } else {
      return <Badge variant="outline">Needs Information</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">Order Requirements</CardTitle>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Completion Progress</span>
            <span className="text-muted-foreground">
              {completedCount} of {requirements.length} complete
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Requirements List */}
        <div className="space-y-4">
          {requirements.map((requirement) => (
            <div key={requirement.id} className="flex items-start space-x-3">
              <div className="mt-0.5">
                {requirement.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  {requirement.icon}
                  <span className={`font-medium ${
                    requirement.completed ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {requirement.label}
                  </span>
                </div>
                
                {requirement.description && (
                  <p className="text-sm text-muted-foreground">
                    {requirement.description}
                  </p>
                )}
                
                {requirement.value && (
                  <p className="text-sm font-medium text-primary">
                    {requirement.value}
                  </p>
                )}
              </div>

              {!requirement.completed && (
                <Button variant="outline" size="sm">
                  {requirement.id === 'logo' ? (
                    <>
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </>
                  ) : (
                    <>
                      <Edit className="h-3 w-3 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* AI Quote Generation Status */}
        {completionPercentage === 100 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">AI Quote Generation Available</span>
            </div>
            <Button className="w-full">
              Generate Automatic Quote
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}