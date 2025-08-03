import { UserStatus } from '../types/index.js';
export interface CreateUserData {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}
export interface AddProfessionData {
    userId: string;
    profession: string;
}
export interface UpdateUserStatusData {
    userId: string;
    status: UserStatus;
}
export interface UpdateUserStatusByTelegramIdData {
    telegramId: string;
    status: UserStatus;
}
export interface CreateInterviewData {
    interviewerId: string;
    candidateId: string;
}
export interface UpdateInterviewFeedbackData {
    interviewId: string;
    feedback: string;
}
export declare class UserService {
    static createUser(data: CreateUserData): Promise<{
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getUserByTelegramId(telegramId: string): Promise<({
        selectedProfessions: {
            id: string;
            userId: string;
            createdAt: Date;
            profession: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    static getUserById(id: string): Promise<({
        selectedProfessions: {
            id: string;
            userId: string;
            createdAt: Date;
            profession: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    static addSelectedProfession(data: AddProfessionData): Promise<{
        user: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        profession: string;
    }>;
    static getUserProfessions(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        profession: string;
    }[]>;
    static removeSelectedProfession(id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        profession: string;
    }>;
    static upsertUser(data: CreateUserData): Promise<{
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateUserStatus(data: UpdateUserStatusData): Promise<{
        selectedProfessions: {
            id: string;
            userId: string;
            createdAt: Date;
            profession: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateUserStatusByTelegramId(data: UpdateUserStatusByTelegramIdData): Promise<{
        selectedProfessions: {
            id: string;
            userId: string;
            createdAt: Date;
            profession: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getUsersByStatus(status: UserStatus): Promise<({
        selectedProfessions: {
            id: string;
            userId: string;
            createdAt: Date;
            profession: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    static createInterview(data: CreateInterviewData): Promise<{
        interviewer: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        candidate: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InterviewStatus;
        createdAt: Date;
        updatedAt: Date;
        feedback: string | null;
        feedbackReceivedAt: Date | null;
        interviewerId: string;
        candidateId: string;
    }>;
    static completeInterview(interviewId: string): Promise<{
        interviewer: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        candidate: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InterviewStatus;
        createdAt: Date;
        updatedAt: Date;
        feedback: string | null;
        feedbackReceivedAt: Date | null;
        interviewerId: string;
        candidateId: string;
    }>;
    static addInterviewFeedback(data: UpdateInterviewFeedbackData): Promise<{
        interviewer: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        candidate: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InterviewStatus;
        createdAt: Date;
        updatedAt: Date;
        feedback: string | null;
        feedbackReceivedAt: Date | null;
        interviewerId: string;
        candidateId: string;
    }>;
    static getUserInterviews(userId: string): Promise<({
        interviewer: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        candidate: {
            id: string;
            username: string | null;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InterviewStatus;
        createdAt: Date;
        updatedAt: Date;
        feedback: string | null;
        feedbackReceivedAt: Date | null;
        interviewerId: string;
        candidateId: string;
    })[]>;
    static getAvailableCandidates(excludeUserId?: string): Promise<({
        selectedProfessions: {
            id: string;
            userId: string;
            createdAt: Date;
            profession: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    static getAvailableInterviewers(excludeUserId?: string): Promise<({
        selectedProfessions: {
            id: string;
            userId: string;
            createdAt: Date;
            profession: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
//# sourceMappingURL=userService.d.ts.map