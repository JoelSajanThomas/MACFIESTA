import { Schema, model, Document } from "mongoose";

export interface IRegistration extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  paymentStatus: "pending" | "completed" | "failed" | "cancelled_no_refund";
  status: "active" | "cancelled";
  cancelledAt?: Date;
  cancellationPolicyNotice?: string;
  paymentId?: string;
  qrCode: string;
  entryPass: string;
}

const RegistrationSchema = new Schema<IRegistration>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  paymentStatus: { type: String, enum: ["pending", "completed", "failed", "cancelled_no_refund"], default: "pending" },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  cancelledAt: { type: Date },
  cancellationPolicyNotice: { type: String },
  paymentId: { type: String },
  qrCode: { type: String, required: true },
  entryPass: { type: String, required: true }
}, { timestamps: true });

export const Registration = model<IRegistration>("Registration", RegistrationSchema);
