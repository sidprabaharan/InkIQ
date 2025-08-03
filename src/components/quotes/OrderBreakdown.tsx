import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineItemGroup } from './LineItemGroup';

export interface ImprintFile {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface ImprintDetails {
  printMethod: string;
  logoPlacement: string;
  logoSize: string;
  logoColors: string[];
  files: ImprintFile[];
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  sizes: {
    [size: string]: number;
  };
  unitPrice: number;
  totalQuantity: number;
  totalPrice: number;
  mockupImage: string;
  status: string;
}

export interface LineItemGroupData {
  id: string;
  title: string;
  products: ProductItem[];
  imprintDetails: ImprintDetails;
}

interface OrderBreakdownProps {
  groups: LineItemGroupData[];
}

export function OrderBreakdown({ groups }: OrderBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {groups.map((group, index) => (
          <LineItemGroup 
            key={group.id} 
            group={group} 
            groupNumber={index + 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}