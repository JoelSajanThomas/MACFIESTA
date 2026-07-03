"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
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
exports.Event = (0, mongoose_1.model)("Event", EventSchema);
