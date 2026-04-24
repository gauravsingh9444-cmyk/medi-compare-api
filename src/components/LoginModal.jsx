import { useState, useEffect } from "react";

// ─── Floating medical icon (+ / cross) ───────────────────────────────────────
const FloatingIcon = ({ style, size = 20, opacity = 0.18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={style}
    className="absolute pointer-events-none select-none"
  >
    <rect x="9" y="2" width="6" height="20" rx="2" fill="white" opacity={opacity} />
    <rect x="2" y="9" width="20" height="6" rx="2" fill="white" opacity={opacity} />
  </svg>
);

// ─── Heartbeat pulse SVG line ─────────────────────────────────────────────────
const HeartbeatLine = () => (
  <svg
    viewBox="0 0 300 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 opacity-20 pointer-events-none"
  >
    <style>{`
        @keyframes dash {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    <polyline
  points="0,30 40,30 55,10 65,50 75,5 90,55 100,30 140,30 155,15 165,45 175,20 185,40 195,30 300,30"
  style={{
    strokeDasharray: 400,
    strokeDashoffset: 400,
    animation: "dash 2s linear infinite",
  }}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Google Icon ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── Eye icons ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ─── Main LoginModal Component ────────────────────────────────────────────────
export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      // Small delay so CSS transition picks up
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate async login — replace with real auth logic
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    onClose();
  };

  if (!isOpen && !visible) return null;

  return (
    <>
      {/* ── Inject keyframe animations ── */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px);  }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float1 { 0%,100%{ transform: translateY(0px) rotate(0deg);  } 50%{ transform: translateY(-18px) rotate(12deg);  } }
        @keyframes float2 { 0%,100%{ transform: translateY(0px) rotate(0deg);  } 50%{ transform: translateY(-12px) rotate(-8deg); } }
        @keyframes float3 { 0%,100%{ transform: translateY(0px) rotate(0deg);  } 50%{ transform: translateY(-22px) rotate(6deg);  } }
        @keyframes float4 { 0%,100%{ transform: translateY(0px) rotate(0deg);  } 50%{ transform: translateY(-14px) rotate(-14deg); } }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%;   }
        }
        @keyframes heartPulse {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.35; }
        }
        @keyframes spin360 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes inputGlow {
          from { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          to   { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
        }
        .modal-animate { animation: modalFadeIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .overlay-animate { animation: overlayFadeIn 0.25s ease forwards; }
        .fi1 { animation: float1 4.2s ease-in-out infinite; }
        .fi2 { animation: float2 5.1s ease-in-out infinite 0.8s; }
        .fi3 { animation: float3 3.8s ease-in-out infinite 1.5s; }
        .fi4 { animation: float4 6s   ease-in-out infinite 0.3s; }
        .fi5 { animation: float1 4.8s ease-in-out infinite 2s; }
        .fi6 { animation: float2 3.5s ease-in-out infinite 1s; }
        .fi7 { animation: float3 5.5s ease-in-out infinite 0.6s; }
        .grad-bg {
          background: linear-gradient(135deg, #1e1b4b, #312e81, #1d4ed8, #0e7490, #1e3a5f);
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
        }
        .heartbeat-pulse { animation: heartPulse 2s ease-in-out infinite; }
        .input-focused { animation: inputGlow 0.4s ease-out; }
        .btn-spinner { animation: spin360 0.7s linear infinite; }
        .glass-card {
          background: rgba(255,255,255,0.09);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .input-glass {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          transition: all 0.2s ease;
        }
        .input-glass::placeholder { color: rgba(255,255,255,0.4); }
        .input-glass:focus {
          background: rgba(255,255,255,0.13);
          border-color: rgba(139,92,246,0.7);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
          outline: none;
        }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6);
          background-size: 200% 200%;
          transition: all 0.25s ease;
        }
        .btn-primary:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.45);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0px) scale(0.99); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-google {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.2s ease;
        }
        .btn-google:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.35);
          transform: translateY(-1px);
        }
        .btn-google:active { transform: translateY(0px); }
        .close-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.2s ease;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: rotate(90deg);
        }
        .eye-btn { transition: all 0.2s ease; color: rgba(255,255,255,0.5); }
        .eye-btn:hover { color: rgba(255,255,255,0.9); }
        .link-btn { color: rgba(139,92,246,0.9); transition: color 0.2s ease; }
        .link-btn:hover { color: rgba(167,139,250,1); text-decoration: underline; }
        .divider-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); }
      `}</style>

      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-animate"
        style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to MediCompare AI"
      >
        {/* ── Animated gradient background behind modal ── */}
        <div className="fixed inset-0 grad-bg opacity-80 -z-10" />

        {/* ── Floating medical plus icons (background decoration) ── */}
        <FloatingIcon style={{ top: "8%",  left: "6%",  animationName: "float1", animationDuration: "4.2s", animationIterationCount: "infinite" }} size={28} opacity={0.22} />
        <FloatingIcon style={{ top: "15%", right: "8%", animationName: "float2", animationDuration: "5.1s", animationIterationCount: "infinite", animationDelay: "0.8s" }} size={22} opacity={0.18} />
        <FloatingIcon style={{ top: "55%", left: "3%", animationName: "float3", animationDuration: "3.8s", animationIterationCount: "infinite", animationDelay: "1.5s" }} size={18} opacity={0.15} />
        <FloatingIcon style={{ top: "70%", right: "5%", animationName: "float4", animationDuration: "6s",   animationIterationCount: "infinite", animationDelay: "0.3s" }} size={24} opacity={0.2} />
        <FloatingIcon style={{ top: "35%", left: "9%", animationName: "float1", animationDuration: "4.8s", animationIterationCount: "infinite", animationDelay: "2s"   }} size={14} opacity={0.12} />
        <FloatingIcon style={{ bottom: "12%", left: "15%", animationName: "float2", animationDuration: "3.5s", animationIterationCount: "infinite", animationDelay: "1s" }} size={20} opacity={0.16} />
        <FloatingIcon style={{ bottom: "20%", right: "12%", animationName: "float3", animationDuration: "5.5s", animationIterationCount: "infinite", animationDelay: "0.6s" }} size={16} opacity={0.14} />

        {/* ── Modal card ── */}
        <div
          className="relative w-full max-w-md rounded-3xl p-8 modal-animate overflow-hidden"
          style={{ maxHeight: "95vh", overflowY: "auto" }}
        >
          {/* Glass card effect */}
          <div className="glass-card absolute inset-0 rounded-3xl -z-10" />

          {/* Subtle inner glow top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)" }} />

          {/* ── Close button ── */}
          <button
            onClick={onClose}
            className="close-btn absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white z-10"
            aria-label="Close login modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* ── Logo / Brand ── */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Welcome back</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Sign in to <span className="text-violet-300 font-medium">MediCompare AI</span>
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@example.com"
                  required
                  className={`input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm${emailFocused ? " input-focused" : ""}`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  required
                  className={`input-glass w-full pl-10 pr-12 py-3 rounded-xl text-sm${passwordFocused ? " input-focused" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="eye-btn absolute right-3.5 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right -mt-1">
              <button type="button" className="link-btn text-xs">
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px divider-line" />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>or continue with</span>
            <div className="flex-1 h-px divider-line" />
          </div>

          {/* ── Google SSO button ── */}
          <button
            type="button"
            className="btn-google w-full py-3 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* ── Sign up link ── */}
          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.45)" }}>
            Don't have an account?{" "}
            <button type="button" className="link-btn font-medium">
              Create one free
            </button>
          </p>

          {/* Heartbeat decoration */}
          <HeartbeatLine />
        </div>
      </div>
    </>
  );
}

