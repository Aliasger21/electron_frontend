import React from "react";
import "../../styles/design-tokens.css";
import "./skeleton.css";

export default function Skeleton({
  width = "100%",
  height = "1rem",
  variant = "text",
  animation = true,
  className = "",
  style = {},
  "aria-label": ariaLabel = "Loading",
}) {
  const normalize = (v) => (typeof v === "number" ? `${v}px` : v);

  const sizeStyle = {
    width: normalize(width),
    height: normalize(height),
  };

  const classes = [
    "ed-skeleton",
    `ed-skeleton--${variant}`,
    animation && "ed-skeleton--shimmer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
      className={classes}
      style={{ ...sizeStyle, ...style }}
    />
  );
}
