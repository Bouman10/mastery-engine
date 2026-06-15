const SKILLS = [
  "Power BI", "Python", "UI/UX Design", "Communication", "Excel & Data",
  "React", "Leadership", "Digital Marketing", "SQL", "Technical Writing",
  "Figma", "Personal Finance", "Node.js", "Public Speaking", "AI Tools", "Content Creation",
];

export default function SkillTicker() {
  const doubled = [...SKILLS, ...SKILLS];
  return (
    <div className="overflow-hidden border-y border-stone-200 bg-white py-3">
      <div className="flex gap-10 animate-ticker w-max">
        {doubled.map((s, i) => (
          <span key={i} className="text-sm font-medium text-stone-400 whitespace-nowrap flex items-center gap-2">
            <span className="text-stone-200 text-[8px]">◆</span>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
