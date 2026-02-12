import fs from "fs";
import path from "path";

export async function POST(req) {
    const { ticketId, day, type } = await req.json();

    const filePath = path.join(process.cwd(), "data", "tickets.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const ticket = data.find(t => t.ticketId === ticketId);

    if (!ticket) {
        return Response.json({ status: "invalid" });
    }

    // ENTRY CHECK (only once)
    if (type === "entry") {
        if (ticket.entry) {
            return Response.json({ status: "already_used" });
        }

        ticket.entry = true;
    } else {
        // MEAL CHECK (day-wise)
        if (ticket.days[day][type]) {
            return Response.json({ status: "already_used" });
        }

        ticket.days[day][type] = true;
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return Response.json({ status: "success" });
}
