import mongoose from "mongoose";
import { SignUpProps } from "types/user.interface";

const UserSchema = new mongoose.Schema<SignUpProps>({
     username: { type: mongoose.Schema.Types.String, required: true, unique: true },
     name: {
          firstName: { type: mongoose.Schema.Types.String, required: true },
          lastName: { type: mongoose.Schema.Types.String, required: true },
     },
     email: {
          type: mongoose.Schema.Types.String,
          required: true,
     },
     password: {
          type: mongoose.Schema.Types.String,
          required: true,
     },
});

export const User = mongoose.model("User", UserSchema);
