"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "edit" | "delete" | "success" | "treatment" | "sky" | "purple";
  onConfirm: () => void;
  onCancel: () => void;
}

const THEME: Record<string, { iconBg: string; iconStroke: string; btnClass: string }> = {
  edit: {
    iconBg: "bg-blue-50",
    iconStroke: "#3B82F6",
    btnClass: "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:brightness-110 shadow-[#0072FF]/20",
  },
  delete: {
    iconBg: "bg-red-50",
    iconStroke: "#EF4444",
    btnClass: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
  },
  success: {
    iconBg: "bg-emerald-50",
    iconStroke: "#10B981",
    btnClass: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
  },
  treatment: {
    iconBg: "bg-pink-50",
    iconStroke: "#DB2777",
    btnClass: "bg-pink-600 hover:bg-pink-700 shadow-pink-500/20",
  },
  sky: {
    iconBg: "bg-sky-50",
    iconStroke: "#0284C7",
    btnClass: "bg-sky-600 hover:bg-sky-700 shadow-sky-500/20",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconStroke: "#7C3AED",
    btnClass: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
  },
};

const ICONS: Record<string, (color: string) => React.ReactNode> = {
  edit: (c) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  delete: (c) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  success: (c) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  treatment: (c) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  sky: (c) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  purple: (c) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  type = "edit",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const theme = THEME[type] || THEME.edit;
  const iconFn = ICONS[type] || ICONS.edit;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl mx-4"
        style={{ animation: "confirm-pop 0.25s ease-out" }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.iconBg}`}>
            {iconFn(theme.iconStroke)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#1E293B] text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-[#64748B] text-center mb-8">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-5 py-2.5 rounded-xl text-white text-sm font-semibold active:scale-[0.98] transition-all shadow-lg ${theme.btnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirm-pop {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
