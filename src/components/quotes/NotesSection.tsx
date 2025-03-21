
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  title: string;
  placeholder?: string;
  initialContent?: string;
  onChange?: (value: string) => void;
}

export function NotesSection({ 
  title, 
  placeholder = "Write text here ...", 
  initialContent = "", 
  onChange 
}: NotesSectionProps) {
  const [content, setContent] = useState(initialContent);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">{title}</h3>
      <Textarea 
        placeholder={placeholder} 
        className="min-h-[100px]"
        value={content}
        onChange={handleChange}
      />
    </div>
  );
}
