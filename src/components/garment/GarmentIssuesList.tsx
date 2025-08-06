import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GarmentIssue } from '@/types/garment';
import { CheckCircle, X } from 'lucide-react';

interface GarmentIssuesListProps {
  issues: GarmentIssue[];
  onResolveIssue?: (issueId: string) => void;
  onRemoveIssue?: (issueId: string) => void;
  showResolved?: boolean;
  className?: string;
}

export function GarmentIssuesList({ 
  issues, 
  onResolveIssue, 
  onRemoveIssue, 
  showResolved = true, 
  className = '' 
}: GarmentIssuesListProps) {
  const filteredIssues = showResolved ? issues : issues.filter(issue => !issue.resolvedDate);
  
  if (filteredIssues.length === 0) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueTypeLabel = (type: string) => {
    switch (type) {
      case 'damaged':
        return 'Damaged';
      case 'missing':
        return 'Missing';
      case 'quality_issue':
        return 'Quality Issue';
      case 'delayed':
        return 'Delayed';
      case 'incorrect_item':
        return 'Incorrect Item';
      case 'size_issue':
        return 'Size Issue';
      default:
        return type;
    }
  };

  const activeIssues = filteredIssues.filter(issue => !issue.resolvedDate);
  const resolvedIssues = filteredIssues.filter(issue => issue.resolvedDate);

  return (
    <div className={`space-y-2 ${className}`}>
      {activeIssues.length > 0 && (
        <>
          <h5 className="font-medium text-sm text-red-600">Active Stock Issues ({activeIssues.length})</h5>
          {activeIssues.map((issue) => (
            <div key={issue.id} className="border-l-4 border-red-400 bg-red-50 p-3 rounded-r">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                    {getIssueTypeLabel(issue.type)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {issue.severity} severity
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(issue.reportedDate).toLocaleDateString()}
                  </span>
                  {onResolveIssue && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onResolveIssue(issue.id)}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                      title="Mark as resolved"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  {onRemoveIssue && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveIssue(issue.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                      title="Remove issue"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-1">{issue.description}</p>
              <div className="text-xs text-muted-foreground">
                Affected Quantity: {issue.affectedQuantity}
              </div>
              {issue.notes && (
                <div className="text-xs text-muted-foreground mt-1">
                  Notes: {issue.notes}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {showResolved && resolvedIssues.length > 0 && (
        <>
          <h5 className="font-medium text-sm text-green-600 mt-4">Resolved Issues ({resolvedIssues.length})</h5>
          {resolvedIssues.map((issue) => (
            <div key={issue.id} className="border-l-4 border-green-400 bg-green-50 p-3 rounded-r opacity-75">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {getIssueTypeLabel(issue.type)} - Resolved
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    Resolved: {issue.resolvedDate && new Date(issue.resolvedDate).toLocaleDateString()}
                  </span>
                  {onRemoveIssue && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveIssue(issue.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                      title="Remove issue"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-1">{issue.description}</p>
              <div className="text-xs text-muted-foreground">
                Affected Quantity: {issue.affectedQuantity}
              </div>
              {issue.notes && (
                <div className="text-xs text-muted-foreground mt-1">
                  Notes: {issue.notes}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}