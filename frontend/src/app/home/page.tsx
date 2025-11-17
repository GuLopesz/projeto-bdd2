"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

//componentes
import Header from "@/components/common/header";
import QuestionCard from "@/components/common/questions";
import Subjects from "@/components/common/subjects";
import NewQuestionCard from "@/components/common/new-question-card";
import AnswerList from "@/components/common/answer-list";
import ReplyForm from "@/components/common/reply-form";

//hooks e utils
import { useFeed } from "@/hooks/use-feed";
import { formatRelativeTime } from "@/lib/format-date";
import { Answer } from "@/lib/index";

export default function HomeMainPage() {
  const { subjects, questions, isLoading, error, createQuestion, fetchAnswers, submitAnswer } = useFeed();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState ("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [answersByQuestion, setAnswersByQuestion] = useState<Record<number, Answer[]>>({});
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  //ui
  const handleSelectSubject = (name: string) => setActiveFilter(activeFilter === name ? null : name);
  const handleCreateWrapper = async () => {
    if (!newQuestionContent.trim() || !selectedSubject) return alert("Preencha todos os campos");

    const success = await createQuestion({
      question_body: newQuestionContent,
      subject: parseInt(selectedSubject),
      anonymous: isAnonymous
    });

    if (success) {
      setNewQuestionContent("");
      setSelectedSubject("");
      setIsAnonymous(false);
    }
  };

  const handleReplyToggle = async (qId: number) => {
    if (replyingToId === qId) {
      setReplyingToId(null);
      return;
    }
    setReplyingToId(qId);
    if (answersByQuestion[qId]) return;

    setLoadingAnswers(true);
    try {
      const data = await fetchAnswers(qId);
      setAnswersByQuestion(prev => ({ ...prev, [qId]: data }));
    } catch (e) { console.error(e); } 
    finally { setLoadingAnswers(false); }
  };

  const handleAnswerWrapper = async (qId: number) => {
    if (!replyContent.trim()) return;
    
    const newAnswer = await submitAnswer(qId, replyContent);
    
    if (newAnswer) {
      setAnswersByQuestion(prev => ({
        ...prev,
        [qId]: [...(prev[qId] ?? []), newAnswer]
      }));
      setReplyContent("");
    }
  };

  //render
  const renderContent = () => {
    if (isLoading) return <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-center text-gray-400 mt-10">Carregando...</motion.p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    const filteredList = questions.filter((q) => {
        const matchesSubject = activeFilter ? q.subject_name === activeFilter : true;
        const matchesSearch = q.question_body.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSubject && matchesSearch;
    });

    if (filteredList.length === 0) return <p className="text-center text-gray-400 mt-10">Nenhuma pergunta encontrada.</p>;

    return (
      <AnimatePresence mode="popLayout">
        {filteredList.map((q) => (
          <motion.div
            key={q.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="mb-4"
          >
            <QuestionCard
              questionId={q.id}
              authorName={q.author_details?.username || "Anônimo"}
              authorAvatarUrl={q.author_details?.avatar_url}
              content={q.question_body}
              timestamp={formatRelativeTime(q.question_date)}
              isAnonymous={q.anonymous}
              replyCount={q.reply_count}
              subjectName={q.subject_name}
              onReplyClick={() => handleReplyToggle(q.id)}
              onClick={() => handleReplyToggle(q.id)}
            />

            <AnimatePresence>
              {replyingToId === q.id && (
                <motion.div
                  key={`answer-section-${q.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="ml-8 mb-6 border-l-2 border-gray-700 pl-4 pt-2">
                    <AnswerList 
                      answers={answersByQuestion[q.id] ?? []} 
                      isLoading={loadingAnswers && !answersByQuestion[q.id]}
                    />
                    <ReplyForm 
                      value={replyContent} 
                      onChange={setReplyContent} 
                      onSubmit={() => handleAnswerWrapper(q.id)} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    );
  };

  return (
    <>
      <div id="top" className="flex justify-center"><Header onSearch={setSearchTerm} /></div>
      <div className="flex max-w-6xl mx-auto pt-20 gap-8 px-4">
        <aside className="w-64 md-block">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Subjects subjects={subjects.map((s) => s.subject_name)} onSelect={handleSelectSubject} activeSubject={activeFilter} />
          </motion.div>
        </aside>
        <main className="flex-1">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <NewQuestionCard
              newQuestionContent={newQuestionContent}
              onChangeContent={setNewQuestionContent}
              subjects={subjects}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
              isAnonymous={isAnonymous}
              onToggleAnonymous={setIsAnonymous}
              onSubmit={handleCreateWrapper}
              disabled={!newQuestionContent.trim() || !selectedSubject}
            />
          </motion.div>
          {renderContent()}
        </main>
      </div>
    </>
  );
}