import { useState } from "react";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,30,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-8 text-white"
        style={{ background: "linear-gradient(145deg,#1e1b4b,#312e81,#4c1d95)" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm hover:opacity-80 transition"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#6d28d9,#7c3aed)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="9" height="9" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="13" y="3" width="9" height="9" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="2" y="14" width="9" height="9" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="13" y="14" width="9" height="9" rx="1.5" fill="white" opacity="0.5"/>
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1">Welcome back</h2>
        <p className="text-center text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
          Sign in to <strong>MediCompare AI</strong>
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            Email address
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm opacity-50">✉</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none placeholder-white/40"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            Password
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm opacity-50">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-3 rounded-xl text-sm outline-none placeholder-white/40"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-sm opacity-50 hover:opacity-80"
            >
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>
          <div className="text-right mt-1">
            <a href="#" className="text-xs" style={{ color: "#a78bfa" }}>
              Forgot password?
            </a>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          className="w-full py-3 rounded-xl font-semibold mt-3 text-white transition hover:opacity-90"
          style={{ background: "linear-gradient(90deg,#7c3aed,#6d28d9)" }}
        >
          Sign in →
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            or continue with
          </span>
          <hr className="flex-1" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Google Button */}
        <button
          className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-3 transition hover:opacity-90"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.19 29.53 1 24 1 14.82 1 7.07 6.48 3.6 14.27l7.1 5.52C12.4 13.65 17.73 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.58C43.27 37.36 46.1 31.37 46.1 24.5z"/>
            <path fill="#FBBC05" d="M10.7 28.21A14.6 14.6 0 0 1 9.5 24c0-1.46.25-2.87.69-4.21l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.53 2.57 10.76l8.13-6.55z"/>
            <path fill="#34A853" d="M24 47c5.53 0 10.17-1.83 13.56-4.97l-7.19-5.58c-1.99 1.34-4.54 2.12-6.37 2.12-6.27 0-11.6-4.15-13.3-9.79l-8.13 6.55C7.07 41.52 14.82 47 24 47z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-4 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          Don't have an account?{" "}
          <a href="#" style={{ color: "#a78bfa", fontWeight: 600 }}>
            Sign up free
          </a>
        </p>
      </div>
    </div>
  );
}
