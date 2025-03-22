
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PrintStyles } from '@/components/layout/PrintStyles';

interface BoxLabelProps {
  customer: {
    name: string;
    companyName: string;
  };
  orderInfo: {
    nickname: string;
    poNumber: string;
    orderNumber: string;
    boxNumber: number;
    totalBoxes: number;
  };
  workOrderUrl: string;
}

export const BoxLabel: React.FC<BoxLabelProps> = ({ customer, orderInfo, workOrderUrl }) => {
  return (
    <div className="box-label bg-white p-4" style={{ width: '4in', height: '6in', position: 'relative' }}>
      <div className="flex flex-col h-full justify-between">
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold">{customer.companyName}</h2>
          <p className="text-md">{customer.name}</p>
        </div>
        
        <div className="space-y-2 text-center mb-2">
          <p className="font-semibold">{orderInfo.nickname}</p>
          <p>PO: {orderInfo.poNumber}</p>
          <p>Order #: {orderInfo.orderNumber}</p>
          <div className="text-lg font-bold mt-2">
            Box {orderInfo.boxNumber} of {orderInfo.totalBoxes}
          </div>
        </div>
        
        <div className="flex justify-center items-center mb-2">
          <QRCodeSVG 
            value={workOrderUrl} 
            size={150}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <div className="text-center text-sm mt-2">
          <p>Scan QR code to access the work order</p>
        </div>
      </div>
      
      <PrintStyles />
    </div>
  );
};
