"use client";

import { useState, useMemo, useRef, useEffect } from "react";

// ─── Types ─────────────────────────────────────────────
type ChartFilter = "daily" | "weekly" | "monthly" | "yearly";
type MonthlySubMode = "full-year" | "single-month";

interface DataPoint {
  label: string;
  value: number;
}

interface ChartConfig {
  title: string;
  subtitle: string;
  data: DataPoint[];
  color: string;
}

// ─── Constants ─────────────────────────────────────────
const CHART_FILTER_LABELS: Record<ChartFilter, string> = {
  daily: "รายวัน",
  weekly: "รายสัปดาห์",
  monthly: "รายเดือน",
  yearly: "รายปี",
};

const MONTH_NAMES_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const MONTH_NAMES_FULL = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const THAI_YEAR_OFFSET = 543;

// ─── Seeded random for consistent mock data ────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Data generators ───────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function generateDailyForMonth(year: number, month: number): ChartConfig {
  const days = getDaysInMonth(year, month);
  const rng = seededRandom(year * 100 + month + 1);
  const data: DataPoint[] = [];
  const thaiYear = year + THAI_YEAR_OFFSET;

  const isPast = year < CURRENT_YEAR || (year === CURRENT_YEAR && month < CURRENT_MONTH);
  const isCurrent = year === CURRENT_YEAR && month === CURRENT_MONTH;
  const today = new Date().getDate();

  for (let d = 1; d <= days; d++) {
    const label = `${d}`;
    if (isPast || (isCurrent && d <= today)) {
      data.push({ label, value: Math.floor(rng() * 35000) + 5000 });
    } else {
      data.push({ label, value: 0 });
    }
  }

  return {
    title: `${MONTH_NAMES_FULL[month]} ${thaiYear}`,
    subtitle: `ข้อมูลยอดขายรายวัน — ${MONTH_NAMES_FULL[month]} ${thaiYear}`,
    data,
    color: "#1E40AF",
  };
}

function generateWeeklyData(year: number): ChartConfig {
  const rng = seededRandom(year * 7);
  const data: DataPoint[] = [];
  const thaiYear = year + THAI_YEAR_OFFSET;

  const totalWeeks = year === CURRENT_YEAR ? Math.ceil((Date.now() - new Date(year, 0, 1).getTime()) / (7 * 86400000)) : 52;
  const weeksToShow = Math.min(totalWeeks, 52);

  for (let w = 1; w <= weeksToShow; w++) {
    data.push({ label: `สัปดาห์ที่ ${w}`, value: Math.floor(rng() * 250000) + 80000 });
  }

  return {
    title: `รายสัปดาห์ — ปี ${thaiYear}`,
    subtitle: `ข้อมูลยอดขายรายสัปดาห์ ปี ${thaiYear}`,
    data,
    color: "#1E40AF",
  };
}

function generateMonthlyFullYear(year: number): ChartConfig {
  const rng = seededRandom(year * 12);
  const data: DataPoint[] = [];
  const thaiYear = year + THAI_YEAR_OFFSET;
  const monthsToShow = year === CURRENT_YEAR ? CURRENT_MONTH + 1 : 12;

  for (let m = 0; m < 12; m++) {
    data.push({
      label: MONTH_NAMES_SHORT[m],
      value: m < monthsToShow ? Math.floor(rng() * 800000) + 600000 : 0,
    });
  }

  return {
    title: `ปี ${thaiYear}`,
    subtitle: `ข้อมูลยอดขายรายเดือน — ปี ${thaiYear}`,
    data,
    color: "#1E40AF",
  };
}

function generateYearlyData(startYear: number, count: number): ChartConfig {
  const rng = seededRandom(startYear);
  const data: DataPoint[] = [];

  for (let i = 0; i < count; i++) {
    const y = startYear + i;
    const thaiYear = y + THAI_YEAR_OFFSET;
    data.push({
      label: `${thaiYear}`,
      value: y <= CURRENT_YEAR ? Math.floor(rng() * 5000000) + 10000000 : 0,
    });
  }

  return {
    title: `ยอดขายรายปี`,
    subtitle: `ข้อมูลยอดขายรายปี ${(startYear + THAI_YEAR_OFFSET)} — ${(startYear + count - 1 + THAI_YEAR_OFFSET)}`,
    data,
    color: "#1E40AF",
  };
}

// ─── Helpers ───────────────────────────────────────────
const fmtNum = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return new Intl.NumberFormat("th-TH").format(n);
};

// ─── Dropdown component ────────────────────────────────
function Dropdown({ value, options, onChange }: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1E293B] hover:bg-[#F1F5F9] transition-colors min-w-[100px]"
      >
        <span className="truncate">{selected?.label ?? value}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 min-w-full max-h-[240px] overflow-y-auto py-1 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                opt.value === value
                  ? "bg-[#1E40AF]/10 text-[#1E40AF] font-semibold"
                  : "text-[#475569] hover:bg-[#F8FAFC]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tooltip context ───────────────────────────────────
interface TooltipContext {
  filter: ChartFilter;
  month?: number;   // 0-based
  year?: number;    // AD year
  monthlySubMode?: MonthlySubMode;
  yearlyStart?: number;
}

function buildTooltipLabel(index: number, dataLabel: string, ctx: TooltipContext): string {
  const thaiYear = (y: number) => `${y + THAI_YEAR_OFFSET}`;

  switch (ctx.filter) {
    case "daily": {
      const m = ctx.month ?? 0;
      const y = ctx.year ?? CURRENT_YEAR;
      return `วันที่ ${index + 1} เดือน${MONTH_NAMES_FULL[m]} ปี ${thaiYear(y)}`;
    }
    case "weekly": {
      const y = ctx.year ?? CURRENT_YEAR;
      return `สัปดาห์ที่ ${index + 1} ปี ${thaiYear(y)}`;
    }
    case "monthly": {
      if (ctx.monthlySubMode === "single-month") {
        const m = ctx.month ?? 0;
        const y = ctx.year ?? CURRENT_YEAR;
        return `วันที่ ${index + 1} เดือน${MONTH_NAMES_FULL[m]} ปี ${thaiYear(y)}`;
      }
      const y = ctx.year ?? CURRENT_YEAR;
      return `เดือน${MONTH_NAMES_FULL[index]} ปี ${thaiYear(y)}`;
    }
    case "yearly": {
      const startY = ctx.yearlyStart ?? (CURRENT_YEAR - 4);
      const y = startY + index;
      return `ปี ${thaiYear(y)}`;
    }
    default:
      return dataLabel;
  }
}

// ─── SVG Line Chart ────────────────────────────────────
function SVGLineChart({ data, color, tooltipCtx }: { data: DataPoint[]; color: string; tooltipCtx: TooltipContext }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const padding = { top: 20, right: 30, bottom: 30, left: 65 };
  const chartWidth = 800;
  const chartHeight = 340;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Filter out zero-trailing data for line drawing
  const activeData = useMemo(() => {
    let lastNonZero = data.length - 1;
    while (lastNonZero > 0 && data[lastNonZero].value === 0) lastNonZero--;
    return data.slice(0, lastNonZero + 1);
  }, [data]);

  const { yMin, yMax, yTicks } = useMemo(() => {
    const values = activeData.map((d) => d.value).filter((v) => v > 0);
    if (values.length === 0) return { yMin: 0, yMax: 100, yTicks: [0, 25, 50, 75, 100] };

    const rawMax = Math.max(...values);
    const maxVal = rawMax * 1.15;

    const step = maxVal / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(step || 1)));
    const niceStep = Math.ceil(step / magnitude) * magnitude;
    const niceMax = Math.ceil(maxVal / niceStep) * niceStep;

    const ticks: number[] = [];
    for (let v = 0; v <= niceMax; v += niceStep) ticks.push(v);

    return { yMin: 0, yMax: niceMax, yTicks: ticks };
  }, [activeData]);

  const getX = (idx: number) => padding.left + (innerWidth / Math.max(data.length - 1, 1)) * idx;
  const getY = (value: number) => {
    const ratio = value / (yMax || 1);
    return padding.top + innerHeight * (1 - ratio);
  };

  const buildPath = (pts: DataPoint[], startIdx = 0) => {
    return pts
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(startIdx + i).toFixed(1)} ${getY(d.value).toFixed(1)}`)
      .join(" ");
  };

  const buildAreaPath = (pts: DataPoint[], startIdx = 0) => {
    const line = buildPath(pts, startIdx);
    const lastX = getX(startIdx + pts.length - 1);
    const firstX = getX(startIdx);
    const bottom = padding.top + innerHeight;
    return `${line} L ${lastX.toFixed(1)} ${bottom} L ${firstX.toFixed(1)} ${bottom} Z`;
  };

  // Determine which x-axis labels to show
  const shouldShowLabel = (i: number) => {
    if (data.length <= 15) return true;
    if (i === 0 || i === data.length - 1) return true;
    const interval = Math.ceil(data.length / 15);
    return i % interval === 0;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || activeData.length === 0) return;
    const rect = svg.getBoundingClientRect();
    // Convert screen X to SVG viewBox X
    const mouseX = ((e.clientX - rect.left) / rect.width) * chartWidth;
    // Find nearest point
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < activeData.length; i++) {
      const dist = Math.abs(getX(i) - mouseX);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    }
    // Only show if reasonably close
    const threshold = innerWidth / Math.max(activeData.length - 1, 1) * 0.6;
    setHoveredIdx(closestDist <= threshold ? closest : null);
  };

  return (
    <div className="w-full relative">
      <div className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: "400px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left} y1={getY(tick)}
                x2={chartWidth - padding.right} y2={getY(tick)}
                stroke="#E2E8F0" strokeWidth="1"
                strokeDasharray={tick === 0 ? "0" : "4 4"}
              />
              <text
                x={padding.left - 12} y={getY(tick) + 4}
                textAnchor="end" fontSize="11" fill="#94A3B8"
              >
                {fmtNum(tick)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => {
            if (!shouldShowLabel(i)) return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={chartHeight - padding.bottom + 22}
                textAnchor={data.length > 15 ? "end" : "middle"}
                fontSize="11"
                fill="#94A3B8"
                transform={data.length > 15 ? `rotate(-40, ${getX(i)}, ${chartHeight - padding.bottom + 22})` : undefined}
              >
                {d.label}
              </text>
            );
          })}

          {/* Area fill */}
          {activeData.length > 1 && (
            <path
              d={buildAreaPath(activeData)}
              fill={color}
              fillOpacity="0.06"
            />
          )}

          {/* Line */}
          {activeData.length > 1 && (
            <path
              d={buildPath(activeData)}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 3000,
                strokeDashoffset: 3000,
                animation: "drawLine 1.5s ease-out 0s forwards",
              }}
            />
          )}

          {/* Hover vertical line */}
          {hoveredIdx !== null && (
            <line
              x1={getX(hoveredIdx)} y1={padding.top}
              x2={getX(hoveredIdx)} y2={padding.top + innerHeight}
              stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}

          {/* Data points */}
          {activeData.map((d, i) => {
            const isHovered = hoveredIdx === i;
            const alwaysShowLabel = activeData.length <= 15 || i % Math.ceil(activeData.length / 12) === 0 || i === activeData.length - 1;

            return (
              <g key={i}>


                {/* Dot */}
                <circle
                  cx={getX(i)} cy={getY(d.value)}
                  r={isHovered ? 6 : 3.5}
                  fill="white" stroke={color} strokeWidth="2.5"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 6px ${color}50)` : undefined,
                    opacity: isHovered ? 1 : 0,
                    animation: isHovered ? "none" : `fadeInDot 0.3s ease-out ${i * 0.02 + 0.6}s forwards`,
                    transition: "r 0.1s ease",
                  }}
                />

                {/* Value label (always visible for sparse data) */}
                {alwaysShowLabel && !isHovered && (
                  <text
                    x={getX(i)} y={getY(d.value) - 14}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#64748B"
                    style={{
                      opacity: 0,
                      animation: `fadeInDot 0.3s ease-out ${i * 0.02 + 0.8}s forwards`,
                    }}
                  >
                    {fmtNum(d.value)}
                  </text>
                )}

                {/* Hover value label (instant, no delay) */}
                {isHovered && (
                  <text
                    x={getX(i)} y={getY(d.value) - 14}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={color}
                  >
                    {fmtNum(d.value)}
                  </text>
                )}
              </g>
            );
          })}

          {/* SVG Tooltip box on hover */}
          {hoveredIdx !== null && activeData[hoveredIdx] && (() => {
            const d = activeData[hoveredIdx];
            const tipText = buildTooltipLabel(hoveredIdx, d.label, tooltipCtx);
            const tipValue = `฿${new Intl.NumberFormat("th-TH").format(d.value)}`;
            const px = getX(hoveredIdx);
            const py = getY(d.value);

            // Position tooltip above the point, or below if too close to top
            const tipWidth = 220;
            const tipHeight = 52;
            const tipGap = 28;
            let tipX = px - tipWidth / 2;
            let tipY = py - tipHeight - tipGap;
            if (tipY < 5) tipY = py + tipGap;
            if (tipX < 5) tipX = 5;
            if (tipX + tipWidth > chartWidth - 5) tipX = chartWidth - tipWidth - 5;

            return (
              <g className="pointer-events-none">
                {/* Box shadow */}
                <rect
                  x={tipX} y={tipY}
                  width={tipWidth} height={tipHeight}
                  rx="10" ry="10"
                  fill="white"
                  stroke="#E2E8F0" strokeWidth="1"
                  filter="url(#tooltipShadow)"
                />
                {/* Label text */}
                <text
                  x={tipX + tipWidth / 2} y={tipY + 20}
                  textAnchor="middle" fontSize="10" fill="#64748B"
                >
                  {tipText}
                </text>
                {/* Value text */}
                <text
                  x={tipX + tipWidth / 2} y={tipY + 40}
                  textAnchor="middle" fontSize="14" fontWeight="700" fill="#1E293B"
                >
                  {tipValue}
                </text>
              </g>
            );
          })()}

          {/* Filter for tooltip shadow */}
          <defs>
            <filter id="tooltipShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.1" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────
export default function SalesLineChart() {
  const [filter, setFilter] = useState<ChartFilter>("daily");

  // Sub-selectors state
  const [dailyMonth, setDailyMonth] = useState(CURRENT_MONTH);
  const [dailyYear, setDailyYear] = useState(CURRENT_YEAR);

  const [weeklyYear, setWeeklyYear] = useState(CURRENT_YEAR);

  const [monthlySubMode, setMonthlySubMode] = useState<MonthlySubMode>("full-year");
  const [monthlyYear, setMonthlyYear] = useState(CURRENT_YEAR);
  const [monthlySingleMonth, setMonthlySingleMonth] = useState(CURRENT_MONTH);

  const [yearlyStart, setYearlyStart] = useState(CURRENT_YEAR - 4);

  // Build chart data
  const chartData = useMemo<ChartConfig>(() => {
    switch (filter) {
      case "daily":
        return generateDailyForMonth(dailyYear, dailyMonth);
      case "weekly":
        return generateWeeklyData(weeklyYear);
      case "monthly":
        if (monthlySubMode === "single-month") {
          return generateDailyForMonth(monthlyYear, monthlySingleMonth);
        }
        return generateMonthlyFullYear(monthlyYear);
      case "yearly":
        return generateYearlyData(yearlyStart, 5);
    }
  }, [filter, dailyMonth, dailyYear, weeklyYear, monthlySubMode, monthlyYear, monthlySingleMonth, yearlyStart]);

  // Year options
  const yearOptions = useMemo(() => {
    const opts = [];
    for (let y = CURRENT_YEAR; y >= CURRENT_YEAR - 5; y--) {
      opts.push({ label: `${y + THAI_YEAR_OFFSET}`, value: `${y}` });
    }
    return opts;
  }, []);

  // Month options
  const monthOptions = MONTH_NAMES_FULL.map((m, i) => ({ label: m, value: `${i}` }));

  // Year range options for yearly view
  const yearRangeOptions = useMemo(() => {
    const opts = [];
    for (let s = CURRENT_YEAR - 4; s >= CURRENT_YEAR - 14; s -= 5) {
      const end = s + 4;
      opts.push({ label: `${s + THAI_YEAR_OFFSET} — ${end + THAI_YEAR_OFFSET}`, value: `${s}` });
    }
    return opts;
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E2E8F0] animate-fade-in stagger-5">
      {/* ─── Header Row ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#1E293B]">สรุปยอดขาย</h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">{chartData.subtitle}</p>
        </div>
        {/* Main filter tabs */}
        <div className="flex bg-[#F1F5F9] rounded-xl p-1 gap-0.5">
          {(Object.keys(CHART_FILTER_LABELS) as ChartFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                filter === key
                  ? "bg-[#1E40AF] text-white shadow-md"
                  : "text-[#64748B] hover:text-[#1E293B] hover:bg-white/60"
              }`}
            >
              {CHART_FILTER_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Sub-selectors ─── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filter === "daily" && (
          <>
            <Dropdown
              value={`${dailyMonth}`}
              options={monthOptions}
              onChange={(v) => setDailyMonth(Number(v))}
            />
            <Dropdown
              value={`${dailyYear}`}
              options={yearOptions}
              onChange={(v) => setDailyYear(Number(v))}
            />
          </>
        )}

        {filter === "weekly" && (
          <Dropdown
            value={`${weeklyYear}`}
            options={yearOptions}
            onChange={(v) => setWeeklyYear(Number(v))}
          />
        )}

        {filter === "monthly" && (
          <>
            {/* Sub-mode toggle */}
            <div className="flex bg-[#F1F5F9] rounded-lg p-0.5 gap-0.5 mr-2">
              <button
                onClick={() => setMonthlySubMode("full-year")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  monthlySubMode === "full-year"
                    ? "bg-white text-[#1E293B] shadow-sm"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                ทั้งปี
              </button>
              <button
                onClick={() => setMonthlySubMode("single-month")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  monthlySubMode === "single-month"
                    ? "bg-white text-[#1E293B] shadow-sm"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                ทีละเดือน
              </button>
            </div>

            {monthlySubMode === "single-month" && (
              <Dropdown
                value={`${monthlySingleMonth}`}
                options={monthOptions}
                onChange={(v) => setMonthlySingleMonth(Number(v))}
              />
            )}
            <Dropdown
              value={`${monthlyYear}`}
              options={yearOptions}
              onChange={(v) => setMonthlyYear(Number(v))}
            />
          </>
        )}

        {filter === "yearly" && (
          <Dropdown
            value={`${yearlyStart}`}
            options={yearRangeOptions}
            onChange={(v) => setYearlyStart(Number(v))}
          />
        )}
      </div>

      {/* ─── Chart title ─── */}
      <h4 className="text-center text-base sm:text-lg font-bold text-[#1E293B] mb-3">
        {chartData.title}
      </h4>

      {/* ─── Chart ─── */}
      <SVGLineChart
        data={chartData.data}
        color={chartData.color}
        tooltipCtx={{
          filter,
          month: filter === "daily" ? dailyMonth : filter === "monthly" && monthlySubMode === "single-month" ? monthlySingleMonth : undefined,
          year: filter === "daily" ? dailyYear : filter === "weekly" ? weeklyYear : filter === "monthly" ? monthlyYear : undefined,
          monthlySubMode: filter === "monthly" ? monthlySubMode : undefined,
          yearlyStart: filter === "yearly" ? yearlyStart : undefined,
        }}
      />
    </div>
  );
}
