import connectDB from "@/lib/mongodb";
import ScanLog from "@/models/ScanLog";

export async function GET() {
    await connectDB();

    const logs = await ScanLog.find().sort({ scannedAt: -1 });

    const header = "TicketId,Day,Type,Status,Timestamp\n";

    const rows = logs.map(log =>
        `${log.ticketId},${log.day},${log.type},${log.status},${log.scannedAt.toISOString()}`
    ).join("\n");

    const csv = header + rows;

    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=scan-logs.csv",
        },
    });
}
