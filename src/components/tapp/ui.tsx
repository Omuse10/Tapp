import { type ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>;
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <header className="mb-8">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
        {title}
      </h2>
    </header>
  );
}

export function GlowButton({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href ?? "#"}
      className="glass glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-transform duration-300 hover:scale-[1.03]"
    >
      {children}
    </a>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="glass rounded-full px-3 py-1.5 text-xs tracking-tight text-muted-foreground">
      {children}
    </span>
  );
}
