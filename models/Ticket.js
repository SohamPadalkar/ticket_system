import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
    day: String,
    type: String, // breakfast | lunch | dinner
    allowed: Boolean,
    used: { type: Boolean, default: false }
});

const TicketSchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true },
    entryUsed: { type: Boolean, default: false },
    meals: [MealSchema]
});

export default mongoose.models.Ticket ||
    mongoose.model("Ticket", TicketSchema);
