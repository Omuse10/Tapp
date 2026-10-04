import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type TouchEvent } from "react";
import heroImage from "@/assets/tapp-hero-gold.jpg";
import logoWordmark from "@/assets/tapp-logo-wordmark.png";
import logoLockup from "@/assets/tapp-logo-full.png";
import { GlassPanel, GlowButton, Pill, SectionTitle } from "./ui";

const shell = "mx-auto w-full max-w-3xl px-6 pb-40 pt-24";
const exploreCategories = [
  {
    id: "business-cards",
    title: "Digital Business Cards",
    description: "Share your identity and contact information instantly.",
    solution: "Business Identity",
  },
  {
    id: "tourism",
    title: "Tourism Experiences",
    description: "Discover destinations, places, stories, and interactive travel experiences.",
    solution: "Custom Experiences",
  },
  {
    id: "events",
    title: "Events & Experiences",
    description: "Interactive experiences for events, venues, and audiences.",
    solution: "Event Experiences",
  },
  {
    id: "smart-profiles",
    title: "Smart Profiles",
    description: "Digital profiles that bring important information together in one place.",
    solution: "Digital Profiles",
  },
] as const;

export function HomeSection({
  onActivate,
  activated,
  onExplore,
}: {
  onActivate: (open: boolean) => void;
  activated: boolean;
  onExplore: (solution: string) => void;
}) {
  const touchStart = useRef<{ x: number; y: number; inPanel: boolean } | null>(null);
  const explorePanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activated) return;
    const frame = requestAnimationFrame(() => {
      if (explorePanel.current) explorePanel.current.scrollTop = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [activated]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches.item(0);
    if (touch) {
      const target = event.target;
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        inPanel: target instanceof Element && target.closest(".explore-panel") !== null,
      };
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const origin = touchStart.current;
    const touch = event.changedTouches.item(0);
    touchStart.current = null;
    if (!origin || !touch) return;

    const distanceX = touch.clientX - origin.x;
    const distanceY = touch.clientY - origin.y;
    if (Math.abs(distanceY) < 48 || Math.abs(distanceY) <= Math.abs(distanceX)) return;
    if (distanceY < 0 && !activated) window.setTimeout(() => onActivate(true), 100);
    if (distanceY > 0 && activated) {
      if (origin.inPanel && explorePanel.current && explorePanel.current.scrollTop > 0) return;
      window.setTimeout(() => onActivate(false), 100);
    }
  };

  return (
    <div
      className="home-screen relative mx-auto min-h-svh w-full max-w-6xl overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="home-copy relative z-10 mx-auto w-full max-w-6xl px-6 pt-[19vh] sm:pt-[18vh]">
        <h1 className="max-w-sm text-[clamp(1.5rem,3vh,2rem)] font-normal leading-tight text-muted-foreground">
          Digital experiences,
          <br />
          made simple.
        </h1>
        <button
          type="button"
          aria-expanded={activated}
          aria-controls="tapp-explore-options"
          onClick={() => onActivate(!activated)}
          className="mt-8 inline-flex items-center gap-4 text-base font-normal transition-opacity hover:opacity-80 sm:mt-10"
        >
          <span className="explore-ring relative grid h-12 w-12 place-items-center rounded-full">
            <motion.span
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                scale: activated ? [1, 1.6, 1] : 1,
                opacity: activated ? [0.6, 1, 0.6] : 1,
              }}
              transition={{ duration: 1.4, repeat: activated ? Infinity : 0 }}
            />
          </span>
          {activated ? "Close exploration" : "Tap to explore"}
        </button>
      </div>
      <AnimatePresence>
        {activated && (
          <motion.div
            ref={explorePanel}
            id="tapp-explore-options"
            role="region"
            aria-label="Tapp experiences"
            className="explore-panel absolute z-20 flex flex-col overflow-y-auto rounded-md border border-glass-border bg-background/90 p-3 shadow-xl backdrop-blur-xl sm:p-5"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              aria-label="Tap, explore, discover"
              className="mb-3 flex shrink-0 items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.24em] text-primary sm:mb-4"
            >
              <span>Tap</span>
              <span aria-hidden="true">→</span>
              <span>Explore</span>
              <span aria-hidden="true">→</span>
              <span>Discover</span>
            </p>
            <div className="explore-categories grid gap-2 sm:grid-cols-2 sm:gap-3">
              {exploreCategories.map((category, categoryIndex) => (
                <motion.article
                  key={category.id}
                  className="glass rounded-md p-3 sm:p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: categoryIndex * 0.035 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-semibold sm:text-base">{category.title}</h2>
                    <span className="text-[0.65rem] tabular-nums text-primary/70">
                      0{categoryIndex + 1}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {category.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onExplore(category.solution)}
                    className="mt-2 text-sm font-medium text-primary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
                  >
                    Explore
                  </button>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        className="home-artwork pointer-events-none absolute inset-x-0 overflow-hidden"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
      >
        <img
          src={heroImage}
          alt="A luminous smart card and phone"
          width={1024}
          height={1024}
          className="hero-product-art h-full max-w-full w-auto object-contain"
        />
      </motion.div>
    </div>
  );
}

export function AboutSection() {
  const physical = ["Card", "Badge", "Phone", "Sign", "Ticket"];
  return (
    <div className={shell}>
      <SectionTitle eyebrow="About" title="What is tapp?" />
      <p className="text-base leading-relaxed text-muted-foreground">
        tapp is a digital experience company built around one simple idea: making the physical
        connect effortlessly with the digital one.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        We create smart, simple and beautifully designed experiences that let people tap, scan,
        connect and interact with businesses, schools, organizations and the services around them.
      </p>

      <div className="mt-10 space-y-4">
        <GlassPanel className="p-6">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">Physical</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {physical.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </GlassPanel>
        <Arrow />
        <GlassPanel className="glow p-6 text-center">
          <img src={logoWordmark} alt="tapp" className="h-7 w-auto" />
        </GlassPanel>
        <Arrow />
        <GlassPanel className="p-6">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
            Digital experience
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Profile", "Information", "Services", "Communication", "Content"].map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center">
      <span className="h-8 w-px [background:var(--gradient-accent)]" aria-hidden />
    </div>
  );
}

export function HowSection() {
  const steps = [
    { k: "Tap", d: "A card, badge or sign meets a phone." },
    { k: "Connect", d: "The object glows and opens its digital twin." },
    { k: "Experience", d: "Profiles, information, services and content." },
  ];
  return (
    <div className={shell}>
      <SectionTitle
        eyebrow="How it works"
        title={
          <>
            One interaction.
            <br />
            An entire experience.
          </>
        }
      />
      <div className="space-y-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.6 }}
          >
            <GlassPanel className="flex items-center gap-5 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-glass-border text-sm text-muted-foreground">
                0{i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-lg font-semibold tracking-tight">{s.k}</p>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <div className="mt-10">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
          What if everyday objects could do more?
        </p>
        <div className="mt-4 space-y-3">
          {[
            ["Identity", "Identity + Experience"],
            ["Contact", "Contact + Portfolio + Social + Website"],
            ["Identification", "Identification + Information + Services"],
          ].map(([from, to]) => (
            <GlassPanel key={from} className="p-5">
              <p className="text-sm text-muted-foreground">{from}</p>
              <p className="mt-1 text-base font-medium tracking-tight text-gradient">{to}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}

const solutions: [string, string][] = [
  ["Smart Identity", "Turn physical identity cards into connected digital experiences."],
  ["Business Identity", "Digital business cards and professional profiles."],
  ["School Experiences", "Connect students, parents, teachers and schools."],
  ["Event Experiences", "Connect physical event access to digital information."],
  ["Digital Profiles", "Rich digital identities accessible through a tap or scan."],
  ["Custom Experiences", "A digital experience built around your organization."],
];

export function SolutionsSection({
  open,
  setOpen,
}: {
  open: string | null;
  setOpen: (v: string | null) => void;
}) {
  return (
    <div className={shell}>
      <SectionTitle eyebrow="Solutions" title="What can a tap become?" />
      <div className="grid gap-4 sm:grid-cols-2">
        {solutions.map(([title, desc]) => {
          const isOpen = open === title;
          return (
            <motion.button
              key={title}
              layout
              onClick={() => setOpen(isOpen ? null : title)}
              className={`glass rounded-3xl p-6 text-left transition-shadow duration-500 ${
                isOpen ? "glow" : ""
              }`}
            >
              <motion.p layout="position" className="text-lg font-semibold tracking-tight">
                {title}
              </motion.p>
              <motion.p layout="position" className="mt-2 text-sm text-muted-foreground">
                {desc}
              </motion.p>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 flex flex-wrap gap-2 overflow-hidden"
                >
                  {["Tap", "Scan", "Portal", "Profile"].map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const products = [
  ["tapp Card", "Smart NFC-enabled physical cards."],
  ["tapp Profile", "A digital profile accessible through a tap or scan."],
  ["tapp School", "Connected school experiences."],
  ["tapp Events", "Smart event experiences."],
  ["tapp Custom", "Custom digital experiences for organizations."],
];

const examples = [
  [
    "School",
    "Student taps card",
    ["Student Profile", "Announcements", "Reports", "Events", "Services"],
  ],
  [
    "Business",
    "Client taps business card",
    ["Contact", "Portfolio", "Social Media", "Website", "Products"],
  ],
  ["Event", "Guest taps", ["Ticket", "Schedule", "Updates", "Venue", "Digital Content"]],
] as const;

export function ProductsSection() {
  return (
    <div className={shell}>
      <SectionTitle eyebrow="Products" title="Objects that open experiences." />
      <div className="space-y-4">
        {products.map(([name, desc], i) => (
          <GlassPanel key={name} className="relative overflow-hidden p-6">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-2xl [background:var(--gradient-accent)]"
              aria-hidden
            />
            <p className="text-xs tracking-[0.3em] text-muted-foreground">0{i + 1}</p>
            <p className="mt-3 text-xl font-semibold tracking-tight">{name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="mt-12">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
          In the real world
        </p>
        <div className="mt-4 space-y-4">
          {examples.map(([name, action, items]) => (
            <GlassPanel key={name} className="p-6">
              <p className="text-lg font-semibold tracking-tight">{name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{action}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <div className={shell}>
      <SectionTitle eyebrow="Contact" title="Ready to tap into more?" />
      <p className="text-base text-muted-foreground">Let's build a connected experience.</p>

      <div className="mt-8 space-y-3">
        {[
          ["Email", "tappauth@outlook.com"],
          ["Phone", "0785704123"],
          ["Location", "Nairobi, Kenya"],
        ].map(([k, v]) => (
          <GlassPanel key={k} className="flex items-center justify-between gap-4 p-5">
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{k}</span>
            {k === "Email" ? (
              <a
                href="mailto:tappauth@gmail.com"
                className="min-w-0 truncate text-sm transition-colors hover:text-primary"
              >
                {v}
              </a>
            ) : k === "Phone" ? (
              <a
                href="tel:+254785704123"
                className="min-w-0 truncate text-sm transition-colors hover:text-primary"
              >
                {v}
              </a>
            ) : (
              <span className="min-w-0 truncate text-sm">{v}</span>
            )}
          </GlassPanel>
        ))}
      </div>

      <div className="mt-8">
        <GlowButton href="mailto:tappauth@gmail.com">Start a conversation →</GlowButton>
      </div>

      <footer className="mt-16 border-t border-glass-border pt-8">
        <img src={logoLockup} alt="tapp — Verify, Connect, Build Trust" className="h-16 w-auto" />
        <p className="text-sm text-muted-foreground">Tap into more.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {["Instagram", "LinkedIn", "X"].map((s) => (
            <a
              key={s}
              href={s === "Instagram" ? "https://www.instagram.com/tapp_experience/?hl=en#" : "#"}
              target={s === "Instagram" ? "_blank" : undefined}
              rel={s === "Instagram" ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-foreground"
            >
              {s}
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} tapp. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
