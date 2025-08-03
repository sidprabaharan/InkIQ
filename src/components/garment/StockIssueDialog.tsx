import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GarmentIssueType, GarmentIssue } from '@/types/garment';

interface StockIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (issue: Omit<GarmentIssue, 'id' | 'reportedDate'>) => void;
  maxQuantity: number;
}

const ISSUE_TYPES: { value: GarmentIssueType; label: string }[] = [
  { value: 'damaged', label: 'Damaged Items' },
  { value: 'missing', label: 'Missing Items' },
  { value: 'quality_issue', label: 'Quality Issue' },
  { value: 'delayed', label: 'Delayed Delivery' },
  { value: 'incorrect_item', label: 'Incorrect Item' },
  { value: 'size_issue', label: 'Size Issue' },
];

const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low', description: 'Minor issue, low impact' },
  { value: 'medium', label: 'Medium', description: 'Moderate impact' },
  { value: 'high', label: 'High', description: 'Critical issue, high impact' },
] as const;

export function StockIssueDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  maxQuantity 
}: StockIssueDialogProps) {
  const [issueType, setIssueType] = useState<GarmentIssueType>('damaged');
  const [description, setDescription] = useState('');
  const [affectedQuantity, setAffectedQuantity] = useState<number>(1);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!description.trim() || affectedQuantity <= 0) return;

    onSubmit({
      type: issueType,
      description: description.trim(),
      affectedQuantity,
      severity,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setDescription('');
    setAffectedQuantity(1);
    setSeverity('medium');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Stock Issue</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="issue-type">Issue Type</Label>
            <Select value={issueType} onValueChange={(value: GarmentIssueType) => setIssueType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Affected Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={affectedQuantity}
              onChange={(e) => setAffectedQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select value={severity} onValueChange={(value: 'low' | 'medium' | 'high') => setSeverity(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!description.trim() || affectedQuantity <= 0}
          >
            Report Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}