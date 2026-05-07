import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type WorkflowStep = {
  index: string;
  title: string;
  description: string;
};

type AnimatedWorkflowFlowProps = {
  variant?: "full" | "compact";
  steps: WorkflowStep[];
  className?: string;
};

type FlowLayout = {
  panelHeight: number;
  scrollHeightClass: string;
  stickyTopClass: string;
  headerMaxWidthClass: string;
  pathViewBox: string;
  pathD: string;
  cardMaxWidthClassName: string;
  cards: Array<{
    left: string;
    top: string;
    width: string;
  }>;
  nodes: Array<{
    left: string;
    top: string;
  }>;
};

const trackColors = [
  "oklch(var(--accent-teal))",
  "oklch(var(--accent-pink))",
  "oklch(var(--accent-coral))",
  "oklch(var(--accent-orange))",
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;

const easeOut = (value: number) => 1 - Math.pow(1 - clamp(value), 3);

const segmentProgress = (progress: number, start: number, end: number) =>
  clamp((progress - start) / Math.max(end - start, 0.0001));

const cardRevealStops = [0, 0.26, 0.68, 0.88];
const cardRevealWindow = 0.08;

const getStepProgress = (trackProgress: number, index: number) => {
  const start = cardRevealStops[index] ?? 1;
  const end = start + cardRevealWindow;
  const nextStart = cardRevealStops[index + 1] ?? 1;
  const reveal = segmentProgress(trackProgress, start, end);

  return {
    reveal,
    active: trackProgress >= start && trackProgress < nextStart,
    passed: trackProgress >= end,
  };
};

const fullLayout: FlowLayout = {
  panelHeight: 980,
  scrollHeightClass: "h-[205vh]",
  stickyTopClass: "top-8",
  headerMaxWidthClass: "max-w-4xl",
  pathViewBox: "0 0 1000 980",
  pathD: "M380 190 H580 V500 Q580 540 540 540 H460 V735 H600",
  cardMaxWidthClassName: "max-w-[24rem]",
  cards: [
    { left: "7%", top: "6%", width: "31%" },
    { left: "58%", top: "6%", width: "32%" },
    { left: "14%", top: "58%", width: "32%" },
    { left: "60%", top: "58%", width: "31%" },
  ],
  nodes: [
    { left: "38%", top: "19.4%" },
    { left: "58%", top: "19.4%" },
    { left: "46%", top: "75%" },
    { left: "60%", top: "75%" },
  ],
};

const compactLayout: FlowLayout = {
  panelHeight: 920,
  scrollHeightClass: "h-[190vh]",
  stickyTopClass: "top-10",
  headerMaxWidthClass: "max-w-3xl",
  pathViewBox: "0 0 1000 920",
  pathD: "M390 178 H570 V460 Q570 500 530 500 H470 V690 H600",
  cardMaxWidthClassName: "max-w-[21rem]",
  cards: [
    { left: "7%", top: "6%", width: "32%" },
    { left: "57%", top: "6%", width: "33%" },
    { left: "14%", top: "58%", width: "33%" },
    { left: "60%", top: "58%", width: "31%" },
  ],
  nodes: [
    { left: "39%", top: "19.3%" },
    { left: "57%", top: "19.3%" },
    { left: "47%", top: "75%" },
    { left: "60%", top: "75%" },
  ],
};

const desktopPanelClassName =
  "relative overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(242,246,252,0.92))] shadow-[0_24px_48px_rgba(15,23,42,0.08)]";

const AnimatedWorkflowFlow = ({
  variant = "full",
  steps,
  className,
}: AnimatedWorkflowFlowProps) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [targetProgress, setTargetProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const scrollRangeRef = useRef<HTMLDivElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);

  const layout = variant === "compact" ? compactLayout : fullLayout;
  const effectiveProgress = !isDesktop || reducedMotion ? 1 : displayProgress;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMatches = () => {
      setIsDesktop(desktopQuery.matches);
      setReducedMotion(motionQuery.matches);
    };

    applyMatches();
    desktopQuery.addEventListener("change", applyMatches);
    motionQuery.addEventListener("change", applyMatches);

    return () => {
      desktopQuery.removeEventListener("change", applyMatches);
      motionQuery.removeEventListener("change", applyMatches);
    };
  }, []);

  useEffect(() => {
    if (!desktopPathRef.current) return;

    const updateLength = () => {
      const nextLength = desktopPathRef.current?.getTotalLength() ?? 0;
      setPathLength(nextLength);
    };

    updateLength();
    window.addEventListener("resize", updateLength);

    return () => {
      window.removeEventListener("resize", updateLength);
    };
  }, [layout.pathD]);

  useEffect(() => {
    if (!isDesktop || reducedMotion) {
      setTargetProgress(reducedMotion ? 1 : 0);
      setDisplayProgress(reducedMotion ? 1 : 0);
      return;
    }

    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      const range = scrollRangeRef.current;
      if (!range) return;

      const rect = range.getBoundingClientRect();
      const available = Math.max(rect.height - window.innerHeight, 1);
      const nextProgress = clamp(-rect.top / available);

      setTargetProgress(nextProgress);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isDesktop, reducedMotion]);

  useEffect(() => {
    if (!isDesktop || reducedMotion) return;

    let frame = 0;

    const tick = () => {
      setDisplayProgress((current) => {
        const delta = targetProgress - current;
        const next = Math.abs(delta) < 0.001 ? targetProgress : current + delta * 0.14;

        if (Math.abs(targetProgress - next) >= 0.001) {
          frame = window.requestAnimationFrame(tick);
        }

        return next;
      });
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isDesktop, reducedMotion, targetProgress]);

  const titleProgress = segmentProgress(effectiveProgress, 0.02, 0.16);
  const labelProgress = segmentProgress(effectiveProgress, 0.04, 0.16);
  const trackProgress = segmentProgress(effectiveProgress, 0.05, 0.95);

  return (
    <section className={cn("surface-card px-6 py-8 sm:px-8 sm:py-10", className)}>
      <div
        className={cn(
          "mb-8 flex items-start justify-between gap-6",
          variant === "compact" && "mb-6"
        )}
        style={{
          opacity: mix(0.55, 1, easeOut(titleProgress)),
          transform: `translateY(${mix(14, 0, easeOut(titleProgress))}px)`,
        }}
      >
        <div>
          <p
            className="mb-4 font-body text-sm uppercase tracking-[0.2em] text-muted-foreground"
            style={{
              opacity: mix(0.45, 1, easeOut(labelProgress)),
              transform: `translateY(${mix(10, 0, easeOut(labelProgress))}px)`,
            }}
          >
            {variant === "compact" ? "Guided flow" : "Animated workflow"}
          </p>
          <h3
            className={cn(
              "font-display text-balance tracking-display text-foreground",
              variant === "compact" ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
              layout.headerMaxWidthClass
            )}
          >
            {variant === "compact"
              ? "From found-item intake to secure handover"
              : "The FindAssure process follows a staged, verifiable recovery flow"}
          </h3>
        </div>
        <div className="hidden lg:flex gradient-chip px-4 py-2.5">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Smooth scrub
          </span>
        </div>
      </div>

      <div className="hidden lg:block">
        <div
          ref={scrollRangeRef}
          data-flow-scroll-range
          className={cn("relative", !reducedMotion && layout.scrollHeightClass)}
        >
          <div className={cn(!reducedMotion && "sticky", !reducedMotion && layout.stickyTopClass)}>
            <div
              data-flow-panel
              className={desktopPanelClassName}
              style={{ height: `${layout.panelHeight}px` }}
            >
              <svg
                viewBox={layout.pathViewBox}
                className="absolute inset-0 z-0 h-full w-full overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <path
                  ref={desktopPathRef}
                  d={layout.pathD}
                  stroke="rgba(15,23,42,0.76)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    opacity: reducedMotion || (pathLength > 0 && trackProgress > 0) ? 1 : 0,
                    strokeDasharray: pathLength || 1,
                    strokeDashoffset: reducedMotion ? 0 : pathLength ? pathLength * (1 - trackProgress) : 1,
                  }}
                />
              </svg>

              {layout.nodes.map((node, index) => {
                const nodeProgress = easeOut(
                  segmentProgress(
                    trackProgress,
                    cardRevealStops[index] ?? 1,
                    (cardRevealStops[index] ?? 1) + cardRevealWindow,
                  ),
                );

                return (
                  <span
                    key={`${steps[index]?.index ?? index}-node`}
                    data-flow-node
                    className="absolute z-10 h-5 w-5 rounded-full border-[3px] border-white shadow-[0_10px_18px_rgba(15,23,42,0.14)]"
                    style={{
                      left: node.left,
                      top: node.top,
                      backgroundColor: trackColors[index % trackColors.length],
                      opacity: nodeProgress,
                      transform: `translate(-50%, -50%) scale(${mix(0.82, 1, nodeProgress)})`,
                    }}
                  />
                );
              })}

              {steps.map((step, index) => {
                const cardLayout = layout.cards[index] ?? layout.cards[layout.cards.length - 1];
                const { reveal, active, passed } = getStepProgress(trackProgress, index);

                const cardEase = easeOut(reveal);

                return (
                  <article
                    key={step.index}
                    data-flow-card
                    className={cn(
                      "absolute z-20 rounded-[28px] border bg-white/92 px-5 py-5 shadow-[0_18px_34px_rgba(15,23,42,0.07)] backdrop-blur-[10px] sm:px-6 sm:py-6",
                      layout.cardMaxWidthClassName
                    )}
                    style={{
                      left: cardLayout.left,
                      top: cardLayout.top,
                      width: cardLayout.width,
                      opacity: reducedMotion ? 1 : cardEase,
                      transform: reducedMotion
                        ? "translateY(0px) scale(1)"
                        : `translateY(${passed ? 0 : mix(18, 0, cardEase)}px) scale(${mix(0.98, 1, cardEase)})`,
                      pointerEvents: cardEase > 0.9 ? "auto" : "none",
                      borderColor: active ? "rgba(59,130,246,0.22)" : "rgba(255,255,255,0.76)",
                      boxShadow: active
                        ? "0 24px 42px rgba(59,130,246,0.12)"
                        : "0 18px 34px rgba(15,23,42,0.07)",
                    }}
                  >
                    <div
                      className="grid w-full grid-cols-[4.25rem_minmax(0,1fr)] items-stretch overflow-hidden rounded-[16px] bg-[#111827] text-[#fef3e6]"
                      style={{
                        opacity: mix(0.55, 1, cardEase),
                        transform: `translateY(${mix(10, 0, cardEase)}px)`,
                      }}
                    >
                      <span className="flex items-center justify-center border-r border-white/10 px-3 py-3 font-body text-sm font-semibold tracking-[0.14em]">
                        {step.index}
                      </span>
                      <span className="min-w-0 px-4 py-3 font-display text-[1.15rem] leading-snug tracking-display sm:text-xl">
                        {step.title}
                      </span>
                    </div>
                    <p
                      className="mt-5 font-body text-lg leading-relaxed text-foreground/80"
                      style={{
                        opacity: cardEase,
                        transform: `translateY(${mix(12, 0, cardEase)}px)`,
                      }}
                    >
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 lg:hidden">
        <div className="relative ml-3 pl-8">
          <div className="absolute bottom-6 left-0 top-6 w-px bg-foreground/16" />
          <div className="space-y-6">
            {steps.map((step, index) => (
              <article key={step.index} data-flow-card className="surface-shell relative p-5">
                <span
                  className="absolute left-[-2.5rem] top-6 h-4 w-4 rounded-full border-[3px] border-background"
                  style={{ backgroundColor: trackColors[index % trackColors.length] }}
                />
                <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-stretch overflow-hidden rounded-[14px] bg-[#111827] text-[#fef3e6]">
                  <span className="flex items-center justify-center border-r border-white/10 px-3 py-2 font-body text-xs font-semibold tracking-[0.14em]">
                    {step.index}
                  </span>
                  <span className="min-w-0 px-3 py-2 font-display text-lg leading-snug tracking-display">
                    {step.title}
                  </span>
                </div>
                <p className="mt-4 font-body text-base leading-relaxed text-foreground/80">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedWorkflowFlow;
