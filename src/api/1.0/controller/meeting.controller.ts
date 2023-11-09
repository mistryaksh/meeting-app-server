import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ProtectRoute } from "middleware";
import { MeetingService } from "service/meeting.service";
import { IController, IControllerRoutes } from "types";

import { BadRequest, Ok, UnAuthorized } from "utils";

export class MeetingController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.GenerateMeetingToken,
               path: "/video-sdk-token",
               method: "GET",
               middleware: [ProtectRoute],
          });
          this.routes.push({
               handler: this.GenerateMeeting,
               method: "POST",
               path: "/generate-meeting",
               middleware: [ProtectRoute],
          });
          this.routes.push({
               handler: this.ValidateMeeting,
               method: "POST",
               path: "/validate-meeting",
               middleware: [ProtectRoute],
          });
     }

     public async GenerateMeetingToken(req: Request, res: Response) {
          try {
               const key: string = process.env.VIDEO_SDK_API_KEY;
               const secret: string = process.env.VIDEO_SDK_API_SECRET;
               const token = jwt.sign(
                    {
                         apikey: key,
                         permissions: [`allow_join`], // `ask_join` || `allow_mod`
                         version: 2,
                    },
                    secret,
                    { expiresIn: "36000s" }
               );
               return Ok(res, token);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GenerateMeeting(req: Request, res: Response) {
          try {
               const token = req.body.token;

               if (!token) {
                    return BadRequest(res, "cannot generate meeting! token not found");
               }
               const meeting = await MeetingService.CreateMeeting(token);

               return Ok(res, meeting);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async ValidateMeeting(req: Request, res: Response) {
          try {
               const { token, roomId } = req.body;

               if (!token || !roomId) {
                    return BadRequest(res, "token or room id is not provided");
               }

               const meeting = await MeetingService.ValidateMeeting(roomId, token);

               return Ok(res, meeting);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
