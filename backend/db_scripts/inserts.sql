INSERT INTO users (
    username, 
    password, 
    first_name, 
    last_name, 
    email, 
    user_type, 
    is_active, 
    is_staff, 
    is_superuser, 
    date_joined
) VALUES (
    :username_input,   
    :password_hash,    
    :first_name_input, 
    :last_name_input,  
    :email_input,      
    :user_type_calc,   
    1,                 
    0,                 
    0,                 
    CURRENT_TIMESTAMP  
);

INSERT INTO questions (
    question_body, 
    anonymous, 
    questions_status, 
    question_date, 
    author_id, 
    subject_id
) VALUES (
    :title_input,      
    :body_input,       
    :is_anon_input,    
    0,                 
    CURRENT_TIMESTAMP, 
    :current_user_id,  
    :selected_subj_id  
);

INSERT INTO answers (
    answer_body, 
    answer_date, 
    question_id, 
    author_id
) VALUES (
    :answer_text_input, 
    CURRENT_TIMESTAMP,  
    :target_question_id,
    :current_user_id    
);

INSERT INTO subjects (subject_name) VALUES 
    ('Computação de Alto Desempenho'),
    ('Matemática e Lógica Computacional'),
    ('Infraestrutura e Redes de Computadores'),
    ('Engenharia de Software'),
    ('Banco de Dados'),
    ('Desenvolvimento Web/Mobile'),
    ('Fundamentos de Programação');