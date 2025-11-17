import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, Subject, Answer } from "@/lib";

export function useFeed() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resQuestions, resSubjects] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/questions/"),
          fetch("http://127.0.0.1:8000/api/subjects/")
        ]);

        if (!resQuestions.ok || !resSubjects.ok) throw new Error("Erro ao carregar dados.");

        setQuestions(await resQuestions.json());
        setSubjects(await resSubjects.json());
      } catch (err) {
        setError("Falha na conexão.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  //acoes
  const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("Faça login primeiro.");
        router.push("/"); 
        return null;
    }
    return token;
  };

  const saveQuestion = async (id: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/questions/${id}/save/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erro ao salvar");

      setQuestions(prev => prev.map(q => 
        q.id === id 
          ? { ...q, is_saved: !q.is_saved, save_count: q.is_saved ? q.save_count - 1 : q.save_count + 1 } 
          : q
      ));
    } catch (e) { console.error(e); }
  };

  const createQuestion = async (body: any) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao criar");
      const newQ = await res.json();
      setQuestions(prev => [newQ, ...prev]);
      return true;
    } catch (e) { 
        alert("Erro ao criar pergunta"); 
        return false; 
    }
  };

  const fetchAnswers = async (questionId: number) => {
    const res = await fetch(`http://127.0.0.1:8000/api/questions/${questionId}/answers/`);
    if (!res.ok) throw new Error("Erro");
    return await res.json();
  };

  const postAnswer = async (questionId: number, content: string) => {
    const token = getToken();
    if (!token) return null;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/questions/${questionId}/answers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ answer_body: content })
      });
      if (!res.ok) throw new Error("Erro");
      
      //atualiza o contador
      setQuestions(curr => curr.map(q => q.id === questionId ? { ...q, reply_count: q.reply_count + 1 } : q));
      
      return await res.json();
    } catch (e) { 
        alert("Erro ao enviar resposta"); 
        return null;
    }
  };

  return { subjects, questions, isLoading, error, saveQuestion, createQuestion, fetchAnswers, postAnswer };
}