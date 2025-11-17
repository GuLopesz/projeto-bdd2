import React from "react";

interface ReplyFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function ReplyForm({ value, onChange, onSubmit }: ReplyFormProps) {
  return (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva sua resposta aqui..."
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        rows={2}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="bg-primary text-primary-foreground text-xs px-3 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Responder
        </button>
      </div>
    </div>
  );
}