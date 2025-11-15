"use client";
interface SubjectsProps {
  subjects: string[];
  onSelect: (subjectName: string) => void;
  activeSubject: string | null;
}

export default function Subjects({ subjects, onSelect, activeSubject }: SubjectsProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Disciplinas</h3>
      <ul className="space-y-2">
        
        <li>
          <button
            onClick={() => onSelect(activeSubject || "")}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              !activeSubject
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Todas as Disciplinas
          </button>
        </li>

        {subjects.map((name) => {
          const isActive = activeSubject === name;

          return (
            <li key={name}>
              <button
                onClick={() => onSelect(name)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}