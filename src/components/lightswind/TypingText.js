"use client";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "../lib/utils";

export const TypingText = ({
  children,
  as: Component = "div",
  className = "",
  delay = 0,
  duration = 2,
  fontSize = "text-4xl",
  fontWeight = "font-bold",
  color = "text-white",
  letterSpacing = "tracking-wide",
  align = "left",
  loop = false,
}) => {
  const [textContent, setTextContent] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Use useRef to handle if it is the initial render
  const isInitialMount = useRef(true);

  // Extract plain text from children
  useEffect(() => {
    const extractText = (node) => {
      if (typeof node === "string" || typeof node === "number") {
        return node.toString();
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }
      if (
        React.isValidElement(node) &&
        typeof node.props.children !== "undefined"
      ) {
        return extractText(node.props.children);
      }
      return "";
    };
    setTextContent(extractText(children));
  }, [children]);

  // Typing logic with a loop
  useEffect(() => {
    if (!textContent) return;

    const typingSpeed = 150;
    const deletingSpeed = 10;

    // Initial delay only on the first render
    let currentDelay = isInitialMount.current ? delay * 1000 : 0;
    isInitialMount.current = false;

    const timeout = setTimeout(() => {
      if (!deleting && index < textContent.length) {
        // Typing
        setDisplayed((prev) => prev + textContent.charAt(index));
        setIndex(index + 1);
      } else if (deleting && index > 0) {
        // Deleting
        setDisplayed((prev) => prev.slice(0, 0));
        setIndex(index - 1);
      } else if (!deleting && index === textContent.length) {
        // Wait before deleting
        if (loop) {
          setTimeout(() => setDeleting(true), 900);
        }
      } else if (deleting && index === 0) {
        // Restart typing
        setDeleting(false);
      }
    }, (deleting ? deletingSpeed : typingSpeed) + currentDelay);

    return () => clearTimeout(timeout);
  }, [index, deleting, textContent, loop, delay]);

  // Render the component
  return React.createElement(
    Component,
    {
      className: cn(
        "inline-flex",
        className,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        align === "center"
          ? "justify-center text-center"
          : align === "right"
          ? "justify-end text-right"
          : "justify-start text-left"
      ),
    },
    React.createElement("span", null, displayed),
    // Conditionally render the cursor
    index < textContent.length &&
      React.createElement("span", { className: "animate-pulse" }, "|")
  );
};