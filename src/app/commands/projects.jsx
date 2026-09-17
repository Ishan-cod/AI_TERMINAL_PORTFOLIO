import React from "react";
import ANSI from "@/app/components/ANSI.json";

const projects = [
  {
    name: "Error-Battle",
    tag: "Full Stack & Real-Time",
    desc: "Real-time competitive programming platform for 1v1 and 1vN coding battles. Integrates the Codeforces API to assign unsolved problems, synchronizes matches over WebSockets, and maintains live rankings, match history, and scoring.",
    stack: ["Next.js", "Node.js", "WebSockets", "Codeforces API", "MongoDB"],
    href: "https://github.com/Ishan-cod/1v1cfbattle",
  },

  {
    name: "Neer-Mitra",
    tag: "Generative AI & Hackathon",
    desc: "GenAI groundwater intelligence assistant built for Smart India Hackathon. Uses LangChain and Gemini to interpret natural-language queries, dynamically retrieve INGRES groundwater data, and provide district-level insights with cached API responses.",
    stack: ["Next.js", "FastAPI", "LangChain", "Gemini", "INGRES API"],
    href: "https://github.com/Ishan-cod/nxt_app",
  },

  {
    name: "AI-Vue",
    tag: "AI & Full Stack",
    desc: "AI-powered mock interview platform that generates personalized questions, evaluates candidate responses, and produces structured feedback with a hireability score. Includes persistent interview sessions, user profiles, and JWT-based authentication.",
    stack: ["Next.js", "LangChain.js", "MongoDB", "JWT", "Tailwind CSS"],
    href: "https://github.com/Ishan-cod/AI_INTERVIEWEE",
  },

  {
    name: "Varta-Raksha",
    tag: "AI & Voice Security",
    desc: "Voice security pipeline combining TTS detection, voice matching, and contextual scam analysis. Fine-tuned on a Hindi speech dataset to distinguish AI-generated and human voices while analyzing speaker context for potential fraud indicators.",
    stack: ["Python", "FastAPI", "Whisper", "PyTorch", "Ollama", "Qwen3:1.7b"],
    href: "https://github.com/Ishan-cod/VartaRaksha",
  },
];

export function Projects() {
  return (
    <div className="my-3 font-mono">
      {/* Terminal prompt */}
      <div className="text-sm sm:text-base" style={{ color: ANSI.gray }}>
        <span style={{ color: ANSI.gray }}>~/projects</span>
      </div>

      {/* Projects */}
      <div className="mt-6 space-y-8">
        {projects.map((project) => (
          <div
            key={project.name}
            className="group border-0 pl-5 sm:pl-6 transition-all duration-200 hover:border-[#50fa7b]"
            style={{ borderColor: ANSI.gray }}
          >
            {/* Title + tag + button */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-lg sm:text-xl font-bold tracking-wide transition-colors duration-200"
                style={{ color: ANSI.yellow }}
              >
                {project.name}
              </span>

              <span
                className="text-xs sm:text-sm"
                style={{ color: ANSI.magenta }}
              >
                [ {project.tag} ]
              </span>

              {/* Project button */}
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    ml-auto
                    text-xs
                    px-2.5
                    py-1
                    border
                    rounded
                    transition-all
                    duration-200
                    hover:bg-green-400/10
                    hover:translate-x-0.5
                  "
                  style={{
                    color: ANSI.cyan,
                    borderColor: ANSI.gray,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = ANSI.green;
                    e.currentTarget.style.color = ANSI.green;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = ANSI.gray;
                    e.currentTarget.style.color = ANSI.cyan;
                  }}
                >
                  View github
                </a>
              )}
            </div>

            {/* Description */}
            <p
              className="
                mt-2
                text-sm
                sm:text-base
                leading-7
                tracking-wide
                max-w-5xl 
              "
              style={{ color: ANSI.gray }}
            >
              {project.desc}
            </p>

            {/* Stack */}
            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs sm:text-sm"
                  style={{ color: ANSI.orange }}
                >
                  [{tech}]
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
