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
export declare class UserService {
    static createUser(data: CreateUserData): Promise<{
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getUserByTelegramId(telegramId: string): Promise<({
        selectedProfessions: {
            id: string;
            createdAt: Date;
            profession: string;
            userId: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    static getUserById(id: string): Promise<({
        selectedProfessions: {
            id: string;
            createdAt: Date;
            profession: string;
            userId: string;
        }[];
    } & {
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
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
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        profession: string;
        userId: string;
    }>;
    static getUserProfessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        profession: string;
        userId: string;
    }[]>;
    static removeSelectedProfession(id: string): Promise<{
        id: string;
        createdAt: Date;
        profession: string;
        userId: string;
    }>;
    static upsertUser(data: CreateUserData): Promise<{
        id: string;
        username: string | null;
        telegramId: string;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=userService.d.ts.map