import React from "react";
import "../../styles/design-tokens.css";

export default function Button({ children, variant = "primary", className = "", ...props }) {
    const base = "ed-btn";
    const v = variant === "primary" ? "ed-btn--primary" : "ed-btn--outline";
    return (
        <button className={`${base} ${v} ${className}`} {...props}>
            {children}
        </button>
    );
}
