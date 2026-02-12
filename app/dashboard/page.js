"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";




export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("admin") !== "true") {
            router.push("/");
        }
    }, []);

    const fetchStats = async () => {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
    };

    useEffect(() => {
        fetchStats();

        const interval = setInterval(fetchStats, 5000); // auto refresh every 5s
        return () => clearInterval(interval);
    }, []);

    if (!stats) return <div className="text-white p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#07121a] to-[#020617] text-white p-8">

            <h1 className="text-4xl font-bold text-teal-400 mb-10">
                UNPLUG Dashboard
            </h1>

            {/* Top Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <StatCard title="Total Tickets" value={stats.totalTickets} />
                <StatCard title="Total Entries" value={stats.totalEntry} />
            </div>

            {/* Meals */}
            {["1", "2", "3"].map(day => (
                <div key={day} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-300">
                        Day {day}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <StatCard title="Breakfast" value={stats.meals[day].breakfast} />
                        <StatCard title="Lunch" value={stats.meals[day].lunch} />
                        <StatCard title="Dinner" value={stats.meals[day].dinner} />
                    </div>
                </div>
            ))}

        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg text-gray-300 mb-2">{title}</h3>
            <p className="text-4xl font-bold text-teal-400">{value}</p>
        </div>
    );
}

