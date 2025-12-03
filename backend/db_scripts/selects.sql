--buscar perguntas
SELECT 
    q.id AS question_id,
    q.question_body,
    q.question_date,
    q.anonymous,      
    u.username AS author_name,
    s.subject_name
FROM questions q
INNER JOIN users u ON q.author_id = u.id
INNER JOIN subjects s ON q.subject_id = s.id
ORDER BY q.question_date DESC;

--buscar perguntas por categoria
SELECT 
    q.id AS question_id,
    q.question_body,
    q.question_date,
    q.anonymous,
    u.username AS author_name,
    s.subject_name
FROM questions q
INNER JOIN users u ON q.author_id = u.id
INNER JOIN subjects s ON q.subject_id = s.id
WHERE q.subject_id = :subject_id_input 
ORDER BY q.question_date DESC;

--barra de pesquisa
SELECT 
    q.id AS question_id,
    q.question_body,
    q.question_date,
    u.username AS author_name,
    s.subject_name
FROM questions q
INNER JOIN users u ON q.author_id = u.id
INNER JOIN subjects s ON q.subject_id = s.id
WHERE q.question_title LIKE :search_term  
   OR q.question_body LIKE :search_term
ORDER BY q.question_date DESC;