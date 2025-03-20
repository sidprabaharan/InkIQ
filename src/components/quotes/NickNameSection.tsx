
import React from "react";
import { Input } from "@/components/ui/input";

export function NickNameSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Nick Name</h3>
      <Input placeholder="Add a new Nick Name" />
    </div>
  );
}
