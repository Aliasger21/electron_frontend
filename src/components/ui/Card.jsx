import React from "react";
import "../../styles/design-tokens.css";

export default function Card({ children, className = "" }) {
    return <div className={`ed-card ${className}`}>{children}</div>;
}
