import { Schema, model, Document } from "mongoose";

export interface IScore extends Document {
  eventId: Schema.Types.ObjectId;
  teams: Array<{
    name: string;
    score: number;
    rank: number;
    college: string;
  }>;
  isLive: boolean;
}

const ScoreSchema = new Schema<IScore>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  teams: [
    {
      name: { type: String, required: true },
      score: { type: Number, required: true },
      rank: { type: Number, required: true },
      college: { type: String, required: true }
    }
  ],
  isLive: { type: Boolean, default: false }
}, { timestamps: true });

export const Score = model<IScore>("Score", ScoreSchema);
