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
    <div className="flex border-b border-gray-200 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            active === tab.id
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
