interface Props {
  percent: number;
}

export function ProgressBar({ percent }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));
  const color =
    clamped >= 100
      ? "bg-green-500"
      : clamped >= 50
      ? "bg-indigo-500"
      : "bg-amber-400";

  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
