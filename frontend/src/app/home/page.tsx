"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header"; // Ajuste o caminho se necessário
import QuestionCard from "@/components/common/questions"; // Ajuste o caminho se necessário
import Subjects from "@/components/common/subjects"; // Ajuste o caminho se necessário

// --- Interface da Pergunta ---
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

// --- Interface para os Assuntos ---
interface Subject {
  id: number;
  subject_name: string; // O nome do campo do seu modelo
}

export default function HomeMainPage() {
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- NOVO ESTADO PARA O FILTRO ---
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // States do formulário de "Perguntar"
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>(""); 
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  
  const router = useRouter();

  // --- FUNÇÃO DE FILTRO ATUALIZADA ---
  const handleSelectSubject = (subjectName: string) => {
    // Se clicar no filtro que já está ativo, desliga-o
    if (activeFilter === subjectName) {
      setActiveFilter(null);
    } else {
      // Senão, define-o como o filtro ativo
      setActiveFilter(subjectName);
    }
  };
  
  // --- useEffect (Busca Perguntas e Disciplinas) ---
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
    
    // Busca as disciplinas da API
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

    Promise.all([
      fetchQuestions(),
      fetchSubjects()
    ]).finally(() => {
      setIsLoading(false);
    });
    
  }, []); // O [] garante que rode apenas uma vez

  
  // --- handleSave (sem mudanças) ---
  const handleSave = async (id: number) => {
    const token = localStorage.getItem('access_token');
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
            "Authorization": `Bearer ${token}`
          },
        }
      );
      if (response.status === 401) {
        alert("Sessão expirada. Faz login novamente.");
        router.push("/");
      }
      if (!response.ok) throw new Error("Falha ao salvar.");
      
      setQuestions(currentQuestions =>
        currentQuestions.map(q => {
          if (q.id === id) {
            const newIsSaved = !q.is_saved;
            const newSaveCount = newIsSaved ? q.save_count + 1 : q.save_count - 1;
            return { ...q, is_saved: newIsSaved, save_count: newSaveCount };
          }
          return q;
        })
      );
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // --- handleCreateQuestion (sem mudanças) ---
  const handleCreateQuestion = async () => {
    if (!newQuestionContent.trim()) {
      alert("Por favor, escreve a tua dúvida.");
      return;
    }
    if (!selectedSubject) {
      alert("Por favor, seleciona uma disciplina.");
      return;
    }
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Precisas de estar logado para perguntar.");
      router.push("/");
      return;
    }
    try {
      const body = {
        'question_body': newQuestionContent,
        'subject': parseInt(selectedSubject),
        'anonymous': isAnonymous
      };
      const response = await fetch("http://127.0.0.1:8000/api/questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
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
      setQuestions(currentQuestions => [newQuestion, ...currentQuestions]);
      setNewQuestionContent("");
      setSelectedSubject("");
      setIsAnonymous(false);
    } catch (err) {
      console.error("Erro ao criar pergunta:", err);
      alert(err instanceof Error ? err.message : "Erro ao criar pergunta");
    }
  };

  // --- FUNÇÃO DE RENDERIZAÇÃO ATUALIZADA ---
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

    // Lógica de filtragem
    const filteredQuestions = activeFilter
      ? questions.filter(q => q.subject_name === activeFilter)
      : questions;

    if (filteredQuestions.length === 0 && !isLoading) {
      if (activeFilter) {
        return <p className="text-center text-gray-400">Nenhuma pergunta encontrada para "{activeFilter}".</p>;
      }
      return <p className="text-center text-gray-400">Nenhuma pergunta encontrada.</p>;
    }
    
    // Mapeia a lista JÁ FILTRADA
    return filteredQuestions.map((q) => (
      <QuestionCard
        key={q.id}
        authorName={q.author_details?.username || "Anônimo"}
        authorAvatarUrl={q.author_details?.avatar_url}
        content={q.question_body}
        timestamp={q.question_date}
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

      <div className="flex max-w-6xl mx-auto mt-6 gap-8 px-4">
        <aside className="w-64 md-block">
          {/* PASSA O FILTRO ATIVO PARA A BARRA LATERAL */}
          <Subjects 
            subjects={subjects.map(s => s.subject_name)}
            onSelect={handleSelectSubject} 
            activeSubject={activeFilter} 
          />
        </aside>

        <main className="flex-1">
          {/* Caixa de postar (sem mudanças) */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 border border-gray-700">
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Qual sua dúvida?"
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
            />
            
            <div className="flex flex-col md:flex-row justify-between items-center mt-3 gap-4">
              
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full md:w-auto p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none"
              >
                <option value="" disabled>Selecione uma disciplina...</option>
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
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded bg-gray-700 text-blue-600"
                />
                Perguntar anonimamente
              </label>

              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleCreateQuestion}
                disabled={!newQuestionContent.trim() || !selectedSubject}
              >
                Perguntar
              </button>
            </div>
          </div>

          {/* Renderiza o conteúdo */}
          {renderContent()}
          
        </main>
      </div>
    </>
  );
}