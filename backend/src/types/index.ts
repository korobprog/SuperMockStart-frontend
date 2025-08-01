export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface AuthRequest {
  telegramUser: TelegramUser;
  auth_date: number;
  hash: string;
}

export interface JwtPayload {
  userId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserSession {
  id: string;
  userId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  createdAt: Date;
  lastActivity: Date;
}

// Telegram Web App Data
export interface TelegramWebAppData {
  query_id: string;
  user: TelegramUser;
  auth_date: number;
  hash: string;
  start_param?: string;
  can_send_after?: number;
  chat_type?: string;
  chat_instance?: string;
}

// Новые типы для системы статусов
export enum UserStatus {
  INTERVIEWER = 'INTERVIEWER',
  CANDIDATE = 'CANDIDATE'
}

export enum InterviewStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED'
}

export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: string;
  interviewerId: string;
  candidateId: string;
  status: InterviewStatus;
  feedback?: string;
  feedbackReceivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  interviewer?: User;
  candidate?: User;
}
