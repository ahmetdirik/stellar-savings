export type GoalTab = "overview" | "history" | "analytics";

interface Props {
  active: GoalTab;
  onChange: (tab: GoalTab) => void;
}

const TABS: { id: GoalTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "history", label: "Transactions" },
  { id: "analytics", label: "Analytics" },
];

export function GoalTabs({ active, onChange }: Props) {
  return (
    <div className="bg-white/5 rounded-full p-1 flex gap-1 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            active === tab.id
              ? "bg-[#7C5AE8] text-white"
              : "text-[#6B5FA8] hover:text-[#9B8EC4]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
