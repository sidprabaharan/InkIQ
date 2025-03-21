
import React from 'react';

interface NotesCardProps {
  title: string;
  content: string;
}

export function NotesCard({ title, content }: NotesCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-medium mb-4">{title}</h3>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
}
