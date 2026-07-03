import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  role: "student" | "admin" | "volunteer";
  badges: Array<{ id: string; name: string; earnedAt: Date }>;
  xpPoints: number;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Store hashed password, select false by default
  phone: { type: String, required: true },
  college: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  role: { type: String, enum: ["student", "admin", "volunteer"], default: "student" },
  badges: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      earnedAt: { type: Date, default: Date.now }
    }
  ],
  xpPoints: { type: Number, default: 0 }
}, { timestamps: true });

export const User = model<IUser>("User", UserSchema);

