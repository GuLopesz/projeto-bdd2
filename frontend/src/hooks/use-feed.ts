import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, Subject, Answer } from "@/lib/index";

export function useFeed() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Faça login para continuar.");
      router.push("/");
      return null;
    }
    return token;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsRes, subjectsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/questions/"),
          fetch("http://127.0.0.1:8000/api/subjects/")
        ]);

        if (!questionsRes.ok || !subjectsRes.ok) throw new Error("Erro ao carregar dados.");

        setQuestions(await questionsRes.json());
        setSubjects(await subjectsRes.json());
      } catch (err) {
        setError("Falha na conexão com o servidor.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const createQuestion = async (body: { question_body: string; subject: number; anonymous: boolean }) => {
    const token = getToken();
    if (!token) return false;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error("Erro ao criar");
      
      const newQ = await res.json();
      setQuestions(prev => [newQ, ...prev]);
      return true;
    } catch (e) {
      alert("Erro ao criar pergunta.");
      return false;
    }
  };


  const fetchAnswers = async (questionId: number): Promise<Answer[]> => {
    const res = await fetch(`http://127.0.0.1:8000/api/questions/${questionId}/answers/`);
    if (!res.ok) throw new Error("Erro ao buscar respostas");
    return await res.json();
  };

  const submitAnswer = async (questionId: number, content: string) => {
    const token = getToken();
    if (!token) return null;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/questions/${questionId}/answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answer_body: content })
      });

      if (!res.ok) throw new Error("Erro ao enviar");
      
      const newAnswer: Answer = await res.json();
      
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, reply_count: q.reply_count + 1 } : q));
      
      return newAnswer;
    } catch (e) {
      alert("Erro ao enviar resposta.");
      return null;
    }
  };

  return { 
    subjects, 
    questions, 
    isLoading, 
    error,
    createQuestion, 
    fetchAnswers, 
    submitAnswer 
  };
}