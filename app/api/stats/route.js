import connectDB from "@/lib/mongodb";
import Ticket from "@/models/Ticket";


export async function GET() {
    await connectDB();

    const tickets = await Ticket.find();

    const totalTickets = tickets.length;
    let totalEntry = 0;

    const meals = {
        "1": { breakfast: 0, lunch: 0, dinner: 0 },
        "2": { breakfast: 0, lunch: 0, dinner: 0 },
        "3": { breakfast: 0, lunch: 0, dinner: 0 },
    };

    tickets.forEach(ticket => {
        if (ticket.entryUsed) totalEntry++;

        ticket.meals.forEach(meal => {
            if (meal.used) {
                meals[meal.day][meal.type]++;
            }
        });
    });

    return Response.json({
        totalTickets,
        totalEntry,
        meals
    });
}
