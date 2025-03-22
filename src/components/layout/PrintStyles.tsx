
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
        margin: 0 !important;
        padding: 0 !important;
        width: 4in !important;
        height: 6in !important;
      }
      
      .print\\:hidden {
        display: none !important;
      }
      
      /* Hide everything except the box label when printing */
      body > *:not(.box-label-container) {
        display: none !important;
      }
      
      .box-label-container {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 4in !important;
        height: 6in !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }
    }
  `}} />
);
