
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NewQuote() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create Quote</h1>
        <Button 
          variant="outline"
          onClick={() => navigate("/quotes")}
        >
          Cancel
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <div className="h-10 p-2 border rounded-md flex items-center justify-between">
                <span className="text-gray-500">Select Customer</span>
                <span className="text-blue-500">+</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quote Name</label>
              <input 
                type="text" 
                className="h-10 p-2 w-full border rounded-md" 
                placeholder="Enter quote name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">VAT %</label>
              <input 
                type="text" 
                className="h-10 p-2 w-full border rounded-md" 
                placeholder="0.00%"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Fee</label>
              <input 
                type="text" 
                className="h-10 p-2 w-full border rounded-md" 
                placeholder="$0.00"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Person</label>
              <div className="h-10 p-2 border rounded-md flex items-center justify-between">
                <span className="text-gray-500">Select salesperson</span>
                <span>▼</span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input 
                type="date" 
                className="h-10 p-2 w-full border rounded-md" 
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-600">VAT (0%)</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-base font-semibold">Total</span>
                <span className="text-base font-semibold">$0.00</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea 
                className="p-2 w-full border rounded-md" 
                rows={4}
                placeholder="Add note"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate("/quotes")}>
            Cancel
          </Button>
          <Button className="bg-inkiq-primary hover:bg-inkiq-primary/90">
            Save Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
