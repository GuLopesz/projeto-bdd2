"use client";

interface NewQuestionCardProps {
  newQuestionContent: string;
  onChangeContent: (value: string) => void;

  subjects: { id: number; subject_name: string }[];
  selectedSubject: string;
  onSelectSubject: (value: string) => void;

  isAnonymous: boolean;
  onToggleAnonymous: (value: boolean) => void;

  onSubmit: () => void;
  disabled: boolean;
}

export default function NewQuestionCard({
  newQuestionContent,
  onChangeContent,
  subjects,
  selectedSubject,
  onSelectSubject,
  isAnonymous,
  onToggleAnonymous,
  onSubmit,
  disabled
}: NewQuestionCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 border border-primary/50">

      <textarea
        className="w-full p-3 bg-gray-700 border border-primary/20 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder="Qual sua dúvida?"
        value={newQuestionContent}
        onChange={(e) => onChangeContent(e.target.value)}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mt-3 gap-4">

        <select
          value={selectedSubject}
          onChange={(e) => onSelectSubject(e.target.value)}
          className="w-full md:w-auto p-2 bg-gray-700 border border-primary/20 rounded-md text-white focus:outline-none"
        >
          <option value="">Selecione uma disciplina...</option>

          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}

        </select>

        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => onToggleAnonymous(e.target.checked)}
            className="h-4 w-4 rounded bg-gray-700 text-primary"
          />
          Perguntar anonimamente
        </label>

        <button
          className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
          onClick={onSubmit}
          disabled={disabled}
        >
          Perguntar
        </button>

      </div>
    </div>
  );
}