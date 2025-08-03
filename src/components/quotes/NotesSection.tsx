
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  title: string;
  placeholder?: string;
  initialValue?: string;
}

export function NotesSection({ title, placeholder = "Write text here ...", initialValue }: NotesSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">{title}</h3>
      <Textarea 
        placeholder={placeholder} 
        defaultValue={initialValue}
        className="min-h-[100px]" // Adjusted height from 80px to 100px
      />
    </div>
  );
}
