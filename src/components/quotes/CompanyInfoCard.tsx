
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
  taxNumbers?: {
    gst?: string;
    qst?: string;
  };
}

interface CompanyInfoCardProps {
  company: CompanyInfo;
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  // Format phone number as "+1 (XXX) XXX-XXXX"
  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format the phone number
    if (digits.length === 10) {
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    // Return original if not a standard 10-digit number
    return phone;
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      {company.logo && (
        <div className="mb-4 flex justify-center">
          <img 
            src={company.logo} 
            alt={`${company.name} logo`} 
            className="h-24 object-contain"
          />
        </div>
      )}
      <h2 className="text-lg font-semibold mb-3">{company.name}</h2>
      <div className="space-y-1 text-gray-700">
        <p>{company.address}</p>
        <p>{company.city}, {company.region}</p>
        <p>{company.postalCode}</p>
        <p>{formatPhoneNumber(company.phone)}</p>
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
        {company.taxNumbers && (
          <>
            {company.taxNumbers.gst && (
              <p>GST: {company.taxNumbers.gst}</p>
            )}
            {company.taxNumbers.qst && (
              <p>QST: {company.taxNumbers.qst}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
