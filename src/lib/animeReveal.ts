import { createTimeline, onScroll, stagger } from "animejs";

type RevealPrepOptions = {
  y?: number;
  scale?: number;
  blur?: number;
  opacity?: number;
};

const toArray = (targets: Iterable<HTMLElement>) => Array.from(targets);

export const prepareReveal = (
  targets: Iterable<HTMLElement>,
  { y = 32, scale = 1, blur = 0, opacity = 0 }: RevealPrepOptions = {}
) => {
  toArray(targets).forEach((target) => {
    target.style.opacity = String(opacity);
    target.style.transform = `translateY(${y}px) scale(${scale})`;

    if (blur > 0) {
      target.style.filter = `blur(${blur}px)`;
    }
  });
};

export const settleReveal = (targets: Iterable<HTMLElement>) => {
  toArray(targets).forEach((target) => {
    target.style.opacity = "1";
    target.style.transform = "translateY(0px) scale(1)";
    target.style.filter = "blur(0px)";
  });
};

export const setupRevealGroups = (root: ParentNode) => {
  const groups = root.querySelectorAll<HTMLElement>("[data-reveal-group]");

  groups.forEach((group) => {
    const headings = toArray(group.querySelectorAll<HTMLElement>("[data-reveal-heading]"));
    const items = toArray(group.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    const accents = toArray(group.querySelectorAll<HTMLElement>("[data-reveal-accent]"));

    if (!headings.length && !items.length && !accents.length) return;

    prepareReveal(headings, { y: 24, blur: 10 });
    prepareReveal(items, { y: 34, scale: 0.985, blur: 12 });
    prepareReveal(accents, { y: 18, scale: 0.96, blur: 6, opacity: 0.5 });

    const timeline = createTimeline({
      autoplay: onScroll({
        target: group,
        repeat: false,
      }),
    });

    if (headings.length) {
      timeline.add(headings, {
        opacity: [0, 1],
        translateY: [24, 0],
        filter: ["blur(10px)", "blur(0px)"],
        duration: 520,
        ease: "out(4)",
        delay: stagger(90),
      });
    }

    if (accents.length) {
      timeline.add(
        accents,
        {
          opacity: [0.5, 1],
          translateY: [18, 0],
          scale: [0.96, 1],
          filter: ["blur(6px)", "blur(0px)"],
          duration: 420,
          ease: "out(4)",
          delay: stagger(60),
        },
        headings.length ? 140 : 0
      );
    }

    if (items.length) {
      timeline.add(
        items,
        {
          opacity: [0, 1],
          translateY: [34, 0],
          scale: [0.985, 1],
          filter: ["blur(12px)", "blur(0px)"],
          duration: 560,
          ease: "out(4)",
          delay: stagger(110),
        },
        headings.length || accents.length ? 180 : 0
      );
    }
  });
};
