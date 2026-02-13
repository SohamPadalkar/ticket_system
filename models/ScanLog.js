import mongoose from "mongoose";

const ScanLogSchema = new mongoose.Schema({
    ticketId: String,
    type: String,
    day: String,
    status: String,
    admin: String,
    scannedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.ScanLog ||
    mongoose.model("ScanLog", ScanLogSchema);
