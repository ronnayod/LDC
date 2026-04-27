interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: "blue" | "cyan" | "green" | "amber" | "purple";
}

const colorMap = {
  blue: {
    bg: "bg-gradient-to-br from-[#2B5998] to-[#1a3a69]",
    iconBg: "bg-white/15",
    changeUp: "text-green-300",
    changeDown: "text-red-300",
    text: "text-white",
    sub: "text-white/70",
  },
  cyan: {
    bg: "bg-gradient-to-br from-[#00C6FF] to-[#0072FF]",
    iconBg: "bg-white/15",
    changeUp: "text-green-200",
    changeDown: "text-red-200",
    text: "text-white",
    sub: "text-white/70",
  },
  green: {
    bg: "bg-gradient-to-br from-[#22C55E] to-[#16A34A]",
    iconBg: "bg-white/15",
    changeUp: "text-green-200",
    changeDown: "text-red-200",
    text: "text-white",
    sub: "text-white/70",
  },
  amber: {
    bg: "bg-gradient-to-br from-[#F59E0B] to-[#D97706]",
    iconBg: "bg-white/15",
    changeUp: "text-green-200",
    changeDown: "text-red-200",
    text: "text-white",
    sub: "text-white/70",
  },
  purple: {
    bg: "bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]",
    iconBg: "bg-white/15",
    changeUp: "text-green-200",
    changeDown: "text-red-200",
    text: "text-white",
    sub: "text-white/70",
  },
};

export default function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const c = colorMap[color];
  const isUp = change >= 0;

  return (
    <div className={`${c.bg} rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[11px] sm:text-sm font-medium ${c.sub} mb-0.5 sm:mb-1 truncate`}>{title}</p>
          <p className={`text-xl sm:text-3xl font-bold ${c.text} tracking-tight`}>{value}</p>
        </div>
        <div className={`${c.iconBg} p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-1.5">
        <span className={`text-xs sm:text-sm font-semibold flex items-center gap-0.5 ${isUp ? c.changeUp : c.changeDown}`}>
          {isUp ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
          )}
          {Math.abs(change)}%
        </span>
        <span className={`text-xs ${c.sub}`}>จากเดือนก่อน</span>
      </div>
    </div>
  );
}
