import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
});

export default mongoose.models.Admin ||
    mongoose.model("Admin", AdminSchema);
