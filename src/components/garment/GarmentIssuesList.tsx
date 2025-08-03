import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GarmentIssue } from '@/types/garment';

interface GarmentIssuesListProps {
  issues: GarmentIssue[];
  className?: string;
}

export function GarmentIssuesList({ issues, className = '' }: GarmentIssuesListProps) {
  if (issues.length === 0) return null;

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

  return (
    <div className={`space-y-2 ${className}`}>
      <h5 className="font-medium text-sm text-red-600">Stock Issues ({issues.length})</h5>
      {issues.map((issue) => (
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
            <span className="text-xs text-muted-foreground">
              {new Date(issue.reportedDate).toLocaleDateString()}
            </span>
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
    </div>
  );
}