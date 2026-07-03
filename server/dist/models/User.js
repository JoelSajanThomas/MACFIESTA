"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
exports.User = (0, mongoose_1.model)("User", UserSchema);
