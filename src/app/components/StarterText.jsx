import React from "react";
import ANSI from "@/app/components/ANSI.json";

const inlineColors = {
  green: ANSI.green,
  cyan: ANSI.cyan,
  yellow: ANSI.yellow,
  magenta: ANSI.magenta,
  red: ANSI.red,
  orange: ANSI.orange,
  white: ANSI.white,
  gray: ANSI.gray,
};

function renderInlineText(text) {
  const regex =
    /{(green|cyan|yellow|magenta|red|orange|white|gray|bold)}([\s\S]*?){\/\1}/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Normal text before the styled part
    if (match.index > lastIndex) {
      parts.push(
        <React.Fragment key={`text-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </React.Fragment>,
      );
    }

    const tag = match[1];
    const content = match[2];

    parts.push(
      <span
        key={`styled-${match.index}`}
        style={{
          color: tag === "bold" ? ANSI.white : inlineColors[tag],
          fontWeight: tag === "bold" ? 700 : undefined,
        }}
      >
        {content}
      </span>,
    );

    lastIndex = regex.lastIndex;
  }

  // Remaining normal text
  if (lastIndex < text.length) {
    parts.push(
      <React.Fragment key={`text-${lastIndex}`}>
        {text.slice(lastIndex)}
      </React.Fragment>,
    );
  }

  return parts.length ? parts : [text];
}

export function renderRichText(text) {
  return text.split("\n").map((line, i) => {
    // # Heading
    if (line.startsWith("# ")) {
      return (
        <div
          key={i}
          className="text-base sm:text-lg"
          style={{
            color: ANSI.magenta,
            fontWeight: 700,
          }}
        >
          {renderInlineText(line)}
        </div>
      );
    }

    // Bullet points
    if (/^\s*[-•]/.test(line)) {
      return (
        <div
          key={i}
          className="text-sm sm:text-base"
          style={{ color: ANSI.cyan }}
        >
          {renderInlineText(line)}
        </div>
      );
    }

    // KEY : value lines
    const kv = line.match(/^([A-Z][A-Z0-9 _/]*?)(\s*:\s*)(.*)$/);

    if (kv) {
      return (
        <div key={i} className="text-sm sm:text-base">
          <span
            style={{
              color: ANSI.orange,
              fontWeight: 700,
            }}
          >
            {kv[1]}
          </span>

          <span style={{ color: ANSI.gray }}>{kv[2]}</span>

          <span style={{ color: ANSI.white }}>{renderInlineText(kv[3])}</span>
        </div>
      );
    }

    // Normal text
    return (
      <div
        key={i}
        className="text-[15px] sm:text-base leading-7"
        style={{ color: ANSI.gray }}
      >
        {line ? renderInlineText(line) : "\u00A0"}
      </div>
    );
  });
}
