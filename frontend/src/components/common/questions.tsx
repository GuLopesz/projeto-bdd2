import React from "react";
import { FaRegComment, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { getInitial, getAvatarColor } from "@/utils/avatar-fallback";

type QuestionProps = {
  authorName?: string;
  authorAvatarUrl?: string;
  content: string;
  timestamp: string;
  subjectName?: string; 
  replyCount: number;
  saveCount: number;
  isSaved?: boolean;
  isAnonymous: boolean;
  onClick?: () => void;
  onReplyClick?: (e: React.MouseEvent) => void;
  onSaveClick?: (e: React.MouseEvent) => void;
};

const ANONYMOUS_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYTBiYiI+PHBhdGggZD0iTTEyIDJDNi44OCAyIDIgNi44OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC44OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuMzMgMC00LjMyLTEuMDYtNS42OC0yLjczLjc2LTEuNDcgMi41OS0yLjQyIDQuNjgtMi40MiAxLjggMCAzLjQzLjc3IDQuNDcgMi4wNUwxNi45MyAxNmMtMS4yMS0uOTQtMi42My0xLjUtNC4yMy0xLjUtMS4xIDAtMi4xMS4yOS0yLjk5Ljc1QzEwLjQyIDE0LjU2IDEwIDE1LjI0IDEwIDE2YzAgLjg4LjU0IDEuNjIgMS4zMiAyLjA0LjQ1LjI0Ljk2LjM5IDEuNS40Ni4yOC4wNCAuNTYuMDYuODQuMDYuMjkgMCAuNTctLjAyLjg1LS4wNy40NC0uMDggLjg0LS4yMyAxLjIxLS40NS4zOS0uMjIuNzMtLjUzIDEuMDItLjg5LjQ3LS41Ny43Ni0xLjI4Ljc2LTIuMDggMC0xLjM4LTEuMTItMi41LTIuNS0yLjVTOS41IDEyLjYyIDkuNSAxNGMwIC41NS40NSAxIDEgMXMuNS0uNDUgMS0xem0tMy41LTQuNWMuODMgMCAxLjUtLjY3IDEuNS0xLjVzLS42Ny0xLjUtMS41LTEuNS0xLjUuNjctMS41IDEuNS42NyAxLjUgMS41IDEuNXptNyAwYy44MyAwIDEuNS0uNjcgMS41LTEuNXMtLjY3LTEuNS0xLjEtMS41LTEuNS42Ny0xLjUgMS41LjYyIDEuNSAxLjUgMS41eiIvPjwvc3ZnPg==";

const QuestionAvatar = ({ isAnonymous, authorAvatarUrl, authorName }: 
  Pick<QuestionProps, 'isAnonymous' | 'authorAvatarUrl' | 'authorName'>
) => {
  const displayName = isAnonymous ? "Anônimo" : (authorName || "Usuário");

  if (isAnonymous) {
    return (
      <img
        src={ANONYMOUS_AVATAR}
        alt="Avatar Anônimo"
        className="w-12 h-12 rounded-full object-cover bg-neutral-700"
      />
    );
  }

  if (authorAvatarUrl && authorAvatarUrl.startsWith('http')) {
    return (
      <img
        src={authorAvatarUrl}
        alt={`Avatar de ${displayName}`}
        className="w-12 h-12 rounded-full object-cover bg-neutral-700"
      />
    );
  }

  const fallbackInitial = getInitial(displayName);
  const fallbackColor = getAvatarColor(displayName);

  return (
    <div 
      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
      style={{ backgroundColor: fallbackColor }}
      title={displayName}
    >
      {fallbackInitial}
    </div>
  );
};


export default function QuestionCard({
  authorName,
  authorAvatarUrl,
  content,
  timestamp,
  subjectName,
  replyCount,
  saveCount,
  isSaved = false,
  isAnonymous,
  onClick,
  onReplyClick,
  onSaveClick,
}: QuestionProps) {

  const displayName = isAnonymous ? "Anônimo" : (authorName || "Usuário");

  return (
    <div
      onClick={onClick}
      className="flex space-x-4 p-4 border-b border-neutral-800 cursor-pointer transition-colors duration-200 hover:bg-neutral-900/50"
    >
      <div className="flex-shrink-0">
        <QuestionAvatar 
          isAnonymous={isAnonymous} 
          authorAvatarUrl={authorAvatarUrl} 
          authorName={authorName} 
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
            <div className="flex items-center space-x-2 group" onClick={onReplyClick}>
              <button className="p-2 rounded-full group-hover:bg-blue-900/50">
                <FaRegComment className="group-hover:text-blue-500" />
              </button>
              <span className="group-hover:text-blue-500 text-sm">{replyCount > 0 ? replyCount : ""}</span>
            </div>

            <div className="flex items-center space-x-2 group" onClick={onSaveClick}>
              <button className="p-2 rounded-full group-hover:bg-yellow-900/50">
                {isSaved ? (
                  <FaBookmark className="text-yellow-500" />
                ) : (
                  <FaRegBookmark className="group-hover:text-yellow-500" />
                )}
              </button>
              <span className={`text-sm ${isSaved ? 'text-yellow-500' : 'group-hover:text-yellow-500'}`}>
                {saveCount > 0 ? saveCount : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}