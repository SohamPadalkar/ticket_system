"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function ScannerPage() {
    const router = useRouter();

    const scannerRef = useRef(null);
    const isRunningRef = useRef(false);

    const [status, setStatus] = useState(null);
    const [day, setDay] = useState("1");
    const [type, setType] = useState("entry");
    const [manualTicket, setManualTicket] = useState("");

    // 🔐 Protect Route
    useEffect(() => {
        if (localStorage.getItem("admin") !== "true") {
            router.push("/");
        }
    }, []);

    useEffect(() => {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        const startScanner = async () => {
            try {
                await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: 250 },
                    async (decodedText) => {
                        if (!isRunningRef.current) return;
                        isRunningRef.current = false;
                        await handleScan(decodedText);
                    }
                );
                isRunningRef.current = true;
            } catch (err) {
                console.error("Camera start error:", err);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && isRunningRef.current) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, []);

    const restartScanner = async () => {
        try {
            await scannerRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    if (!isRunningRef.current) return;
                    isRunningRef.current = false;
                    await handleScan(decodedText);
                }
            );
            isRunningRef.current = true;
        } catch (err) {
            console.error("Restart error:", err);
        }
    };

    const handleScan = async (ticketId) => {
        if (scannerRef.current && isRunningRef.current) {
            await scannerRef.current.stop().catch(() => { });
            isRunningRef.current = false;
        }

        const res = await fetch("/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ticketId,
                day,
                type,
            }),
        });

        const data = await res.json();
        setStatus(data.status);
        // 📳 Vibration Feedback (mobile only)
        if (typeof window !== "undefined" && navigator.vibrate) {
            if (data.status === "success") {
                navigator.vibrate(100); // short buzz
            } else if (data.status === "already_used") {
                navigator.vibrate([200, 100, 200]); // double buzz
            } else if (data.status === "invalid") {
                navigator.vibrate(400); // long buzz
            }
        }


        setTimeout(async () => {
            setStatus(null);
            await restartScanner();
        }, 2000);
    };

    const handleManualSubmit = async () => {
        if (!manualTicket.trim()) return;
        await handleScan(manualTicket.trim());
        setManualTicket("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#07121a] to-[#020617] text-white flex flex-col items-center px-4 py-10">

            <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-10 tracking-wide">
                UNPLUG Scanner
            </h1>

            <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">

                    {type !== "entry" && (
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white"
                        >
                            <option value="1">Day 1</option>
                            <option value="2">Day 2</option>
                            <option value="3">Day 3</option>
                        </select>
                    )}

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white"
                    >
                        <option value="entry">Entry</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                    </select>
                </div>

                {/* Camera */}
                <div className="rounded-2xl overflow-hidden mb-6">
                    <div id="reader" className="w-full" />
                </div>

                {/* Manual Entry */}
                <div className="flex flex-col md:flex-row gap-4">

                    <input
                        type="text"
                        placeholder="Enter Ticket ID (e.g. UNP001)"
                        value={manualTicket}
                        onChange={(e) => setManualTicket(e.target.value)}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white"
                    />

                    <button
                        onClick={handleManualSubmit}
                        className="bg-teal-500/80 hover:bg-teal-600 transition px-6 py-3 rounded-xl font-semibold"
                    >
                        Submit
                    </button>

                </div>

            </div>

            {/* Status Overlay */}
            {status && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">

                    <div
                        className={`px-16 py-12 rounded-3xl text-center shadow-2xl text-5xl font-extrabold ${status === "success"
                            ? "bg-green-500/90"
                            : status === "already_used"
                                ? "bg-yellow-400/90 text-black"
                                : "bg-red-500/90"
                            }`}
                    >
                        {status === "success" && "✓ SUCCESS"}
                        {status === "already_used" && "⚠ ALREADY USED"}
                        {status === "invalid" && "✕ INVALID"}
                    </div>

                </div>
            )}
        </div>
    );
}
