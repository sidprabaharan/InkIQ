import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusDropdown } from "./StatusDropdown";
import { ProductItem } from "./OrderBreakdown";
import { 
  Package, 
  Palette, 
  DollarSign, 
  Hash,
  Eye,
  Edit
} from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
  onStatusChange: (productId: string, newStatus: string) => void;
  onViewDetails?: (productId: string) => void;
  onEdit?: (productId: string) => void;
}

export function ProductCard({ 
  product, 
  onStatusChange, 
  onViewDetails, 
  onEdit 
}: ProductCardProps) {
  const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;
  
  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "pending": "bg-yellow-100 text-yellow-800",
      "ordered": "bg-blue-100 text-blue-800",
      "received": "bg-green-100 text-green-800",
      "cancelled": "bg-red-100 text-red-800",
      "in production": "bg-purple-100 text-purple-800",
      "complete": "bg-green-100 text-green-800",
      "artwork pending": "bg-yellow-100 text-yellow-800",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const totalQuantity = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{product.description}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  #{product.itemNumber}
                </span>
                <span className="text-sm text-muted-foreground">
                  {product.color}
                </span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(product.status)}>
            {product.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Images */}
        {product.mockupImages.length > 0 && (
          <div className="flex gap-2 mb-4">
            {product.mockupImages.map((image, index) => (
              <div key={index} className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                <img 
                  src={image} 
                  alt={`${product.description} mockup ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Size Breakdown */}
        <div className="bg-muted/30 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Size Breakdown
          </h4>
          <div className="grid grid-cols-4 gap-2 text-sm">
            {Object.entries(product.sizes).map(([size, quantity]) => (
              quantity > 0 && (
                <div key={size} className="flex justify-between bg-background rounded px-2 py-1">
                  <span className="font-medium uppercase">{size}:</span>
                  <span>{quantity}</span>
                </div>
              )
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="flex justify-between font-medium">
              <span>Total Quantity:</span>
              <span>{totalQuantity}</span>
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="bg-muted/30 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Unit Price:</span>
              <span>{formatPrice(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{product.tax ? 'Included' : 'Exempt'}</span>
            </div>
            <div className="flex justify-between font-medium pt-1 border-t border-border/50">
              <span>Total:</span>
              <span>{formatPrice(product.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <StatusDropdown 
            currentStatus={product.status}
            onStatusChange={(newStatus) => onStatusChange(product.id, newStatus)}
          />
          
          <div className="flex gap-2">
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(product.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(product.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}