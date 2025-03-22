
import React from 'react';

export const PrintStyles: React.FC = () => (
  <style>
    {`
    @media print {
      @page {
        size: auto;
        margin: 0.5cm;
      }
      
      body {
        background-color: white !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .print\\:hidden {
        display: none !important;
      }
    }
    `}
  </style>
);
