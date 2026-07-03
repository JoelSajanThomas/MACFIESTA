import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  rules: string[];
  coverImage: string;
  date: string;
  time: string;
  venue: string;
  category: "general" | "technical" | "cultural" | "gaming" | "sports";
  type: "solo" | "duo" | "trio" | "squad" | "group";
  prizePool: number;
  maxSeats: number;
  registeredCount: number;
  isLive: boolean;
  coordinator: {
    name: string;
    phone: string;
    email: string;
  };
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  rules: [{ type: String }],
  coverImage: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  category: { type: String, enum: ["general", "technical", "cultural", "gaming", "sports"], required: true },
  type: { type: String, enum: ["solo", "duo", "trio", "squad", "group"], required: true },
  prizePool: { type: Number, required: true },
  maxSeats: { type: Number, required: true },
  registeredCount: { type: Number, default: 0 },
  isLive: { type: Boolean, default: false },
  coordinator: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  }
}, { timestamps: true });

export const Event = model<IEvent>("Event", EventSchema);

