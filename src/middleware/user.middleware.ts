import { Request, Response, NextFunction } from "express";
import { BadRequest, UnAuthorized } from "utils";
import { GetToken } from "utils/auth.utils";

export const ProtectRoute = (req: Request, res: Response, next: NextFunction) => {
     try {
          const token = GetToken(req);
          if (!token) {
               return BadRequest(res, "please login for this route");
          }

          next();
     } catch (err) {
          return UnAuthorized(res, err);
     }
};
