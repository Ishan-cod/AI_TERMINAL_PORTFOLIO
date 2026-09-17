"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

export const Typewriter = ({
  children,
  speed = 5,
  step = 1,
  onComplete,
  onUpdate,
  isStopped = false,
}) => {
  const [visibleCount, setVisibleCount] = useState(0);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onUpdateRef.current = onUpdate;
  }, [onComplete, onUpdate]);

  const getTextLength = (node) => {
    if (typeof node === "string") return node.length;

    if (typeof node === "number") {
      return String(node).length;
    }

    if (
      node === null ||
      typeof node === "boolean" ||
      typeof node === "undefined"
    ) {
      return 0;
    }

    if (React.isValidElement(node)) {
      return getTextLength(node.props.children);
    }

    if (Array.isArray(node)) {
      return node.reduce(
        (total, child) => total + getTextLength(child),
        0
      );
    }

    return 0;
  };

  const totalLength = useMemo(
    () => getTextLength(children),
    [children]
  );

  // Reset when content changes
  useEffect(() => {
    setVisibleCount(0);
    completedRef.current = false;
  }, [children]);

  // Typewriter effect
  useEffect(() => {
    if (
      isStopped ||
      totalLength === 0 ||
      visibleCount >= totalLength
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + step, totalLength)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [
    visibleCount,
    totalLength,
    speed,
    step,
    isStopped,
  ]);

  // Callbacks
  useEffect(() => {
    if (isStopped) return;

    if (
      totalLength === 0 ||
      visibleCount >= totalLength
    ) {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    } else if (visibleCount > 0) {
      onUpdateRef.current?.();
    }
  }, [
    visibleCount,
    totalLength,
    isStopped,
  ]);

  const renderChildren = (
    node,
    counter
  ) => {
    // String
    if (typeof node === "string") {
      const len = node.length;

      if (counter.val >= len) {
        counter.val -= len;
        return node;
      }

      if (counter.val <= 0) {
        return "";
      }

      const slice = node.substring(
        0,
        counter.val
      );

      counter.val = 0;

      return slice;
    }

    // Number
    if (typeof node === "number") {
      return renderChildren(
        String(node),
        counter
      );
    }

    // Empty
    if (
      node === null ||
      typeof node === "boolean" ||
      typeof node === "undefined"
    ) {
      return node;
    }

    // React element
    if (React.isValidElement(node)) {
      const props = node.props;

      if (
        props.children === undefined ||
        props.children === null
      ) {
        return node;
      }

      const childrenArray =
        React.Children.toArray(
          props.children
        );

      const renderedChildren =
        childrenArray.map(
          (child, index) => {
            const rendered =
              renderChildren(
                child,
                counter
              );

            if (
              React.isValidElement(rendered)
            ) {
              return React.cloneElement(
                rendered,
                {
                  key:
                    rendered.key ??
                    child.key ??
                    `tw-${index}`,
                }
              );
            }

            return rendered;
          }
        );

      return React.cloneElement(
        node,
        {
          ...props,
          children: renderedChildren,
        }
      );
    }

    // Array
    if (Array.isArray(node)) {
      return node.map(
        (child, index) => {
          const rendered =
            renderChildren(
              child,
              counter
            );

          if (
            React.isValidElement(rendered)
          ) {
            return React.cloneElement(
              rendered,
              {
                key:
                  rendered.key ??
                  child.key ??
                  `tw-${index}`,
              }
            );
          }

          return rendered;
        }
      );
    }

    return node;
  };

  const isFinished =
    visibleCount >= totalLength;

  if (isFinished) {
    return <>{children}</>;
  }

  const counter = {
    val: visibleCount,
  };

  return (
    <>
      {renderChildren(children, counter)}

      {!isStopped && (
        <span className="inline-block bg-terminal-green w-[10px] h-5 align-text-bottom animate-blink ml-[1px]" />
      )}
    </>
  );
};