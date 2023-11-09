import { Request, Response } from "express";
import { User } from "model";
import { IController, IControllerRoutes } from "types";
import { SignUpProps } from "types/user.interface";
import bcrypt from "bcrypt";
import { Ok, UnAuthorized } from "utils";
import jsonwebtoken from "jsonwebtoken";
import { ProtectRoute } from "middleware";
import { GetToken } from "utils/auth.utils";

export class AuthController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.SignUp,
               path: "/sign-up",
               method: "POST",
          });
          this.routes.push({
               handler: this.SignIn,
               method: "POST",
               path: "/sign-in",
          });
          this.routes.push({
               handler: this.Profile,
               method: "GET",
               path: "/my-profile",
               middleware: [ProtectRoute],
          });
     }

     public async SignUp(req: Request, res: Response) {
          try {
               const { email, name, password, username }: SignUpProps = req.body;
               const hashed = bcrypt.hashSync(password, 10);
               const user = await User.findOne({ username });

               if (user) {
                    return UnAuthorized(res, `please choose other username`);
               }

               if (!email || !name || !password || !username) {
                    return UnAuthorized(res, "missing credentials");
               } else {
                    const user = await new User({
                         email: email,
                         name: {
                              firstName: name.firstName,
                              lastName: name.lastName,
                         },
                         username,
                         password: hashed,
                    }).save();

                    return Ok(res, `${user.name.firstName} ${user.name.lastName} is registered, successfully`);
               }
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }

     public async SignIn(req: Request, res: Response) {
          try {
               const { username, password } = req.body;
               const user = await User.findOne({ username });

               if (!user) {
                    return UnAuthorized(res, "we have no user with this username");
               }

               if (!bcrypt.compareSync(password, user.password)) {
                    return UnAuthorized(res, "invalid credentials");
               }

               const token = jsonwebtoken.sign(
                    {
                         id: user._id,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
               );

               return Ok(res, {
                    message: `${user.username} is logged in successfully`,
                    token: token,
               });
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async Profile(req: Request, res: Response) {
          try {
               const token = GetToken(req);
               const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET) as any;
               const user = await User.findById({ _id: verified.id });
               return Ok(res, user);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
