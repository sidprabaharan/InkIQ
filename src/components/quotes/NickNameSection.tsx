
import React from "react";
import { Input } from "@/components/ui/input";

interface NickNameSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function NickNameSection({ value, onChange }: NickNameSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Nick Name</h3>
      <Input 
        placeholder="Add a new Nick Name" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
