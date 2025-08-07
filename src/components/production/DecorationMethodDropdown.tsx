import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DecorationMethod } from "./PrintavoPowerScheduler";

interface DecorationMethodDropdownProps {
  selectedMethod: DecorationMethod;
  onMethodChange: (method: DecorationMethod) => void;
}

const decorationMethods = [
  { value: 'screen_printing', label: 'Screen Printing' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'dtf', label: 'DTF' },
  { value: 'dtg', label: 'DTG' },
] as const;

export function DecorationMethodDropdown({ selectedMethod, onMethodChange }: DecorationMethodDropdownProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-foreground whitespace-nowrap">
        Decoration Method:
      </label>
      <Select value={selectedMethod} onValueChange={(value) => onMethodChange(value as DecorationMethod)}>
        <SelectTrigger className="w-48 bg-background border-border">
          <SelectValue placeholder="Select method" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border z-50">
          {decorationMethods.map((method) => (
            <SelectItem 
              key={method.value} 
              value={method.value}
              className="hover:bg-muted focus:bg-muted"
            >
              {method.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}