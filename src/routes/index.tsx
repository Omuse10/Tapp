import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Info, Zap, Diamond, Box, User, Menu, Check } from "lucide-react";
import { NavDial, type NavItem } from "@/components/tapp/NavDial";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoWordmark from "@/assets/tapp-logo-wordmark.png";
import {
  AboutSection,
  ContactSection,
  HomeSection,
  HowSection,
  ProductsSection,
  SolutionsSection,
} from "@/components/tapp/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "tapp — Tap into more." },
      {
        name: "description",
        content:
          "tapp builds digital experiences that connect the physical world to the digital one through NFC, QR, smart cards and digital profiles.",
      },
      { property: "og:title", content: "tapp — Tap into more." },
      {
        property: "og:description",
        content:
          "Smart cards, digital profiles and custom experiences. One tap opens an entire digital experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const items: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: Info },
  { id: "how", label: "How it works", icon: Zap },
  { id: "solutions", label: "Solutions", icon: Diamond },
  { id: "products", label: "Products", icon: Box },
  { id: "contact", label: "Contact", icon: User },
];

function Index() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [hint, setHint] = useState(true);
  const [activated, setActivated] = useState(false);
  const [openSolution, setOpenSolution] = useState<string | null>(null);

  const go = useCallback((next: number, direction: 1 | -1) => {
    setDir(direction);
    setIndex(Math.max(0, Math.min(items.length - 1, next)));
    setHint(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1, 1);
      if (e.key === "ArrowLeft") go(index - 1, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 9000);
    return () => clearTimeout(t);
  }, []);

  const sections = [
    <HomeSection key="home" activated={activated} onActivate={() => setActivated(true)} />,
    <AboutSection key="about" />,
    <HowSection key="how" />,
    <SolutionsSection key="solutions" open={openSolution} setOpen={setOpenSolution} />,
    <ProductsSection key="products" />,
    <ContactSection key="contact" />,
  ];

  return (
    <main className="relative h-[100svh] overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 aura -z-10" aria-hidden />

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-7 py-8 sm:px-10">
        <button onClick={() => go(0, -1)} className="flex items-center" aria-label="tapp home">
          <img src={logoWordmark} alt="tapp" className="h-8 w-auto sm:h-9" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Open page menu" className="grid h-10 w-10 place-items-center">
              <Menu className="h-7 w-7 stroke-[1.5]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-[min(30rem,calc(100vw-3rem))] border-glass-border bg-card/95 p-3 backdrop-blur-xl"
          >
            <DropdownMenuLabel className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Pages
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {items.map(({ id, label, icon: Icon }, pageIndex) => (
              <DropdownMenuItem
                key={id}
                aria-current={pageIndex === index ? "page" : undefined}
                onSelect={() => {
                  if (pageIndex !== index) go(pageIndex, pageIndex > index ? 1 : -1);
                }}
                className="gap-4 px-4 py-3.5 text-base"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {pageIndex === index && <Check className="ml-auto h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.section
          key={items[index]!.id}
          custom={dir}
          initial={{ opacity: 0, x: dir * 60, scale: 0.98, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: dir * -60, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) go(index + 1, 1);
            else if (info.offset.x > 70) go(index - 1, -1);
          }}
          className={`no-scrollbar h-[100svh] touch-pan-y ${
            index === 0 ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {sections[index]}
        </motion.section>
      </AnimatePresence>

      <NavDial items={items} index={index} onChange={go} hint={hint} />
    </main>
  );
}
