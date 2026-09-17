"use client";

import React, { useState, useEffect, useRef } from "react";
import FILE_SYSTEM from "@/app/components/filesystem.json";
import THEMES from "@/app/components/theme.json";
import NAVBAR_COMMANDS from "@/app/components/navbar_command.json";
import { renderRichText } from "../components/StarterText";
import { getDirectoryAt } from "../functions/getDirectoryAt";
import { PowerOff } from "../components/PowerOff";
import { Header } from "../components/Header";
import { TerminalInput } from "../components/TerminalInput";
import { TERMINALBODY } from "../components/TerminalMainBody";
import Error from "next/error";
import { FaLeaf } from "react-icons/fa";

export function TerminalPortfolio() {
  const [currentPath, setCurrentPath] = useState(["~"]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [themeName, setThemeName] = useState("matrix");
  const [isPoweredOff, setIsPoweredOff] = useState(false);
  const terminalEndRef = useRef(null);
  const [isthinking, setisthinking] = useState(false);

  useEffect(() => {
    runneofetch();
  }, []);

  const runneofetch = () => {
    const initialHist = [];
    appendneofetchoutput(initialHist);
    setHistory(initialHist);
  };

  const appendneofetchoutput = (histArray) => {
    histArray.push({ type: "neofetch" });
  };

  useEffect(() => {
    if (!input.trim()) {
      setSuggestion("");
      return;
    }
    const currentDir = getDirectoryAt(currentPath);
    const availableFiles = currentDir ? Object.keys(currentDir.contents) : [];
    const parts = input.split(" ");
    const cmd = parts[0].toLowerCase();

    if (parts.length > 1 && ["cd", "cat"].includes(cmd)) {
      const argPrefix = parts.slice(1).join(" ");
      const match = availableFiles.find((f) =>
        f.toLowerCase().startsWith(argPrefix.toLowerCase()),
      );
      if (match && `${parts[0]} ${match}` !== input) {
        setSuggestion(`${parts[0]} ${match}`);
      } else {
        setSuggestion("");
      }
      return;
    }

    const allOptions = [
      "help",
      "ls",
      "cd",
      "cat",
      "pwd",
      "clear",
      "neofetch",
      "whoami",
      "reboot",
      "poweroff",
      "logout",
      "theme",
      "sound",
      "sudo",
      "/ai",
      ...NAVBAR_COMMANDS,
      ...availableFiles,
    ];

    const match = allOptions.find((opt) => opt.startsWith(input.toLowerCase()));
    if (match && match !== input) {
      setSuggestion(match);
    } else {
      setSuggestion("");
    }
  }, [input, currentPath]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    const hex = THEMES[themeName].bgHex;
    const prevHtml = document.documentElement.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = hex;
    document.body.style.backgroundColor = hex;
    return () => {
      document.documentElement.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, [themeName]);

  const pathString = currentPath.join("/").replace("~", "~");

  const executeCommand = async (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const newHistory = [
      ...history,
      { type: "command", path: pathString, text: trimmed },
    ];
    setInput("");
    setSuggestion("");

    const [baseCmd, ...args] = trimmed.split(" ");
    const arg1 = args[0];
    const currentDir = getDirectoryAt(currentPath);

    switch (baseCmd.toLowerCase()) {
      case "help":
        appendHelpOutput(newHistory);
        break;

      case "/ai":
        if (!args || args == "") {
          newHistory.push({
            type: "error",
            text: "command cannot be empty, provide text needed to pass to AI",
          });
        } else {
          const restword = args.join(" ");

          try {
            setisthinking(true);
            const res = await fetch("/api/gemini", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: restword,
              }),
            });

            if (res.status !== 200) {
              throw new Error("Failed to get AI response, backend failed");
            }
            const data = await res.json();
            newHistory.push({ type: "output", text: data.response });
            setisthinking(false);
          } catch (error) {
            newHistory.push({
              type: "error",
              text: "Sorry but the AI failed to get response, You can still try other functions",
            });

            setisthinking(false);
          }
        }
        break;

      case "ls":
        if (currentDir && currentDir.contents) {
          const items = Object.entries(currentDir.contents).map(
            ([name, obj]) => ({ name, type: obj.type }),
          );
          newHistory.push({ type: "ls", items });
        }
        break;

      case "pwd":
        newHistory.push({
          type: "success",
          text: `/home/ishan/${currentPath.slice(1).join("/")}`,
        });
        break;

      case "cd":
        if (!arg1 || arg1 === "~") {
          setCurrentPath(["~"]);
        } else if (arg1 === "..") {
          if (currentPath.length > 1) setCurrentPath(currentPath.slice(0, -1));
        } else {
          const target = currentDir?.contents?.[arg1];
          if (target && target.type === "dir") {
            setCurrentPath([...currentPath, arg1]);
          } else if (target && target.type === "file") {
            newHistory.push({
              type: "error",
              text: `cd: not a directory: ${arg1}`,
            });
          } else {
            newHistory.push({
              type: "error",
              text: `cd: no such file or directory: ${arg1}`,
            });
          }
        }
        break;

      case "cat":
        if (!arg1) {
          newHistory.push({ type: "error", text: "cat: missing file operand" });
        } else {
          const fileObj = currentDir?.contents?.[arg1];
          if (fileObj && fileObj.type === "file") {
            newHistory.push({ type: "rich", text: fileObj.content });
          } else if (fileObj && fileObj.type === "dir") {
            newHistory.push({
              type: "error",
              text: `cat: ${arg1}: Is a directory`,
            });
          } else {
            newHistory.push({
              type: "error",
              text: `cat: ${arg1}: No such file`,
            });
          }
        }
        break;

      case "clear":
        setHistory([]);
        return;

      case "neofetch":
        newHistory.push({ type: "neofetch" });
        break;

      case "whoami":
        newHistory.push({
          type: "success",
          text: "ishan (guest_user@portfolio)",
        });
        break;

      case "reboot":
        setHistory([{ type: "warn", text: "System rebooting..." }]);
        setTimeout(() => runneofetch(), 1000);
        return;

      case "poweroff":
      case "logout":
        setIsPoweredOff(true);
        return;

      case "theme":
        if (arg1 && THEMES[arg1.toLowerCase()]) {
          setThemeName(arg1.toLowerCase());
          newHistory.push({
            type: "success",
            text: `Theme updated to '${arg1.toLowerCase()}'.`,
          });
        } else {
          newHistory.push({
            type: "output",
            text: `Available themes: ${Object.keys(THEMES).join(", ")}`,
          });
        }
        break;

      case "sound":
        newHistory.push({
          type: "warn",
          text: "We are working on sound feature !! \n You will gonna get it soon! Till then explore some other options",
        });
        break;

      case "sudo":
        newHistory.push({
          type: "warn",
          text: ": You can't fool me !! You are not Ishan Jaiswal, nice try though.",
        });
        break;

      case "about":
        newHistory.push({
          type: "rich",
          text: FILE_SYSTEM["~"].contents["about.txt"].content,
        });
        break;

      case "skills":
        newHistory.push({
          type: "rich",
          text: FILE_SYSTEM["~"].contents["skills.txt"].content,
        });
        break;

      case "contact":
        newHistory.push({
          type: "rich",
          text: FILE_SYSTEM["~"].contents["contact.txt"].content,
        });
        break;

      case "experience":
        newHistory.push({
          type: "rich",
          text: FILE_SYSTEM["~"].contents["experience.txt"].content,
        });
        break;

      case "education":
        newHistory.push({
          type: "rich",
          text: FILE_SYSTEM["~"].contents["education.txt"].content,
        });
        break;

      case "certifications":
        newHistory.push({
          type: "rich",
          text: FILE_SYSTEM["~"].contents["certifications.txt"].content,
        });
        break;

      case "projects":
        newHistory.push({ type: "projects" });
        break;

      default:
        newHistory.push({
          type: "error",
          text: `Command not found: ${trimmed}. Type 'help' for available options or use`,
        });
        newHistory.push({
          type: "rich",
          text: "or use {cyan}/ai [message]{/cyan} to get answer from AI-BOT",
        });
    }

    setHistory(newHistory);
  };

  // const runHelpCommand = () => {
  //   const initialHist = [];
  //   appendHelpOutput(initialHist);
  //   setHistory(initialHist);
  // };

  const appendHelpOutput = (histArray) => {
    histArray.push({ type: "help" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion("");
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input);
    }
  };

  const theme = THEMES[themeName];

  if (isPoweredOff) {
    return (
      <PowerOff
        runHelpCommand={runneofetch}
        setIsPoweredOff={setIsPoweredOff}
      />
    );
  }

  return (
    <div
      className={`h-full overflow-y-auto touch-pan-y overscroll-contain ${theme.bg} ${theme.text} font-mono p-3 sm:p-6 flex flex-col justify-between select-none transition-colors duration-200 [scroll]`}
      style={{ backgroundColor: theme.bgHex, touchAction: "pan-y" }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Header executeCommand={executeCommand} themename={themeName} />

      {/* Main Command History Output */}
      <TERMINALBODY
        executeCommand={executeCommand}
        renderRichText={renderRichText}
        themeName={themeName}
        history={history}
        terminalEndRef={terminalEndRef}
      />

      {/* Terminal Command Input Prompt */}
      <TerminalInput
        setInput={setInput}
        suggestion={suggestion}
        currentPath={currentPath}
        input={input}
        handleKeyDown={handleKeyDown}
        isthinking={isthinking}
      />
    </div>
  );
}
