"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
const mongoose_1 = require("mongoose");
const RegistrationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Event", required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed", "cancelled_no_refund"], default: "pending" },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    cancelledAt: { type: Date },
    cancellationPolicyNotice: { type: String },
    paymentId: { type: String },
    qrCode: { type: String, required: true },
    entryPass: { type: String, required: true }
}, { timestamps: true });
exports.Registration = (0, mongoose_1.model)("Registration", RegistrationSchema);
