import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req) {
    await connectDB();

    const { username, password } = await req.json();

    const admin = await Admin.findOne({ username, password });

    if (!admin) {
        return Response.json({ success: false });
    }

    return Response.json({ success: true, username });
}
