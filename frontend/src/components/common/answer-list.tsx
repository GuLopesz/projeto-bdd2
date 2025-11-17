import React from "react";
import { BadgeCheck } from "lucide-react";
import { Answer } from "@/lib";
import { formatRelativeTime } from "@/lib/format-date";
import { getInitial, getAvatarColor } from "@/lib/avatar-fallback";

interface AnswerListProps {
  answers: Answer[];
  isLoading: boolean;
}

export default function AnswerList({ answers, isLoading }: AnswerListProps) {
  if (isLoading) {
    return <p className="text-sm text-gray-500 mb-4">Carregando respostas...</p>;
  }

  if (answers.length === 0) {
    return <p className="text-sm text-gray-500 italic mb-4">Seja o primeiro a responder!</p>;
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      {answers.map((ans) => {
        const isProfessor = ans.author_name.includes("(Professor)");
        const cleanName = ans.author_name
          .replace(" (Professor)", "")
          .replace(" (Aluno)", "");

        const initial = getInitial(cleanName);
        const color = getAvatarColor(cleanName);

        return (
          <div key={ans.id} className="bg-gray-800/50 p-3 rounded-md border border-gray-700 flex gap-3">
            {/*avatar*/}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ backgroundColor: color }}
              title={cleanName}
            >
              {initial}
            </div>

            {/*conteudo*/}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-300">{cleanName}</span>
                  {isProfessor && (
                    <BadgeCheck className="w-4 h-4 text-blue-500" aria-label="Professor Verificado" />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(ans.answer_date)}
                </span>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {ans.answer_body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}