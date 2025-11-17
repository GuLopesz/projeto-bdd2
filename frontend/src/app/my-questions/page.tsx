"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/common/header";
import QuestionCard from "@/components/common/questions";
import { formatRelativeTime } from "@/lib/format-date";
import { Question as BaseQuestion } from "@/lib/index";

interface Question extends BaseQuestion {
  author: number; 
}

export default function MyQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }
    
    try {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.user_id);
    } catch (e) {
      console.error("Erro token", e);
    }

    fetch("http://127.0.0.1:8000/api/questions/")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/questions/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setQuestions(prev => prev.filter(q => q.id !== id));
      } else {
        alert("Erro ao apagar.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const myQuestions = questions.filter((q) => q.author == userId);

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main className="max-w-4xl mx-auto pt-32 px-4">
        <h1 className="text-3xl font-bold text-primary mb-2">Minhas Perguntas</h1>
        <p className="text-gray-400 mb-8">Gerencie as dúvidas que você publicou.</p>
        
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : myQuestions.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">Você ainda não fez nenhuma pergunta.</p>
            <button onClick={() => router.push("/home")} className="text-primary mt-2 hover:underline">
              Ir para o feed
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myQuestions.map(q => {
              const displayName = q.anonymous 
                ? `${q.author_details.username} (Anônimo)` 
                : q.author_details.username;

              return (
                <QuestionCard 
                  key={q.id}
                  questionId={q.id}
                  authorName={displayName}
                  avatarColorKey={q.author_details.username}                  
                  authorAvatarUrl={q.author_details.avatar_url}
                  content={q.question_body}
                  timestamp={formatRelativeTime(q.question_date)}
                  subjectName={q.subject_name}
                  replyCount={q.reply_count}         
                  isAnonymous={false} 
                  
                  onDeleteClick={handleDelete} 
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}