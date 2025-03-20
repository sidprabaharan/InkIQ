
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  title: string;
  placeholder?: string;
}

export function NotesSection({ title, placeholder = "Write text here ..." }: NotesSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">{title}</h3>
      <Textarea 
        placeholder={placeholder} 
        className="min-h-[160px]" // Increased height from 60px to 160px
      />
    </div>
  );
}
