import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lead } from '@/types/lead';
import { Building2, Users, DollarSign, Globe, TrendingUp, Edit, ExternalLink } from 'lucide-react';

interface CompanyIntelligenceCardProps {
  lead: Lead;
  expanded?: boolean;
  onEdit?: () => void;
}

export default function CompanyIntelligenceCard({ 
  lead, 
  expanded = false, 
  onEdit 
}: CompanyIntelligenceCardProps) {
  const handleEdit = () => {
    if (onEdit) onEdit();
  };

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Unknown';
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const industryKeywords = lead.companyInfo?.industry?.split(',').map(i => i.trim()) || [];

  return (
    <Card className={expanded ? 'col-span-full' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Company Intelligence
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{lead.company}</div>
                <div className="text-sm text-muted-foreground">Company Name</div>
              </div>
            </div>

            {lead.companyInfo?.website && (
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium flex items-center">
                    <span className="mr-2">{lead.companyInfo.website}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={lead.companyInfo.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">Website</div>
                </div>
              </div>
            )}

            {lead.companyInfo?.size && (
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{lead.companyInfo.size}</div>
                  <div className="text-sm text-muted-foreground">Company Size</div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {lead.companyInfo?.estimatedAnnualSpend && (
              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {formatCurrency(lead.companyInfo.estimatedAnnualSpend)} annually
                  </div>
                  <div className="text-sm text-muted-foreground">Estimated Merch Spend</div>
                </div>
              </div>
            )}

            {lead.confidenceScore && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Confidence</span>
                  <span className={`text-sm font-medium ${getConfidenceColor(lead.confidenceScore)}`}>
                    {Math.round(lead.confidenceScore * 100)}%
                  </span>
                </div>
                <Progress value={lead.confidenceScore * 100} className="h-2" />
              </div>
            )}
          </div>
        </div>

        {/* Industry Information */}
        {industryKeywords.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Industry & Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {industryKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights (if expanded) */}
        {expanded && lead.aiEnriched && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium">AI Analysis Summary</h4>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Based on web research and company data analysis, this appears to be a{' '}
                <span className="font-medium">{lead.companyInfo?.size || 'medium-sized'}</span>{' '}
                company in the <span className="font-medium">{lead.companyInfo?.industry || 'various'}</span>{' '}
                industry with an estimated annual merchandise spend of{' '}
                <span className="font-medium">
                  {formatCurrency(lead.companyInfo?.estimatedAnnualSpend)}
                </span>.
                {lead.confidenceScore && lead.confidenceScore > 0.7 && (
                  <span> Our AI model has high confidence in this assessment.</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {lead.lastEnrichedAt && (
          <div className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Last updated by AI</span>
            <span>
              {new Date(lead.lastEnrichedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}