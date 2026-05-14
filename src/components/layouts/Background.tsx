export function Background() {
  return (
    <>
      {/* Base Space Background */}
      <div className="fixed inset-0 bg-[#050505]" />

      {/* Deep space gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)] pointer-events-none" />

      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[10%] top-[20%] h-[2px] w-[2px] rounded-full bg-white/80 animate-pulse" />
        <div className="absolute left-[25%] top-[70%] h-[2px] w-[2px] rounded-full bg-white/60 animate-pulse" />
        <div className="absolute left-[40%] top-[35%] h-[1px] w-[1px] rounded-full bg-white/70 animate-pulse" />
        <div className="absolute left-[70%] top-[18%] h-[2px] w-[2px] rounded-full bg-white/70 animate-pulse" />
        <div className="absolute left-[82%] top-[55%] h-[1px] w-[1px] rounded-full bg-white/60 animate-pulse" />
        <div className="absolute left-[60%] top-[78%] h-[2px] w-[2px] rounded-full bg-white/70 animate-pulse" />
        <div className="absolute left-[88%] top-[28%] h-[1px] w-[1px] rounded-full bg-white/80 animate-pulse" />
        <div className="absolute left-[15%] top-[45%] h-[1px] w-[1px] rounded-full bg-white/70 animate-pulse" />
      </div>

      {/* Nebula glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-3xl" />

        <div className="absolute bottom-[-250px] left-[20%] h-[500px] w-[500px] rounded-full bg-zinc-300/[0.03] blur-3xl" />

        <div className="absolute right-[-120px] top-[30%] h-[400px] w-[400px] rounded-full bg-white/[0.025] blur-3xl" />
      </div>

      {/* Shooting star */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[18%] left-[-20%] h-px w-[220px] rotate-[25deg] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70 animate-[shoot_8s_linear_infinite]" />
      </div>

      {/* Subtle grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20 pointer-events-none" />

      {/* Noise */}
      <div
        className="fixed inset-0 opacity-[0.025] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='white'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
    </>
  );
}
