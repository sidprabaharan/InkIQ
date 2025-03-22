
import React from 'react';

export const PrintStyles: React.FC = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @media print {
      @page {
        size: 4in 6in;
        margin: 0;
      }
      
      body {
        background-color: white !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .print\\:hidden {
        display: none !important;
      }
      
      /* Hide everything except the box label when printing */
      body > *:not(#boxLabel) {
        display: none !important;
      }
      
      #boxLabel {
        position: absolute;
        top: 0;
        left: 0;
        width: 4in !important;
        height: 6in !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }
  `}} />
);
