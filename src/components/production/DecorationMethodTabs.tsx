import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DecorationMethod } from "./PrintavoPowerScheduler";

interface DecorationMethodTabsProps {
  selectedMethod: DecorationMethod;
  onMethodChange: (method: DecorationMethod) => void;
}

export function DecorationMethodTabs({ selectedMethod, onMethodChange }: DecorationMethodTabsProps) {
  return (
    <div className="border-b border-border bg-background px-6 py-3">
      <Tabs value={selectedMethod} onValueChange={(value) => onMethodChange(value as DecorationMethod)}>
        <TabsList className="grid w-fit grid-cols-4 bg-muted">
          <TabsTrigger value="screen_printing" className="text-sm">
            Screen Printing
          </TabsTrigger>
          <TabsTrigger value="embroidery" className="text-sm">
            Embroidery
          </TabsTrigger>
          <TabsTrigger value="dtf" className="text-sm">
            DTF
          </TabsTrigger>
          <TabsTrigger value="dtg" className="text-sm">
            DTG
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}