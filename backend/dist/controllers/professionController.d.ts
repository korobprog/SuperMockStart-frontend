import { Request, Response } from 'express';
export declare class ProfessionController {
    static addSelectedProfession(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserProfessions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static removeSelectedProfession(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserWithProfessions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=professionController.d.ts.map