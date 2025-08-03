
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Lead } from '@/types/lead';
import { User, DollarSign, Bot, CheckCircle, AlertCircle } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  isDragging?: boolean;
  onClick: (lead: Lead) => void;
}

export default function LeadCard({ lead, isDragging = false, onClick }: LeadCardProps) {
  const timeAgo = lead.lastContactedAt 
    ? formatDistanceToNow(new Date(lead.lastContactedAt), { addSuffix: true })
    : formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true });

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click from triggering drag
    e.stopPropagation();
    onClick(lead);
  };

  const getDataQualityIcon = () => {
    // Simple data quality check
    const hasBasicInfo = lead.name && lead.email && lead.company;
    const hasExtendedInfo = lead.phone || (lead.address && Object.values(lead.address).some(v => v));
    const hasAIData = lead.aiEnriched;

    if (hasAIData && hasExtendedInfo) {
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    } else if (hasBasicInfo) {
      return <AlertCircle className="h-3 w-3 text-yellow-600" />;
    }
    return null;
  };

  return (
    <Card className={`
      ${isDragging ? 'opacity-50' : 'opacity-100'}
      bg-white shadow-sm hover:shadow cursor-pointer transition-shadow duration-200
      ${lead.aiEnriched ? 'ring-1 ring-blue-200' : ''}
    `}
    onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium line-clamp-1">{lead.name}</h3>
          <div className="flex items-center space-x-1">
            {lead.aiEnriched && (
              <Bot className="h-3 w-3 text-blue-600" />
            )}
            {getDataQualityIcon()}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mb-2">
          {lead.company}
        </div>

        {/* Customer Type & Data Source Badges */}
        <div className="flex items-center gap-1 mb-2">
          <Badge 
            variant={lead.customerType === 'new' ? 'default' : 'secondary'} 
            className="text-xs px-1 py-0"
          >
            {lead.customerType === 'new' ? 'New' : 'Existing'}
          </Badge>
          {lead.dataSource && lead.dataSource !== 'manual' && (
            <Badge variant="outline" className="text-xs px-1 py-0 capitalize">
              {lead.dataSource}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3 mr-1" />
            <span>${lead.value.toLocaleString()}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {timeAgo}
          </div>
        </div>
        
        {/* Enhanced info display */}
        {lead.companyInfo?.estimatedAnnualSpend && (
          <div className="mt-2 text-xs text-muted-foreground">
            Est. spend: ${(lead.companyInfo.estimatedAnnualSpend / 1000).toFixed(0)}K/year
          </div>
        )}
        
        {lead.notes && (
          <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
            {lead.notes}
          </div>
        )}

        {/* AI Confidence indicator */}
        {lead.confidenceScore && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span className="mr-1">Confidence:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1 mr-1">
              <div 
                className="bg-blue-600 h-1 rounded-full" 
                style={{ width: `${lead.confidenceScore * 100}%` }}
              />
            </div>
            <span>{Math.round((lead.confidenceScore || 0) * 100)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
