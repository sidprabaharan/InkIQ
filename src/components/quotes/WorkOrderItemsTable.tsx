
import React from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  sku?: string;
  imprintDetails?: {
    locations: string[];
    colors: string[];
    artwork?: string;
  };
  productImage?: string;
}

interface WorkOrderItemsTableProps {
  items: Item[];
}

export function WorkOrderItemsTable({ items }: WorkOrderItemsTableProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="font-medium">Line Items</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imprint Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {item.productImage && (
                      <div className="flex-shrink-0 h-10 w-10 mr-4">
                        <img className="h-10 w-10 object-cover" src={item.productImage} alt="" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{item.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{item.sku || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{item.quantity}</div>
                </td>
                <td className="px-6 py-4">
                  {item.imprintDetails ? (
                    <div className="text-sm text-gray-900">
                      <div>Locations: {item.imprintDetails.locations.join(', ')}</div>
                      <div>Colors: {item.imprintDetails.colors.join(', ')}</div>
                      {item.imprintDetails.artwork && (
                        <div>Artwork: {item.imprintDetails.artwork}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No imprint details</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
