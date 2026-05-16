"use client";

import { useEffect, useState } from "react";

interface SuccessToastProps {
  message: string;
  type?: "success" | "edit" | "delete" | "treatment" | "sky" | "purple";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function SuccessToast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 2500,
}: SuccessToastProps) {
  const [show, setShow] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setAnimateOut(false);
      const timer = setTimeout(() => {
        setAnimateOut(true);
        setTimeout(() => {
          setShow(false);
          onClose();
        }, 400);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!show) return null;

  const iconMap = {
    success: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    edit: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    delete: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    treatment: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    sky: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    purple: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  };

  const bgMap = {
    success: "from-emerald-500 to-emerald-600",
    edit: "from-blue-500 to-blue-600",
    delete: "from-red-500 to-red-600",
    treatment: "from-pink-500 to-pink-600",
    sky: "from-sky-500 to-sky-600",
    purple: "from-purple-500 to-purple-600",
  };

  const ringMap = {
    success: "ring-emerald-400/30",
    edit: "ring-blue-400/30",
    delete: "ring-red-400/30",
    treatment: "ring-pink-400/30",
    sky: "ring-sky-400/30",
    purple: "ring-purple-400/30",
  };

  const shadowMap = {
    success: "shadow-emerald-500/30",
    edit: "shadow-blue-500/30",
    delete: "shadow-red-500/30",
    treatment: "shadow-pink-500/30",
    sky: "shadow-sky-500/30",
    purple: "shadow-purple-500/30",
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div
        className={`pointer-events-auto flex flex-col items-center gap-4 bg-white rounded-2xl px-10 py-8 shadow-2xl border border-white/50 ${shadowMap[type]}
          ${animateOut ? "toast-out" : "toast-in"}`}
        style={{ minWidth: 280 }}
      >
        {/* Animated Icon Circle */}
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${bgMap[type]} flex items-center justify-center ring-4 ${ringMap[type]} toast-icon-bounce`}>
          {iconMap[type]}
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-lg font-bold text-[#1E293B]">{message}</p>
        </div>


      </div>

      <style>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes toast-out {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
        }
        @keyframes toast-icon-bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .toast-in {
          animation: toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .toast-out {
          animation: toast-out 0.4s ease-in forwards;
        }
        .toast-icon-bounce {
          animation: toast-icon-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.1s;
          transform: scale(0);
        }
      `}</style>
    </div>
  );
}
