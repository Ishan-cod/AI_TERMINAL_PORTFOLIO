import React from "react";
import { RAINBOW } from "../functions/rainbow";
import NAVBAR_COMMANDS from '@/app/components/navbar_command.json'
import ANSI from '@/app/components/ANSI.json'
import { RefreshCw } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import THEME from '@/app/components/theme.json'

export function Header({executeCommand, themename}) {
    const theme = THEME[themename]

    return (<>
        <div className="w-full max-w-5xl mx-auto mb-4">
            <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b ${theme.border}`}>
                <button className="p-1.5 hover:bg-white/10 rounded shrink-0" style={{ color: ANSI.gray }}>
                    <ChevronLeft size={16} />
                </button>

                {NAVBAR_COMMANDS.map((cmd, i) => {
                    const c = ANSI.gray;
                    return (
                        <button
                            key={cmd}
                            onClick={() => executeCommand(cmd)}
                            className="px-3 py-1 text-sm flex items-center gap-1 shrink-0 hover:cursor-pointer font-mono border"
                            style={{ borderColor: `${c}55`, color: ANSI.gray, background: `${c}0f` }}
                        >
                            {cmd}
                        </button>
                    );
                })}

                <button className="p-1.5 hover:bg-white/10 rounded shrink-0" style={{ color: ANSI.gray }}>
                    <ChevronRight size={16} />
                </button>

                <div className="ml-auto flex items-center gap-2 pl-2">
                    <button onClick={() => executeCommand('reboot')} className="p-1.5 hover:bg-white/10 rounded" title="Reboot" style={{ color: ANSI.orange }}>
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>
        </div>
    </>)
}