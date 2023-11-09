import { Request } from "express";

export const GetToken = (req: Request) => {
     return req.headers.authorization;
};
