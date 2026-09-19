"use client";
import React, { useState } from "react";
import { TerminalPortfolio } from "./TerminalUI/TerminalUI";
import { IdCard } from "./components/RubberBandID";

export default function Page() {
  const [activeTab, setActiveTab] = useState("terminal");

  return (
    <div className="relative min-h-screen bg-[#0c0e12] overflow-x-hidden">
      <div className="md:hidden fixed top-4 right-4 z-50 flex bg-[#181b20] border border-[#38bdf8]/40 rounded-lg p-1 shadow-lg">
        <button
          onClick={() => setActiveTab("terminal")}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
            activeTab === "terminal"
              ? "bg-[#ff79c6] text-black font-bold"
              : "text-[#94a3b8] hover:text-white"
          }`}
        >
          &gt;_ Terminal
        </button>
        <button
          onClick={() => setActiveTab("card")}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
            activeTab === "card"
              ? "bg-[#50fa7b] text-black font-bold"
              : "text-[#94a3b8] hover:text-white"
          }`}
        >
          [ID] Card
        </button>
      </div>

      <div className="flex w-full h-screen">
        <div
          className={`w-full md:flex-1 h-full ${
            activeTab === "terminal" ? "block" : "hidden md:block"
          }`}
        >
          <TerminalPortfolio />
        </div>

        <div className="hidden md:flex flex-col items-center justify-between py-6 px-1 relative z-20">
          <span className="font-mono text-[10px] text-[#8be9fd] select-none">
            +
          </span>

          <div className="w-[2px] flex-1 bg-[#244130] opacity-80" />

          <span className="font-mono text-[10px] text-[#8be9fd] select-none">
            +
          </span>
        </div>

        <div
          className={`w-full md:w-[450px] lg:w-[500px] h-full ${
            activeTab === "card" ? "block" : "hidden md:block"
          }`}
        >
          <IdCard />
        </div>
      </div>
    </div>
  );
}
