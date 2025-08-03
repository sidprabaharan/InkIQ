import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, Download } from 'lucide-react';
import { ImprintDetails } from './OrderBreakdown';

interface ImprintDetailsSectionProps {
  imprintDetails: ImprintDetails;
}

export function ImprintDetailsSection({ imprintDetails }: ImprintDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-base">Imprint Details</h4>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Imprint Specifications */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Print Method:</span>
              <div className="font-medium">{imprintDetails.printMethod}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Logo Placement:</span>
              <div className="font-medium">{imprintDetails.logoPlacement}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Logo Size:</span>
              <div className="font-medium">{imprintDetails.logoSize}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Logo Colors:</span>
              <div className="flex gap-1 mt-1">
                {imprintDetails.logoColors.map((color, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Imprint Files */}
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Imprint Files</div>
          <div className="space-y-2">
            {imprintDetails.files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{file.type}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}