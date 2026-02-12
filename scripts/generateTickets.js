const fs = require("fs");

const tickets = [];

for (let i = 1; i <= 300; i++) {
    tickets.push({
        ticketId: `UNP${String(i).padStart(3, "0")}`,
        entry: false,
        days: {
            "1": { breakfast: false, lunch: false, dinner: false },
            "2": { breakfast: false, lunch: false, dinner: false },
            "3": { breakfast: false, lunch: false, dinner: false }
        }
    });
}

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/tickets.json", JSON.stringify(tickets, null, 2));

console.log("300 tickets generated!");
