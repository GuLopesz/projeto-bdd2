"use client";

import React, { useState } from "react";

type SubjectProps = {
  subjects: string[];
  onSelect?: (subject: string) => void;
};

export default function Subjects({ subjects, onSelect }: SubjectProps) {
  const [activeSubject, setActiveSubject] = useState<string>(subjects[0]);

  const handleSelect = (subject: string) => {
    setActiveSubject(subject);
    onSelect?.(subject);
  };

  return (
    <div>
      <h2 className="text-sm font-bold uppercase text-neutral-400 tracking-wider px-3 mb-4">
        Disciplinas
      </h2>
      <ul className="space-y-1">
        {subjects.map((subject) => (
          <li key={subject}>
            <button
              onClick={() => handleSelect(subject)}
              className={`flex items-center w-full text-left p-3 rounded-lg transition-colors duration-200 relative ${
                subject === activeSubject
                  ? "bg-neutral-800 text-white font-semibold"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
                
              {subject === activeSubject && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full" />
              )}
              {subject}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}