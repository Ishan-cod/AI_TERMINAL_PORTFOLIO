import React from "react";
import ANSI from "@/app/components/ANSI.json";
import SHORTCUTS from "@/app/components/shortcut_file.json";
import HELP_ROWS from "@/app/components/helprow.json";

export function HELP() {
  return (
    <div className="text-sm space-y-3">
      <div style={{ color: ANSI.magenta, fontWeight: 700 }}>
        Available commands:
      </div>
      <div className="space-y-0.5">
        {HELP_ROWS.map(([cmd, arg, desc], i) => (
          <div key={i} className="flex flex-wrap gap-x-2">
            <span
              style={{ color: ANSI.orange, fontWeight: 700, minWidth: "92px" }}
            >
              {cmd}
            </span>
            <span style={{ color: ANSI.purple, minWidth: "80px" }}>{arg}</span>
            <span style={{ color: ANSI.gray }}>- {desc}</span>
          </div>
        ))}
      </div>
      <div style={{ color: ANSI.cyan, fontWeight: 700 }}>-- Shortcuts --</div>
      <div className="space-y-0.5">
        {SHORTCUTS.map(([cmd, desc], i) => (
          <div key={i} className="flex flex-wrap gap-x-2">
            <span
              style={{ color: "#ff5f56", fontWeight: 700, minWidth: "92px" }}
            >
              {cmd}
            </span>
            <span style={{ color: ANSI.gray }}>- {desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
