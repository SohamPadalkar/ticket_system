import connectDB from "@/lib/mongodb";
import ScanLog from "@/models/ScanLog";

export async function GET() {
    await connectDB();

    const logs = await ScanLog.find()
        .sort({ scannedAt: -1 })
        .limit(200); // last 200 scans

    return Response.json(logs);
}
