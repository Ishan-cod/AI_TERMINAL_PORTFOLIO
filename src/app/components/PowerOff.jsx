import React from "react";
import ANSI from '@/app/components/ANSI.json'
import { Power } from "lucide-react";

export function PowerOff({ setIsPoweredOff, runHelpCommand }) {
    return (
        <div className="min-h-screen bg-black text-slate-500 flex flex-col items-center justify-center font-mono p-4">
            <p className="mb-4 text-sm" style={{ color: ANSI.gray }}>System powered off.</p>
            <button
                onClick={() => {
                    setIsPoweredOff(false);
                    runHelpCommand();
                }}
                className="px-4 py-2 rounded flex items-center gap-2 text-sm border transition"
                style={{ background: 'rgba(80,250,123,0.1)', color: ANSI.green, borderColor: 'rgba(80,250,123,0.4)' }}
            >
                <Power size={14} /> Power On System
            </button>
        </div>
    );
}