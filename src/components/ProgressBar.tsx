interface Props {
  percent: number;
}

export function ProgressBar({ percent }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));

  const fillClass =
    clamped >= 100
      ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
      : clamped >= 50
      ? "bg-gradient-to-r from-violet-500 to-blue-400 shadow-[0_0_8px_rgba(124,90,232,0.6)]"
      : "bg-gradient-to-r from-violet-500 to-indigo-400 shadow-[0_0_8px_rgba(124,90,232,0.4)]";

  return (
    <div className="w-full bg-white/10 rounded-full h-3">
      <div
        className={`${fillClass} h-3 rounded-full transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
