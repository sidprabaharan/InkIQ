
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronRight, MoreVertical, Plus, Percent, DollarSign } from "lucide-react";
import { QuotationData } from "./QuoteData";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: QuotationData;
  isEditing?: boolean;
  quoteId?: string;
}

export function QuoteFormDialog({ 
  open, 
  onOpenChange, 
  initialData, 
  isEditing = false,
  quoteId
}: QuoteFormDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize form state with initial data or defaults
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    initialData?.summary?.discount ? 
      initialData.summary.discount.includes('%') ? "percentage" : "fixed" : 
      "percentage"
  );
  
  const [discountValue, setDiscountValue] = useState<string>(
    initialData?.summary?.discount ? 
      initialData.summary.discount.replace(/[^0-9.]/g, '') : 
      ""
  );
  
  const [salesTax, setSalesTax] = useState<string>(
    initialData?.summary?.salesTax ? 
      initialData.summary.salesTax.replace(/[^0-9.]/g, '') : 
      ""
  );

  // Get initial subtotal from data or use default
  const subTotal = initialData?.summary?.subTotal ? 
    parseFloat(initialData.summary.subTotal.replace(/[$,]/g, '')) : 
    1250.00;
  
  const discountAmount = discountValue 
    ? discountType === "percentage" 
      ? (subTotal * parseFloat(discountValue) / 100) 
      : parseFloat(discountValue)
    : 0;
  
  const newSubTotal = subTotal - discountAmount;
  
  const salesTaxAmount = salesTax 
    ? (newSubTotal * parseFloat(salesTax) / 100)
    : 0;
  
  const totalDue = newSubTotal + salesTaxAmount;

  const handleSave = () => {
    // This would save the data in a real application
    const actionText = isEditing ? "updated" : "created";
    const documentType = initialData?.status && !initialData.status.toLowerCase().startsWith('quote') ? 
      "Invoice" : "Quote";
    
    toast({
      title: `${documentType} ${actionText}`,
      description: `${documentType} #${quoteId || "new"} has been ${actionText} successfully.`,
    });
    
    onOpenChange(false);
    
    // If we're creating a new quote, navigate to the quotes page
    if (!isEditing) {
      navigate("/quotes");
    } 
    // If we're editing, we can stay on the current page as it will refresh with new data
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] p-0 h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {initialData?.status && !initialData.status.toLowerCase().startsWith('quote') ? 
                "Invoices" : "Quotes"}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-sm">
              {isEditing ? 
                `Edit ${initialData?.status && !initialData.status.toLowerCase().startsWith('quote') ? 
                  "Invoice" : "Quote"} #${quoteId}` : 
                `Create ${initialData?.status && !initialData.status.toLowerCase().startsWith('quote') ? 
                  "Invoice" : "Quote"}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-500">Cancel</Button>
            </DialogClose>
            <Button variant="outline" className="text-gray-500">Preview</Button>
            <Button className="bg-inkiq-primary hover:bg-inkiq-primary/90" onClick={handleSave}>
              Save & Finish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 p-6">
          <div className="col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Customers</h3>
                <Button variant="outline" className="text-inkiq-primary">New Customer</Button>
              </div>
              <Select defaultValue={initialData?.customer?.billing?.company ? "selected" : undefined}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={initialData?.customer?.billing?.company || "Select A Customer"} />
                </SelectTrigger>
                <SelectContent>
                  {initialData?.customer?.billing?.company && 
                    <SelectItem value="selected">{initialData.customer.billing.company}</SelectItem>}
                  <SelectItem value="customer1">Customer 1</SelectItem>
                  <SelectItem value="customer2">Customer 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Customer Billing</h3>
              <div className="space-y-4">
                <Input placeholder="Company" defaultValue={initialData?.customer?.billing?.company || ""} />
                <Input placeholder="Name" defaultValue={initialData?.customer?.billing?.name || ""} />
                <Input placeholder="Address" defaultValue={initialData?.customer?.billing?.address || ""} />
                <Input placeholder="Address" />
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="State/ Province" defaultValue={initialData?.customer?.billing?.region || ""} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" defaultValue={initialData?.customer?.billing?.city || ""} />
                  <Input placeholder="Zip Code Postal Code" defaultValue={initialData?.customer?.billing?.postalCode || ""} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Customer Shipping Address</h3>
              <div className="space-y-4">
                <Input placeholder="Company" defaultValue={initialData?.customer?.shipping?.company || ""} />
                <Input placeholder="Name" defaultValue={initialData?.customer?.shipping?.contact || ""} />
                <Input placeholder="Address" defaultValue={initialData?.customer?.shipping?.address || ""} />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" defaultValue={initialData?.customer?.shipping?.city || ""} />
                  <Input placeholder="Input text" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Zip Code" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Quote Items</h3>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">XS</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">XL</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">2XL</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">3XL</th>
                      {/* QTY column removed */}
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taxed</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {initialData?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <Select defaultValue={item.category}>
                            <SelectTrigger className="border-0 w-24 p-0 h-8">
                              <SelectValue placeholder={item.category || "Select"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={item.category}>{item.category}</SelectItem>
                              <SelectItem value="category1">Category 1</SelectItem>
                              <SelectItem value="category2">Category 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.itemNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.color}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.xs}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.s}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.m}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.l}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.xl}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.xxl}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.xxxl}</td>
                        {/* QTY cell removed */}
                        <td className="px-4 py-3 text-sm text-gray-500">{item.price}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">
                          <input type="checkbox" className="h-4 w-4" defaultChecked={item.taxed} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.total}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </td>
                      </tr>
                    ))}
                    {(!initialData?.items || initialData.items.length === 0) && (
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <Select>
                            <SelectTrigger className="border-0 w-24 p-0 h-8">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="category1">Category 1</SelectItem>
                              <SelectItem value="category2">Category 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        <td className="px-4 py-3 text-sm text-gray-500"></td>
                        {/* QTY cell removed */}
                        <td className="px-4 py-3 text-sm text-gray-500">$$</td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">
                          <input type="checkbox" className="h-4 w-4" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">$$</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Line Item
                </Button>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Imprint
                </Button>
                <div className="flex-1"></div>
                <Button variant="outline" className="gap-2 ml-auto">
                  <Plus className="h-4 w-4" />
                  Line Item Group
                </Button>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold">
                {initialData?.status && !initialData.status.toLowerCase().startsWith('quote') ? 
                  "Invoice" : "Quotation"}
              </h2>
              <p className="text-sm text-gray-500">#{quoteId || "26048957"}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">
                {initialData?.status && !initialData.status.toLowerCase().startsWith('quote') ? 
                  "Invoice" : "Quotation"} Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select defaultValue={initialData?.details?.owner ? "owner" : undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder={initialData?.details?.owner || "Owner"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">{initialData?.details?.owner}</SelectItem>
                      <SelectItem value="owner1">Owner 1</SelectItem>
                      <SelectItem value="owner2">Owner 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue={initialData?.details?.deliveryMethod ? "delivery" : undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder={initialData?.details?.deliveryMethod || "Delivery Method"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">{initialData?.details?.deliveryMethod}</SelectItem>
                      <SelectItem value="method1">Method 1</SelectItem>
                      <SelectItem value="method2">Method 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="PO Number" />
                <Input placeholder="Created" />
                <Input placeholder="Production Due Date" defaultValue={initialData?.details?.productionDueDate || ""} />
                <Input placeholder="Customer Due Date" />
                <Input placeholder="Payment Due Date" defaultValue={initialData?.details?.paymentDueDate || ""} />
                <Input placeholder="Invoice Date" defaultValue={initialData?.details?.invoiceDate || ""} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Nick Name</h3>
              <Input placeholder="Add a new Nick Name" defaultValue={initialData?.nickname || ""} />
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Customer Notes</h3>
              <Textarea 
                placeholder="Write text here ..." 
                className="min-h-[100px]"
                defaultValue={initialData?.notes?.customer || ""}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Production Note</h3>
              <Textarea 
                placeholder="Write text here ..." 
                className="min-h-[100px]"
                defaultValue={initialData?.notes?.production || ""}
              />
            </div>

            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded-md">
                <h3 className="text-base font-medium text-center">Invoice Summary</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sub Total</span>
                  <span className="text-sm">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Discount</span>
                  <div className="flex items-center gap-2">
                    <ToggleGroup type="single" value={discountType} onValueChange={(value) => value && setDiscountType(value as "percentage" | "fixed")}>
                      <ToggleGroupItem value="percentage" size="sm" className="h-8 w-8 p-0">
                        <Percent className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="fixed" size="sm" className="h-8 w-8 p-0">
                        <DollarSign className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <Input 
                      className="w-16 h-8 text-xs" 
                      placeholder={discountType === "percentage" ? "%" : "$"}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </div>
                </div>
                
                {parseFloat(discountValue) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Sub Total</span>
                    <span className="text-sm">${newSubTotal.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sales Tax</span>
                  <div className="flex items-center">
                    <Input 
                      className="w-16 h-8 text-xs" 
                      placeholder="%" 
                      value={salesTax}
                      onChange={(e) => setSalesTax(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <span>Total Due</span>
                  <span>${totalDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
