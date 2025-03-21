
import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer } from "@/context/CustomersContext";

interface CustomerListProps {
  customers: Customer[];
  filteredCustomers: Customer[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateNew: () => void;
  onSelectCustomer: (customerId: string) => void;
  getIndustryName: (industryId: string) => string;
}

export function CustomerList({
  customers,
  filteredCustomers,
  searchTerm,
  onSearchChange,
  onCreateNew,
  onSelectCustomer,
  getIndustryName
}: CustomerListProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search" 
              className="pl-9 w-[250px]"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button variant="outline">Delete</Button>
          <Button variant="outline">Export</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onCreateNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. of Orders Placed
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales volume
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectCustomer(customer.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded" 
                      onClick={(e) => e.stopPropagation()} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.billingAddress.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.billingAddress.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getIndustryName(customer.industry)}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No customers found. Add a new customer to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div>
              Showing {filteredCustomers.length} of {customers.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={true}>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50">
                1
              </Button>
              <Button variant="outline" size="sm" disabled={true}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
