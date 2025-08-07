
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the schema for the tax info form
const taxInfoSchema = z.object({
  taxId: z.string(),
  taxRate: z.string(),
  taxExemptionNumber: z.string(),
});

export type TaxInfoFormValues = z.infer<typeof taxInfoSchema>;

interface EditTaxInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTaxInfo: (data: TaxInfoFormValues) => void;
  taxInfo: {
    taxId: string;
    taxRate: string;
    taxExemptionNumber: string;
  };
}

export function EditTaxInfoDialog({ 
  open, 
  onOpenChange,
  onUpdateTaxInfo,
  taxInfo
}: EditTaxInfoDialogProps) {
  const form = useForm<TaxInfoFormValues>({
    resolver: zodResolver(taxInfoSchema),
    defaultValues: {
      taxId: taxInfo.taxId,
      taxRate: taxInfo.taxRate,
      taxExemptionNumber: taxInfo.taxExemptionNumber,
    },
  });

  const handleSubmit = (data: TaxInfoFormValues) => {
    onUpdateTaxInfo(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Tax Information</DialogTitle>
          <DialogDescription>
            Update the tax details for this customer.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax rate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="taxExemptionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Exemption Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax exemption number (if applicable)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
