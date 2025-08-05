export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string | null;
  username?: string | null;
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
  username?: string | null;
  firstName: string;
  lastName?: string | null;
  iat?: number;
  exp?: number;
}

// Extended JWT payload with role and auth type
export interface ExtendedJwtPayload extends JwtPayload {
  role: UserRole;
  authType: 'email' | 'telegram';
  userDbId?: string;
}

// User roles enum
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
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

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  username?: string;
}

// Новые типы для системы статусов
export enum UserStatus {
  INTERVIEWER = 'INTERVIEWER',
  CANDIDATE = 'CANDIDATE',
}

export enum InterviewStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
}

// Обновленный интерфейс пользователя - соответствует текущей схеме Prisma
export interface User {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  status: UserStatus;
  role: UserRole;
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
