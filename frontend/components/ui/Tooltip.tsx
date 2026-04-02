"use client";

import { useState, useRef } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  text: string;
  /** Size of the trigger icon in px (default 12) */
  size?: number;
}

/**
 * "Explain This" tooltip - shows on hover/focus.
 * Pure CSS positioning, no external libraries needed.
 */
export default function Tooltip({ text, size = 12 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <button
        type="button"
        tabIndex={0}
        aria-label="Explain this"
        className="text-slate-500 hover:text-sky-400 transition-colors focus:outline-none"
      >
        <HelpCircle size={size} />
      </button>

      {visible && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
                     w-56 rounded-xl bg-slate-900 border border-slate-700
                     px-3 py-2 text-xs text-slate-300 leading-relaxed shadow-xl
                     pointer-events-none"
          role="tooltip"
        >
          {text}
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                           border-l-4 border-r-4 border-t-4
                           border-l-transparent border-r-transparent border-t-slate-700" />
        </span>
      )}
    </span>
  );
}
