export interface Subject {
  id: number;
  subject_name: string;
}

export interface AuthorDetails {
  username: string;
  avatar_url: string;
}

export interface Answer {
  id: number;
  answer_body: string;
  answer_date: string;
  author_details: AuthorDetails;
  author_name: string;
}

export interface Question {
  id: number;
  question_body: string;
  question_date: string;
  anonymous: boolean;
  author_details: AuthorDetails;
  reply_count: number;
  subject_name: string;
}