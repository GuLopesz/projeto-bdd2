import React from "react";
import { FaRegComment, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Trash2, User } from "lucide-react";
import { getInitial, getAvatarColor } from "@/lib/avatar-fallback";

type QuestionProps = {
  questionId: number;
  authorName?: string;
  authorAvatarUrl?: string;
  avatarColorKey?: string;
  content: string;
  timestamp: string;
  subjectName?: string; 
  replyCount: number;
  isAnonymous: boolean;
  onClick?: () => void;
  onReplyClick?: (e: React.MouseEvent) => void;
  onDeleteClick?: (id: number) => void;
};

const QuestionAvatar = ({ isAnonymous, authorName, colorKey }: { isAnonymous: boolean, authorName?: string, colorKey?: string }) => {
  
  if (isAnonymous) {
    return (
      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
        <User className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  const displayName = authorName || "Usuário";
  const nameForColor = colorKey || displayName; 

  const fallbackInitial = getInitial(nameForColor);
  const fallbackColor = getAvatarColor(nameForColor);

  return (
    <div 
      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm"
      style={{ backgroundColor: fallbackColor }}
      title={displayName}
    >
      {fallbackInitial}
    </div>
  );
};

export default function QuestionCard({
  questionId,
  authorName,
  authorAvatarUrl,
  avatarColorKey,
  content,
  timestamp,
  subjectName,
  replyCount,
  isAnonymous,
  onClick,
  onReplyClick,
  onDeleteClick,
}: QuestionProps) {

  const displayName = isAnonymous ? "Anônimo" : (authorName || "Usuário");

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick && confirm("Tem certeza que deseja apagar esta pergunta?")) {
      onDeleteClick(questionId);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative flex space-x-4 p-4 border-b border-neutral-800 cursor-pointer transition-colors duration-200 hover:bg-neutral-900/50 group"
    >
       {onDeleteClick && (
        <button 
            onClick={handleDelete}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2 z-10"
            title="Apagar pergunta"
        >
            <Trash2 className="w-4 h-4" />
        </button>
       )}

      <div className="flex-shrink-0">
        <QuestionAvatar 
            isAnonymous={isAnonymous} 
            authorName={authorName} 
            colorKey={avatarColorKey}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <span className="font-bold text-white truncate">{displayName}</span>
          </div>
          {subjectName && (
            <span className="text-xs bg-gray-700 text-neutral-300 px-2 py-1 rounded-full font-medium">
              {subjectName}
            </span>
          )}
        </div>

        <p className="mt-1 text-neutral-200 whitespace-pre-wrap">
          {content}
        </p>

        <div className="flex items-center justify-between mt-4 text-neutral-500">
          <span className="text-sm">{timestamp}</span>

          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 group/btn" onClick={onReplyClick}>
              <button className="p-2 rounded-full group-hover/btn:bg-blue-900/50">
                <FaRegComment className="group-hover/btn:text-blue-500" />
              </button>
              <span className="group-hover/btn:text-blue-500 text-sm">{replyCount > 0 ? replyCount : ""}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}