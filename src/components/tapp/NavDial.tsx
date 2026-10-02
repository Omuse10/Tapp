import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

export type NavItem = { id: string; label: string; icon: LucideIcon };

export function NavDial({
  items,
  index,
  onChange,
  hint,
}: {
  items: NavItem[];
  index: number;
  onChange: (next: number, dir: 1 | -1) => void;
  hint: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-120, 120], [-4, 4]);
  const current = items[index]!;
  const Icon = current.icon;

  const step = (dir: 1 | -1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
      return;
    }
    onChange(next, dir);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 px-7 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pb-8">
      {hint && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs tracking-[0.25em] text-muted-foreground"
        >
          SWIPE TO EXPLORE →
        </motion.p>
      )}

      <motion.div
        className="nav-glass pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-full p-2"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.28}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) step(1);
          else if (info.offset.x > 50) step(-1);
          else animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
        }}
      >
        <button
          onClick={() => step(1)}
          aria-label={`Current section: ${current.label}. Go to next section`}
          className="flex min-w-0 flex-1 items-center gap-4"
        >
          <motion.span
            key={current.id}
            initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="nav-icon grid h-12 w-12 shrink-0 place-items-center rounded-full"
          >
            <Icon className="h-6 w-6" />
          </motion.span>
          <span className="h-7 w-px shrink-0 bg-glass-border" aria-hidden />
          <motion.span
            key={`${current.id}-label`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0 truncate text-left text-base font-normal"
          >
            {current.label}
          </motion.span>
        </button>

        <button
          aria-label="Next section"
          onClick={() => step(1)}
          disabled={index === items.length - 1}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </motion.div>

    </div>
  );
}
