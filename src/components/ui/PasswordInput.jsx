import { useState } from "react";
import "../../styles/design-tokens.css";

export default function PasswordInput({ value, onChange, placeholder = "", required = false, name }) {
    const [show, setShow] = useState(false);

    return (
        <div className="password-wrapper" style={{ position: "relative", width: "100%" }}>
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                name={name}
                className="form-control"
                style={{ paddingRight: "40px" }}
            />

            <span
                onClick={() => setShow(!show)}
                style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    color: "var(--text-light)"
                }}
            >
                {show ? "👁️" : "👁️‍🗨️"}
            </span>
        </div>
    );
}
