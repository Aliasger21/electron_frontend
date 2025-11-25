import React from "react";
import { Spinner } from "react-bootstrap";

/**
 * LoadingOverlay
 * Props:
 *  - show: boolean (whether to render)
 *  - message: optional string shown under spinner
 */
export default function LoadingOverlay({ show = false, message = "Processing..." }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        padding: 20,
      }}
    >
      <div style={{ textAlign: "center", color: "#fff", maxWidth: "90%", minWidth: 180 }}>
        <Spinner animation="border" role="status" style={{ width: 48, height: 48 }} />
        {message && <div style={{ marginTop: 10, fontWeight: 600 }}>{message}</div>}
      </div>
    </div>
  );
}
