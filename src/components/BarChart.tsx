"use client";

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
      <h3 className="text-lg font-semibold text-[#1E293B] mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, i) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-[#475569]">{item.label}</span>
                <span className="text-sm font-bold text-[#1E293B]">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                  style={{
                    width: `${percentage}%`,
                    background: item.color,
                    animation: `slideInFromLeft 1s ease-out ${i * 0.15}s both`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideInFromLeft {
          from { width: 0; }
        }
      `}</style>
    </div>
  );
}
