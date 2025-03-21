
import React from 'react';

interface CustomerInfo {
  name?: string;
  company: string;
  contact: string;
  address: string;
  unit?: string;
  city: string;
  region: string;
  postalCode?: string;
  phone?: string;
  email?: string;
}

interface CustomerInfoCardProps {
  title: string;
  customerInfo: CustomerInfo;
}

export function CustomerInfoCard({ title, customerInfo }: CustomerInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-medium mb-4">{title}</h3>
      <div>
        {customerInfo.name && <p className="font-medium">{customerInfo.name}</p>}
        <p>{customerInfo.company}</p>
        <p>{customerInfo.contact}</p>
        <p>{customerInfo.address}</p>
        {customerInfo.unit && <p>{customerInfo.unit}</p>}
        <p>
          {customerInfo.city}, {customerInfo.region} {customerInfo.postalCode || ''}
        </p>
        {customerInfo.phone && <p>{customerInfo.phone}</p>}
        {customerInfo.email && <p>{customerInfo.email}</p>}
      </div>
    </div>
  );
}
