import { HELP } from "../commands/help";
import { NEOFETCH } from "../commands/neofetch";
import { Projects } from "../commands/projects";
import ANSI from "@/app/components/ANSI.json";
import { RAINBOW } from "../functions/rainbow";
import { fileColor } from "../functions/filecolor";
import ReactMarkdown from "react-markdown";

export function TERMINALBODY({
  themeName,
  renderRichText,
  executeCommand,
  history,
  terminalEndRef
}) {
  return (
    <div className="w-full max-w-5xl mx-auto flex-1 overflow-y-auto space-y-3 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {history.map((item, idx) => (
        <div key={idx} className="space-y-1">
          {item.type === "command" && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ color: ANSI.green }}>┌─(</span>
                <span style={{ color: ANSI.purple, fontWeight: 700 }}>
                  ishan
                </span>
                <span style={{ color: ANSI.green }}>@</span>
                <span style={{ color: ANSI.cyan, fontWeight: 700 }}>
                  portfolio
                </span>
                <span style={{ color: ANSI.green }}>)-[{item.path}]</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: ANSI.green }}>└─</span>
                <span style={{ color: ANSI.orange, fontWeight: 700 }}>$</span>
                <span style={{ color: ANSI.white, fontWeight: 700 }}>
                  <ReactMarkdown>{item.text}</ReactMarkdown>
                </span>
              </div>
            </div>
          )}

          {item.type === "output" && (
            <div
              className="text-sm whitespace-pre-wrap leading-relaxed"
              style={{ color: ANSI.gray }}
            >
              {item.text}
            </div>
          )}

          {item.type === "success" && (
            <div
              className="text-sm flex items-start gap-2"
              style={{ color: ANSI.green }}
            >
              <span>✓</span>
              <span>{item.text}</span>
            </div>
          )}

          {item.type === "warn" && (
            <div
              className="text-sm flex items-start gap-2"
              style={{ color: ANSI.yellow }}
            >
              <span>⚠</span>
              <span>{item.text}</span>
            </div>
          )}

          {item.type === "error" && (
            <div
              className="text-sm flex items-start gap-2"
              style={{ color: ANSI.red }}
            >
              <span>✗</span>
              <span>{item.text}</span>
            </div>
          )}

          {item.type === "rich" && (
            <div className="text-sm leading-relaxed">
              {renderRichText(item.text)}
            </div>
          )}

          {item.type === "ls" && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm my-1">
              {item.items.map((entry, i) => (
                <span
                  key={i}
                  onClick={() =>
                    executeCommand(
                      entry.type === "dir"
                        ? `cd ${entry.name}`
                        : `cat ${entry.name}`,
                    )
                  }
                  className="cursor-pointer hover:underline font-semibold"
                  style={{ color: fileColor(entry.name, entry.type) }}
                >
                  {entry.name}
                  {entry.type === "dir" ? "/" : ""}
                </span>
              ))}
            </div>
          )}

          {item.type === "bloglist" && (
            <div className="text-sm space-y-1">
              <div style={{ color: ANSI.purple, fontWeight: 700 }}>
                Tech Articles &amp; Blogs:
              </div>
              {item.items.map((b, i) => (
                <div
                  key={i}
                  className="cursor-pointer hover:underline"
                  style={{ color: RAINBOW[i % RAINBOW.length] }}
                  onClick={() => executeCommand(`blogs ${b}`)}
                >
                  • {b}
                </div>
              ))}
              <div style={{ color: ANSI.gray }} className="pt-1">
                Type 'blogs &lt;filename&gt;' or 'cat blogs/&lt;filename&gt;' to
                read.
              </div>
            </div>
          )}

          {item.type === "help" && <HELP />}
          {item.type === "projects" && <Projects />}
          {item.type === "neofetch" && <NEOFETCH themename={themeName} />}
        </div>
      ))}
      <div ref={terminalEndRef} />
    </div>
  );
}
