"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
const mongoose_1 = require("mongoose");
const ScoreSchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Event", required: true },
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
exports.Score = (0, mongoose_1.model)("Score", ScoreSchema);
