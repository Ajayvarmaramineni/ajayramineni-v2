"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 4.0, suffix: " GPA", label: "Academic Excellence", decimal: true },
  { value: 200, suffix: "+", label: "Leads Managed", decimal: false },
  { value: 75, suffix: "%", label: "Conversion Rate", decimal: false },
  { value: 30, suffix: "+", label: "Institutional Partnerships", decimal: false },
];

function Counter({
  target,
  suffix,
  decimal,
}: {
  target: number;
  suffix: string;
  decimal: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(decimal ? Math.round(start * 10) / 10 : Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [inView, target, decimal]);

  return (
    <span ref={ref}>
      {decimal ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-16 border-y border-[#1a1a1a] bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display font-black text-[clamp(2.5rem,5vw,4rem)] text-[#6366f1] leading-none mb-2">
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimal={stat.decimal}
                />
              </p>
              <p className="text-[#71717a] text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
