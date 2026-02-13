"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const router = useRouter();


    const fetchLogs = async () => {
        const res = await fetch("/api/logs");
        const data = await res.json();
        setLogs(data);
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#07121a] to-[#020617] text-white p-8">
            <h1 className="text-4xl font-bold text-teal-400 mb-8">
                Scan Logs
            </h1>

            <button
                onClick={() => router.push("/")}
                className="mb-6 bg-white/10 border border-white/20 hover:bg-white/20 transition px-4 py-2 rounded-xl text-sm"
            >
                ← Back to Admin
            </button>


            <div className="overflow-x-auto">
                <a
                    href="/api/logs/export"
                    className="mb-6 inline-block bg-teal-500 hover:bg-teal-600 transition px-4 py-2 rounded-xl font-semibold"
                >
                    Export CSV
                </a>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-white/10 text-left">
                            <th className="p-3">Ticket</th>
                            <th className="p-3">Admin</th>
                            <th className="p-3">Day</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id} className="border-b border-white/10">
                                <td className="p-3">{log.ticketId}</td>
                                <td className="p-3 text-teal-400 font-semibold">
                                    {log.admin || "—"}
                                </td>
                                <td className="p-3">{log.day}</td>
                                <td className="p-3 capitalize">{log.type}</td>
                                <td
                                    className={`p-3 font-semibold ${log.status === "success"
                                        ? "text-green-400"
                                        : log.status === "already_used"
                                            ? "text-yellow-400"
                                            : "text-red-400"
                                        }`}
                                >
                                    {log.status}
                                </td>
                                <td className="p-3">
                                    {new Date(log.scannedAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
