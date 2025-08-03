import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lead } from '@/types/lead';
import { 
  Bot, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';

interface AIInsightsPanelProps {
  lead: Lead;
}

export default function AIInsightsPanel({ lead }: AIInsightsPanelProps) {
  const getDataQualityScore = () => {
    let score = 0;
    let total = 0;

    // Basic info (required)
    total += 4;
    if (lead.name) score += 1;
    if (lead.email) score += 1;
    if (lead.company) score += 1;
    if (lead.phone) score += 1;

    // Address info
    total += 1;
    if (lead.address && Object.values(lead.address).some(v => v)) score += 1;

    // Social profiles
    total += 1;
    if (lead.socialProfiles && Object.values(lead.socialProfiles).some(v => v)) score += 1;

    // Company info
    total += 1;
    if (lead.companyInfo && Object.values(lead.companyInfo).some(v => v)) score += 1;

    return Math.round((score / total) * 100);
  };

  const dataQualityScore = getDataQualityScore();
  const enrichmentSources = [
    { name: 'Company Website', status: 'completed', confidence: 0.9 },
    { name: 'LinkedIn Profile', status: 'completed', confidence: 0.85 },
    { name: 'Social Media Scan', status: 'completed', confidence: 0.7 },
    { name: 'Industry Database', status: 'completed', confidence: 0.8 },
    { name: 'Financial Records', status: 'pending', confidence: 0 },
  ];

  const aiRecommendations = [
    {
      type: 'priority',
      title: 'High-Value Prospect',
      description: 'Based on company size and industry, this lead shows high conversion potential.',
      action: 'Schedule demo call within 24 hours'
    },
    {
      type: 'timing',
      title: 'Optimal Contact Time',
      description: 'Analysis suggests best contact time is Tuesday-Thursday, 10AM-2PM EST.',
      action: 'Schedule follow-up accordingly'
    },
    {
      type: 'approach',
      title: 'Personalization Opportunity',
      description: 'Company recently expanded team by 30%. Mention growth-focused solutions.',
      action: 'Customize pitch for growing companies'
    }
  ];

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'priority':
        return <TrendingUp className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'approach':
        return <Brain className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'priority':
        return 'border-red-200 bg-red-50';
      case 'timing':
        return 'border-yellow-200 bg-yellow-50';
      case 'approach':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="flex items-start space-x-3">
              <Brain className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Lead Assessment</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  This is a <strong>high-priority lead</strong> from a {lead.companyInfo?.size || 'medium-sized'} company 
                  in the {lead.companyInfo?.industry || 'technology'} sector. Based on our analysis, they have a strong 
                  likelihood of conversion with an estimated budget of{' '}
                  <strong>
                    ${lead.companyInfo?.estimatedAnnualSpend ? 
                      (lead.companyInfo.estimatedAnnualSpend / 1000).toFixed(0) + 'K' : 
                      '5-10K'
                    }
                  </strong> for merchandise annually.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((lead.confidenceScore || 0.75) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">AI Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dataQualityScore}%</div>
              <div className="text-sm text-muted-foreground">Data Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">A+</div>
              <div className="text-sm text-muted-foreground">Lead Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality & Completeness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Data Quality & Completeness
            </span>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-enrich
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Data Quality</span>
              <span className="text-sm font-medium">{dataQualityScore}%</span>
            </div>
            <Progress value={dataQualityScore} className="h-2" />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Enrichment Sources</h4>
            {enrichmentSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {source.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="text-sm">{source.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {source.confidence > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(source.confidence * 100)}% confidence
                    </span>
                  )}
                  <Badge 
                    variant={source.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {source.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiRecommendations.map((recommendation, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${getRecommendationColor(recommendation.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getRecommendationIcon(recommendation.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{recommendation.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {recommendation.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">
                      💡 {recommendation.action}
                    </span>
                    <Button variant="ghost" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Sources & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Data Sources & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Data collected from:</strong> Public company records, LinkedIn profiles, 
              company websites, and industry databases.
            </p>
            <p className="mb-2">
              <strong>Last updated:</strong> {lead.lastEnrichedAt ? 
                new Date(lead.lastEnrichedAt).toLocaleDateString() : 
                'Recently'
              }
            </p>
            <p>
              <strong>Compliance:</strong> All data collection follows GDPR, CCPA, and industry 
              best practices for data privacy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}