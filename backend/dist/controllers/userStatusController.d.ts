import { Request, Response } from 'express';
export declare class UserStatusController {
    static getUserStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateUserStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createInterview(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static completeInterview(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static addFeedback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAvailableCandidates(req: Request, res: Response): Promise<void>;
    static getUserInterviews(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=userStatusController.d.ts.map