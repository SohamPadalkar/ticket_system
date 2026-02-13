import connectDB from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import ScanLog from "@/models/ScanLog";


export async function POST(req) {
    await connectDB();
    console.log("SCAN ROUTE HIT");
    const { ticketId, day, type, admin } = await req.json();
    console.log("Incoming:", { ticketId, day, type });

    const ticket = await Ticket.findOne({ ticketId });

    let status = "invalid";

    if (!ticket) {
        console.log("Creating log:", { ticketId, day, type, status });
        await ScanLog.create({ ticketId, day, type, status, admin });
        return Response.json({ status });
    }

    // ENTRY
    if (type === "entry") {
        if (ticket.entryUsed) {
            status = "already_used";
        } else {
            ticket.entryUsed = true;
            await ticket.save();
            status = "success";
        }


        await ScanLog.create({ ticketId, day, type, status });
        return Response.json({ status });
    }

    // MEAL
    const meal = ticket.meals.find(
        m => m.day === day && m.type === type
    );

    if (!meal || !meal.allowed) {
        status = "invalid";
    } else if (meal.used) {
        status = "already_used";
    } else {
        meal.used = true;
        await ticket.save();
        status = "success";
    }
    
    await ScanLog.create({ ticketId, day, type, status });

    return Response.json({ status });
}
