"use client";

import { useEffect, useRef, useState } from "react";

export default function TypingCat() {
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [mouthPressed, setMouthPressed] = useState(false);

  const leftPressedKeys = useRef(new Set());
  const rightPressedKeys = useRef(new Set());

  const [position, setPosition] = useState({
    x: 780,
    y: 500,
  });

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const leftKeys = new Set([
      "Backquote",
      "Digit1",
      "Digit2",
      "Digit3",
      "Digit4",
      "Digit5",
      "Minus",
      "Equal",
      "KeyQ",
      "KeyW",
      "KeyE",
      "KeyR",
      "KeyT",
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyF",
      "KeyG",
      "KeyZ",
      "KeyX",
      "KeyC",
      "KeyV",
      "KeyB",
      "Tab",
      "CapsLock",
      "ShiftLeft",
      "ControlLeft",
      "AltLeft",
    ]);

    const rightKeys = new Set([
      "Digit6",
      "Digit7",
      "Digit8",
      "Digit9",
      "Digit0",
      "KeyY",
      "KeyU",
      "KeyI",
      "KeyO",
      "KeyP",
      "KeyH",
      "KeyJ",
      "KeyK",
      "KeyL",
      "KeyN",
      "KeyM",
      "Semicolon",
      "Quote",
      "Comma",
      "Period",
      "Slash",
      "ShiftRight",
      "ControlRight",
      "AltRight",
      "Enter",
      "Backspace",
      "Delete",
    ]);

    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        setMouthPressed(true);
        return;
      }

      if (leftKeys.has(e.code)) {
        leftPressedKeys.current.add(e.code);
        setLeftPressed(true);
      }

      if (rightKeys.has(e.code)) {
        rightPressedKeys.current.add(e.code);
        setRightPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        setMouthPressed(false);
        return;
      }

      if (leftKeys.has(e.code)) {
        leftPressedKeys.current.delete(e.code);
        setLeftPressed(leftPressedKeys.current.size > 0);
      }

      if (rightKeys.has(e.code)) {
        rightPressedKeys.current.delete(e.code);
        setRightPressed(rightPressedKeys.current.size > 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handlePointerDown = (e) => {
    dragging.current = true;

    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;

    const width = 300;
    const height = 250;

    const x = Math.max(
      0,
      Math.min(e.clientX - dragOffset.current.x, window.innerWidth - width),
    );

    const y = Math.max(
      0,
      Math.min(e.clientY - dragOffset.current.y, window.innerHeight - height),
    );

    setPosition({ x, y });
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  let catImage = "/cat2/idle.png";

  if (leftPressed) {
    catImage = "/cat2/l.png";
  }

  if (rightPressed) {
    catImage = "/cat2/r.png";
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed z-50 cursor-grab active:cursor-grabbing select-none scale-40"
      style={{
        left: position.x,
        top: position.y,
        width: "320px",
        height: "360px",
        touchAction: "none",
      }}
    >
      <img
        src={catImage}
        alt=""
        draggable={false}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
}
