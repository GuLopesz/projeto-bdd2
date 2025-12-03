PRAGMA foreign_keys = ON;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT 0,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    date_joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_type VARCHAR(20) NOT NULL DEFAULT ''
);


CREATE TABLE subjects (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE questions (
    question_id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_body TEXT NOT NULL,
    anonymous BOOLEAN NOT NULL DEFAULT 0,
    question_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    questions_status BOOLEAN NOT NULL DEFAULT 0,
    --chaves estrangeiras
    author_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    answer_body TEXT NOT NULL,
    answer_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- auto_now_add
    --chaves estrangeiras
    question_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
);