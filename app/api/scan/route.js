import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const { ticketId, day, type } = await req.json();

        const filePath = path.join(process.cwd(), "data", "tickets.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const cleanedId = ticketId.trim().toUpperCase();

        const ticket = data.find(
            (t) => t.ticketId.trim().toUpperCase() === cleanedId
        );

        if (!ticket) {
            return Response.json({ status: "invalid" });
        }

        // ENTRY LOGIC
        if (type === "entry") {
            if (ticket.entry === true) {
                return Response.json({ status: "already_used" });
            }

            ticket.entry = true;
        }

        // MEAL LOGIC
        else {
            if (!ticket.days || !ticket.days[day]) {
                return Response.json({ status: "invalid" });
            }

            if (ticket.days[day][type] === true) {
                return Response.json({ status: "already_used" });
            }

            ticket.days[day][type] = true;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return Response.json({ status: "success" });

    } catch (error) {
        console.error("Scan API Error:", error);
        return Response.json({ status: "invalid" });
    }
}
