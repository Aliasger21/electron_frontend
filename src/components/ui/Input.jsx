import React from "react";
import "../../styles/design-tokens.css";

export default function Input({ error, className = "", ...props }) {
    return (
        <>
            <input className={`ed-input ${error ? "ed-input--error" : ""} ${className}`} {...props} />
            {error && <div className="ed-input-error" role="alert">{error}</div>}
        </>
    );
}
