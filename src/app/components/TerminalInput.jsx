import React from "react";
import THEME from "@/app/components/theme.json";
import ANSI from "@/app/components/ANSI.json";

export function TerminalInput({
  setInput,
  suggestion,
  currentPath,
  input,
  handleKeyDown,
  isthinking,
}) {
  const theme = THEME["matrix"];
  const pathString = currentPath.join("/").replace("~", "~");

  return (
    <div
      className={`w-full max-w-5xl mx-auto mt-2 pt-2 border-0 ${theme.border}`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs sm:text-sm shrink-0"
            style={{ color: ANSI.green }}
          >
            ┌─(
          </span>
          <span
            className="text-xs sm:text-sm font-bold shrink-0"
            style={{ color: ANSI.purple }}
          >
            ishan
          </span>
          <span
            className="text-xs sm:text-sm shrink-0"
            style={{ color: ANSI.green }}
          >
            @
          </span>
          <span
            className="text-xs sm:text-sm font-bold shrink-0"
            style={{ color: ANSI.cyan }}
          >
            portfolio
          </span>
          <span
            className="text-xs sm:text-sm shrink-0"
            style={{ color: ANSI.green }}
          >
            )-[{pathString}]
          </span>
        </div>

        <div className="relative flex items-center flex-wrap gap-1">
          <span className="shrink-0" style={{ color: ANSI.green }}>
            └─
          </span>
          <span
            className="mr-2 font-bold shrink-0"
            style={{ color: ANSI.orange }}
          >
            $
          </span>

          {isthinking ? (
            <div className="flex items-center gap-1 text-zinc-400 font-mono">
              <span className="flex gap-0.5">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:-0.15s]">
                  .
                </span>
                <span className="animate-bounce [animation-delay:-0.3s]">
                  .
                </span>
              </span>
              <span>thinking</span>
              <span className="flex gap-0.5">
                <span className="animate-bounce [animation-delay:-0.3s]">
                  .
                </span>
                <span className="animate-bounce [animation-delay:-0.15s]">
                  .
                </span>
                <span className="animate-bounce">.</span>
              </span>
            </div>
          ) : (
            <div className="relative flex-1 flex items-center min-w-[120px]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none font-mono text-sm z-10"
                style={{ color: ANSI.white, caretColor: ANSI.green }}
                placeholder="Type help to know commands available"
                autoFocus
              />
              {suggestion && (
                <span
                  className="absolute left-0 pointer-events-none font-mono text-sm z-0"
                  style={{ color: ANSI.gray }}
                >
                  {suggestion}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
