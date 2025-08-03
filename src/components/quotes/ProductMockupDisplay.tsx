import React from 'react';

interface ProductMockupDisplayProps {
  image: string;
  productName: string;
}

export function ProductMockupDisplay({ image, productName }: ProductMockupDisplayProps) {
  return (
    <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border">
      <img 
        src={image} 
        alt={`${productName} mockup`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
    </div>
  );
}