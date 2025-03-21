
import React from 'react';

interface CompanyInfo {
  name: string;
  logo?: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  website: string;
  email: string;
}

interface CompanyInfoCardProps {
  company: CompanyInfo;
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-3">{company.name}</h2>
      <div className="space-y-1 text-gray-700">
        <p>{company.address}</p>
        <p>{company.city}, {company.region} {company.postalCode}</p>
        <p>{company.phone}</p>
        <p>
          <a href={company.website} className="text-blue-600 hover:underline">
            {company.website}
          </a>
        </p>
        <p>
          <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
            {company.email}
          </a>
        </p>
      </div>
    </div>
  );
}
