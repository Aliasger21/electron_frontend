// src/components/ui/Skeleton.jsx
import React from "react";
import "../../styles/design-tokens.css"; // keep your tokens import
import "./skeleton.css"; // styles for skeleton (see next step)

/**
 * Skeleton component
 *
 * Props:
 * - width: css width value (string or number). e.g. "100%", "250px", 200
 * - height: css height value (string or number). e.g. "1rem", "40px", 40
 * - variant: "text" | "rect" | "circle" | "avatar" (default: text)
 * - animation: boolean (default: true)
 * - className: extra classname
 * - style: additional inline styles
 */
export default function Skeleton({
  width = "100%",
  height = "1rem",
  variant = "text",
  animation = true,
  className = "",
  style = {},
  "aria-label": ariaLabel,
}) {
  const sizeStyle = {};

  // normalize number -> px
  const norm = (v) => (typeof v === "number" ? `${v}px` : v);

  if (width) sizeStyle.width = norm(width);
  if (height) sizeStyle.height = norm(height);

  const classes = [
    "ed-skeleton",
    `ed-skeleton--${variant}`,
    animation ? "ed-skeleton--shimmer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="status"
      aria-label={ariaLabel || "Loading"}
      aria-busy="true"
      className={classes}
      style={{ ...sizeStyle, ...style }}
    />
  );
}
