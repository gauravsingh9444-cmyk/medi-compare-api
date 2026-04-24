import { useState } from "react";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        background: "rgba(10,10,30,0.65)", backdropFilter: "blur(6px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        position: "relative", width: "100%", maxWidth: "400px",
        borderRadius: "20px", padding: "2.5rem 2rem", color: "white",
        background: "linear-gradient(145deg,#1e1b4b,#312e81,#4c1d95)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        fontFamily: "'Segoe UI', sans-serif",
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "14px", right: "14px",
          background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%",
          width: "32px", height: "32px", cursor: "pointer", color: "white",
          fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.2rem" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg,#6d28d9,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(109,40,217,0.5)",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M4 6C4 4.9 4.9 4 6 4H10C11.1 4 12 4.9 12 6V10C12 11.1 11.1 12 10 12H6C4.9 12 4 11.1 4 10V6Z" fill="white" opacity="0.9"/>
              <path d="M14 6C14 4.9 14.9 4 16 4H18C19.1 4 20 4.9 20 6V10C20 11.1 19.1 12 18 12H16C14.9 12 14 11.1 14 10V6Z" fill="white" opacity="0.7"/>
              <path d="M4 14C4 12.9 4.9 12 6 12H10C11.1 12 12 12.9 12 14V18C12 19.1 11.1 20 10 20H6C4.9 20 4 19.1 4 18V14Z" fill="white" opacity="0.7"/>
              <path d="M14 14C14 12.9 14.9 12 16 12H18C19.1 12 20 12.9 20 14V18C20 19.1 19.1 20 18 20H16C14.9 20 14 19.1 14 18V14Z" fill="white" opacity="0.5"/>
            </svg>
          </div>
        </div>

        <h2 style={{ textAlign: "center", fontSize: "1.6rem", fontWeight: 700, margin: "0 0 6px" }}>
          Welcome back
        </h2>
        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", margin: "0 0 1.8rem" }}>
          Sign in to <strong>MediCompare AI</strong>
        </p>

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, marginBottom: "6px", color: "rgba(255,255,255,0.8)" }}>
            Email address
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{ position: "absolute", left: "14px", fontSize: "14px", opacity: 0.6 }}>✉</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", padding: "0.75rem 1rem 0.75rem 2.6rem",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px", color: "white", fontSize: "0.9rem", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, marginBottom: "6px", color: "rgba(255,255,255,0.8)" }}>
            Password
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{ position: "absolute", left: "14px", fontSize: "14px", opacity: 0.6 }}>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", padding: "0.75rem 2.8rem 0.75rem 2.6rem",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px", color: "white", fontSize: "0.9rem", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
              position: "absolute", right: "12px", background: "none", border: "none",
              cursor: "pointer", fontSize: "14px", opacity: 0.6, color: "white",
            }}>
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: "6px" }}>
            <a href="#" style={{ fontSize: "0.8rem", color: "#a78bfa", textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>
        </div>

        {/* Sign In Button */}
        <button style={{
          width: "100%", padding: "0.85rem",
          background: "linear-gradient(90deg,#7c3aed,#6d28d9)",
          border: "none", borderRadius: "10px", color: "white",
          fontSize: "1rem", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem",
        }}>
          Sign in →
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "1.2rem 0" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
            or continue with
          </span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.15)" }} />
        </div>

        {/* Google */}
        <button style={{
          width: "100%", padding: "0.75rem",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px", color: "white", fontSize: "0.9rem", fontWeight: 500,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        }}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.19 29.53 1 24 1 14.82 1 7.07 6.48 3.6 14.27l7.1 5.52C12.4 13.65 17.73 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.58C43.27 37.36 46.1 31.37 46.1 24.5z"/>
            <path fill="#FBBC05" d="M10.7 28.21A14.6 14.6 0 0 1 9.5 24c0-1.46.25-2.87.69-4.21l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.57 10.76l8.13-6.55z"/>
            <path fill="#34A853" d="M24 47c5.53 0 10.17-1.83 13.56-4.97l-7.19-5.58c-1.99 1.34-4.54 2.12-6.37 2.12-6.27 0-11.6-4.15-13.3-9.79l-8.13 6.55C7.07 41.52 14.82 47 24 47z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
          Don't have an account?{" "}
          <a href="#" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>
            Create one free
          </a>
        </p>
      </div>
    </div>
  );
}
