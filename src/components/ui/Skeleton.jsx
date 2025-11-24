import React from "react";
import "../../styles/design-tokens.css";

export default function Skeleton({ className = "" }) {
    return <div className={`ed-skeleton ${className}`} aria-hidden="true"></div>;
}
