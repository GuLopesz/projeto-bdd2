"use client";

import { useState } from "react";
import Header from "@/components/common/header";
import QuestionCard from "@/components/common/questions";
import Subjects from "@/components/common/subjects";

export default function Main() {
  const subjects = [
    "Algoritmos",
    "Banco de Dados",
    "Engenharia de Software",
    "Estruturas de Dados",
    "Redes de Computadores",
  ];

  const handleSelectSubject = (subject: string) => {
    console.log(`Filtro de disciplina selecionado: ${subject}`);
  };


  const initialQuestions = [
    {
      id: 1,
      authorName: "Gustavo",
      authorAvatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "O que é TypeScript? Ouvi dizer que é um superset do JavaScript que adiciona tipagem estática, mas quais as vantagens práticas no dia a dia?",
      timestamp: "5m",
      replyCount: 2,
      saveCount: 7,
      isSaved: false,
      isAnonymous: false,
    },
    {
      id: 2,
      authorName: "Maria",
      authorAvatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
      content: "Qual a diferença real entre chave primária e chave estrangeira? A primária identifica unicamente um registro e a estrangeira cria a relação, mas alguém tem um exemplo prático de quando usar uma UNIQUE em vez de PRIMARY KEY?",
      timestamp: "1h",
      replyCount: 5,
      saveCount: 15,
      isSaved: true,
      isAnonymous: false,
    },
    {
      id: 3,
      content: "Estou com vergonha de perguntar na aula, mas não entendi muito bem a complexidade do Quicksort no pior caso. Alguém pode me ajudar?",
      timestamp: "3h",
      replyCount: 11,
      saveCount: 32,
      isSaved: false,
      isAnonymous: true,
    },
  ];

  const [questions, setQuestions] = useState(initialQuestions);

  const handleSave = (id: number) => {
    setQuestions(currentQuestions =>
      currentQuestions.map(q => {
        if (q.id === id) {
          return {
            ...q,
            isSaved: !q.isSaved,
            saveCount: q.isSaved ? q.saveCount - 1 : q.saveCount + 1,
          };
        }
        return q;
      })
    );
  };

  return (
    <>
      <div className="flex justify-center">
        <Header />
      </div>

      <div className="flex max-w-6xl mx-auto mt-6 gap-8 px-4">
        <aside className="w-64 md-block">
          <Subjects subjects={subjects} onSelect={handleSelectSubject} />
        </aside>

        <main className="flex-1">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              authorName={q.authorName}
              authorAvatarUrl={q.authorAvatarUrl}
              content={q.content}
              timestamp={q.timestamp}
              replyCount={q.replyCount}
              saveCount={q.saveCount}
              isSaved={q.isSaved}
              isAnonymous={q.isAnonymous}
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
          ))}
        </main>
      </div>
    </>
  );
}