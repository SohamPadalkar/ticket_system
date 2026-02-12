import fs from "fs";
import path from "path";

export async function GET() {
    const filePath = path.join(process.cwd(), "data", "tickets.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const totalTickets = data.length;

    let totalEntry = 0;

    const meals = {
        "1": { breakfast: 0, lunch: 0, dinner: 0 },
        "2": { breakfast: 0, lunch: 0, dinner: 0 },
        "3": { breakfast: 0, lunch: 0, dinner: 0 },
    };

    data.forEach(ticket => {
        if (ticket.entry) totalEntry++;

        ["1", "2", "3"].forEach(day => {
            ["breakfast", "lunch", "dinner"].forEach(meal => {
                if (ticket.days[day][meal]) {
                    meals[day][meal]++;
                }
            });
        });
    });

    return Response.json({
        totalTickets,
        totalEntry,
        meals,
    });
}
