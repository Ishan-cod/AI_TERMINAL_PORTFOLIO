import React from "react";
import THEMES from "@/app/components/theme.json";
import { RAINBOW } from "../functions/rainbow";
import ANSI from "@/app/components/ANSI.json";
import asciiart from "@/app/commands/asciiart.js";

export function NEOFETCH({ themeName = "matrix" }) {
  const theme = THEMES[themeName];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      {/* ASCII ART */}
      <div className="md:col-span-7 hidden sm:flex items-center justify-center overflow-hidden">
        <pre
          className="font-mono leading-[0.88] text-[9px] sm:text-[10px] md:text-[11px]"
          style={{
            whiteSpace: "pre",
          }}
        >
          {asciiart.map((line, i) => (
            <div
              key={i}
              style={{
                color: RAINBOW[i % RAINBOW.length],
              }}
            >
              {line}
            </div>
          ))}
        </pre>
      </div>

      {/* SYSTEM INFORMATION */}
      <div className="md:col-span-5 font-mono text-sm sm:text-md leading-relaxed">
        {/* Username */}
        <div
          className="font-bold text-sm sm:text-base mb-1"
          style={{ color: ANSI.orange }}
        >
          ishan@portfolio
        </div>

        <div className="mb-3" style={{ color: ANSI.orange }}>
          ────────────────
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Name:
            </span>{" "}
            <span style={{ color: ANSI.white }}>Ishan Jaiswal</span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Role:
            </span>{" "}
            <span style={{ color: ANSI.white }}>
              undergrad Computer science
            </span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Age:
            </span>{" "}
            <span style={{ color: ANSI.white }}>20</span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Experience:
            </span>{" "}
            <span style={{ color: ANSI.white }}>{">-<"} Years</span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Skills:
            </span>{" "}
            <span style={{ color: ANSI.white }}>
              JavaScript, ExpressJS, NodeJS, NextJS, C++, ReactJS, Socket.io,
              Python, Machine Learning
            </span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Projects:
            </span>{" "}
            <span style={{ color: ANSI.white }}>
              Errorbattle, TTS voice detector SDK, NeerMitra
            </span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              OS [system]:
            </span>{" "}
            <span style={{ color: ANSI.white }}>{navigator.platform}</span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Resolution [system] :
            </span>{" "}
            <span style={{ color: ANSI.white }}>
              {screen.width}x{screen.height}
            </span>
          </p>

          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Theme:
            </span>{" "}
            <span style={{ color: ANSI.green }}>{themeName}</span>
          </p>



          <p>
            <span className="font-bold" style={{ color: ANSI.orange }}>
              Memory [system]:
            </span>{" "}
            <span style={{ color: ANSI.white }}>
              {navigator.deviceMemory} GB
            </span>
          </p>
        </div>

        {/* Color palette */}
        <div className="flex gap-1 mt-3">
          {["#000000", ...RAINBOW].map((c, i) => (
            <span
              key={i}
              className="w-3.5 h-3.5"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
