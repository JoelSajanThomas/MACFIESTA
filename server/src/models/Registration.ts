import { Schema, model, Document } from "mongoose";

export interface IRegistration extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  paymentStatus: "pending" | "completed" | "failed";
  paymentId?: string;
  qrCode: string;
  entryPass: string;
}

const RegistrationSchema = new Schema<IRegistration>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paymentId: { type: String },
  qrCode: { type: String, required: true },
  entryPass: { type: String, required: true }
}, { timestamps: true });

export const Registration = model<IRegistration>("Registration", RegistrationSchema);
