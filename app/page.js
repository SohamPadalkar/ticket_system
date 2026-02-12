"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("admin") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("admin", "true");
      setIsLoggedIn(true);
    } else {
      alert("Wrong Password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#07121a] to-[#020617] text-white">

      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">

        <h1 className="text-3xl font-bold text-teal-400 mb-6">
          UNPLUG Admin Panel
        </h1>

        {!isLoggedIn ? (
          <>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded bg-black border border-gray-600 w-full mb-4"
            />

            <button
              onClick={handleLogin}
              className="bg-teal-500 hover:bg-teal-600 transition px-6 py-3 rounded w-full font-semibold"
            >
              Login
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-4">

            <button
              onClick={() => router.push("/scanner")}
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition px-6 py-3 rounded-2xl font-semibold"
            >
              Go to Scanner
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition px-6 py-3 rounded-2xl font-semibold"
            >
              View Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-600 transition px-6 py-3 rounded-2xl font-semibold"
            >
              Logout
            </button>


          </div>
        )}

      </div>
    </div>
  );
}
