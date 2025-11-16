"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header";
import QuestionCard from "@/components/common/questions";
import Subjects from "@/components/common/subjects";
import NewQuestionCard from "@/components/common/new-question-card";

//interface pergunta
interface Question {
  id: number;
  question_body: string;
  question_date: string;
  anonymous: boolean;
  author_details: {
    username: string;
    avatar_url: string;
  };
  reply_count: number;
  save_count: number;
  is_saved: boolean;
  subject_name: string;
}

//interface disciplnas
interface Subject {
  id: number;
  subject_name: string;
}

export default function HomeMainPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const router = useRouter();

  const handleSelectSubject = (subjectName: string) => {
    setActiveFilter(activeFilter === subjectName ? null : subjectName);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/questions/");
        if (!response.ok) throw new Error("Falha ao buscar perguntas.");
        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error("ERRO AO BUSCAR PERGUNTAS:", err);
        setError(err instanceof Error ? err.message : "Um erro ocorreu");
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/subjects/");
        if (!response.ok) throw new Error("Falha ao buscar disciplinas.");

        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (err) {
        console.error("ERRO AO BUSCAR DISCIPLINAS:", err);
      }
    };

    Promise.all([fetchQuestions(), fetchSubjects()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const formatRelativeTime = (isoDateString: string): string => {
    const now = new Date();
    const past = new Date(isoDateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    return past.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const handleSave = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Precisas de estar logado para salvar.");
      router.push("/");
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/questions/${id}/save/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401) {
        alert("Sessão expirada. Faz login novamente.");
        router.push("/");
      }
      if (!response.ok) throw new Error("Falha ao salvar.");

      setQuestions((currentQuestions) =>
        currentQuestions.map((q) => {
          if (q.id === id) {
            const newIsSaved = !q.is_saved;
            const newSaveCount = newIsSaved
              ? q.save_count + 1
              : q.save_count - 1;
            return { ...q, is_saved: newIsSaved, save_count: newSaveCount };
          }
          return q;
        })
      );
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestionContent.trim()) {
      alert("Por favor, escreve a tua dúvida.");
      return;
    }
    if (!selectedSubject) {
      alert("Por favor, seleciona uma disciplina.");
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Precisas de estar logado para perguntar.");
      router.push("/");
      return;
    }
    try {
      const body = {
        question_body: newQuestionContent,
        subject: parseInt(selectedSubject),
        anonymous: isAnonymous,
      };
      const response = await fetch("http://127.0.0.1:8000/api/questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.status === 401) {
        alert("A tua sessão expirou. Por favor, faz login novamente.");
        router.push("/");
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        throw new Error("Falha ao criar pergunta.");
      }
      const newQuestion: Question = await response.json();
      setQuestions((currentQuestions) => [newQuestion, ...currentQuestions]);
      setNewQuestionContent("");
      setSelectedSubject("");
      setIsAnonymous(false);
    } catch (err) {
      console.error("Erro ao criar pergunta:", err);
      alert(err instanceof Error ? err.message : "Erro ao criar pergunta");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-400">Carregando...</p>;
    }
    if (error) {
      return (
        <div className="text-center p-4 rounded-md bg-red-900 text-red-100 border border-red-700">
          <p className="font-bold">Falha ao conectar ao backend!</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      );
    }

    const filteredQuestions = activeFilter
      ? questions.filter((q) => q.subject_name === activeFilter)
      : questions;

    if (filteredQuestions.length === 0 && !isLoading) {
      if (activeFilter) {
        return (
          <p className="text-center text-gray-400">
            Nenhuma pergunta encontrada para "{activeFilter}".
          </p>
        );
      }
      return (
        <p className="text-center text-gray-400">Nenhuma pergunta encontrada.</p>
      );
    }

    return filteredQuestions.map((q) => (
      <QuestionCard
        key={q.id}
        authorName={q.author_details?.username || "Anônimo"}
        authorAvatarUrl={q.author_details?.avatar_url}
        content={q.question_body}
        timestamp={formatRelativeTime(q.question_date)}
        isAnonymous={q.anonymous}
        replyCount={q.reply_count}
        saveCount={q.save_count}
        isSaved={q.is_saved}
        subjectName={q.subject_name}
        onSaveClick={(e) => {
          e.stopPropagation();
          handleSave(q.id);
        }}
        onReplyClick={(e) => {
          e.stopPropagation();
          alert(`Responder à pergunta ${q.id}`);
        }}
        onClick={() => alert(`Ver detalhes da pergunta ${q.id}`)}
      />
    ));
  };

  return (
    <>
      <div className="flex justify-center">
        <Header />
      </div>

      <div className="flex max-w-6xl mx-auto pt-20 gap-8 px-4">
        <aside className="w-64 md-block">
          <Subjects
            subjects={subjects.map((s) => s.subject_name)}
            onSelect={handleSelectSubject}
            activeSubject={activeFilter}
          />
        </aside>

        <main className="flex-1">

          <NewQuestionCard
            newQuestionContent={newQuestionContent}
            onChangeContent={setNewQuestionContent}
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            isAnonymous={isAnonymous}
            onToggleAnonymous={setIsAnonymous}
            onSubmit={handleCreateQuestion}
            disabled={!newQuestionContent.trim() || !selectedSubject}
          />

          {renderContent()}
        </main>
      </div>
    </>
  );
}