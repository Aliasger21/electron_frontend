import React from "react";
import "../../styles/design-tokens.css";

const Button = React.forwardRef(function Button(
  { children, variant = "primary", className = "", as: Component = "button", style = {}, ...props },
  ref
) {
  const base = "ed-btn";
  const v = variant === "primary" ? "ed-btn--primary" : "ed-btn--outline";

  const finalProps = {
    ...props,
    ...(Component === "button" && props.type === undefined ? { type: "button" } : {})
  };

  return (
    <Component
      ref={ref}
      className={`${base} ${v} ${className}`}
      style={{ textDecoration: "none", ...style }}
      {...finalProps}
    >
      {children}
    </Component>
  );
});

export default Button;
