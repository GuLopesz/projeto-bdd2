import React from "react";
import { FaRegComment, FaBookmark, FaRegBookmark } from "react-icons/fa";

type QuestionProps = {

  authorName?: string;
  authorAvatarUrl?: string;

  content: string;
  timestamp: string;

  replyCount: number;
  saveCount: number;
  isSaved?: boolean;

  isAnonymous: boolean;

  onClick?: () => void;
  onReplyClick?: (e: React.MouseEvent) => void;
  onSaveClick?: (e: React.MouseEvent) => void;
};

const ANONYMOUS_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2EwYTBiYiI+PHBhdGggZD0iTTEyIDJDNi44OCAyIDIgNi44OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuMzMgMC00LjMyLTEuMDYtNS42OC0yLjczLjc2LTEuNDcgMi41OS0yLjQyIDQuNjgtMi40MiAxLjggMCAzLjQzLjc3IDQuNDcgMi4wNUwxNi45MyAxNmMtMS4yMS0uOTQtMi42My0xLjUtNC4yMy0xLjUtMS4xIDAtMi4xMS4yOS0yLjk5Ljc1QzEwLjQyIDE0LjU2IDEwIDE1LjI0IDEwIDE2YzAgLjg4LjU0IDEuNjIgMS4zMiAyLjA0LjQ1LjI0Ljk2LjM5IDEuNS40Ni4yOC4wNCAuNTYuMDYuODQuMDYuMjkgMCAuNTctLjAyLjg1LS4wNy40NC0uMDggLjg0LS4yMyAxLjIxLS40NS4zOS0uMjIuNzMtLjUzIDEuMDItLjg5LjQ3LS41Ny43Ni0xLjI4Ljc2LTIuMDggMC0xLjM4LTEuMTItMi41LTIuNS0yLjVTOS41IDEyLjYyIDkuNSAxNGMwIC41NS40NSAxIDEgMXMuNS0uNDUgMS0xem0tMy41LTQuNWMuODMgMCAxLjUtLjY3IDEuNS0xLjVzLS42Ny0xLjUtMS41LTEuNS0xLjUuNjctMS41IDEuNS42NyAxLjUgMS41IDEuNXptNyAwYy44MyAwIDEuNS0uNjcgMS41LTEuNXMtLjY3LTEuNS0xLjEtMS41LTEuNS42Ny0xLjUgMS41LjY3IDEuNSAxLjUgMS41eiIvPjwvc3ZnPg==";

export default function QuestionCard({
  authorName,
  authorAvatarUrl,
  content,
  timestamp,
  replyCount,
  saveCount,
  isSaved = false,
  isAnonymous,
  onClick,
  onReplyClick,
  onSaveClick,
}: QuestionProps) {

  const displayName = isAnonymous ? "Anônimo" : authorName;
  const displayAvatar = isAnonymous ? ANONYMOUS_AVATAR : authorAvatarUrl;

  return (
    <div
      onClick={onClick}
      className="flex space-x-4 p-4 border-b border-neutral-800 cursor-pointer transition-colors duration-200 hover:bg-neutral-900/50"
    >

      <div className="flex-shrink-0">
        <img
          src={displayAvatar}
          alt={`Avatar de ${displayName}`}
          className="w-12 h-12 rounded-full object-cover bg-neutral-700"
        />
      </div>


      <div className="flex-1">

        <div className="flex items-center space-x-2 text-sm text-neutral-500">
          <span className="font-bold text-white truncate">{displayName}</span>
          <span>·</span>
          <span>{timestamp}</span>
        </div>


        <p className="mt-1 text-neutral-200 whitespace-pre-wrap">
          {content}
        </p>


        <div className="flex items-center space-x-8 mt-4 text-neutral-500">

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
  );
}