import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { createTimeline, stagger } from "animejs";
import useAnimeScope from "@/hooks/useAnimeScope";
import { useNavTransition } from "@/components/NavTransitionContext";

const navItems = [
  { label: "OVERVIEW", path: "/", index: "01", color: "bg-accent-teal" },
  { label: "SYSTEM", path: "/work", index: "02", color: "bg-accent-pink" },
  { label: "RESEARCH", path: "/about", index: "03", color: "bg-accent-coral" },
  { label: "TEAM", path: "/team", index: "04", color: "bg-accent-orange" },
];

const logoVariants = {
  hidden: { x: -28, opacity: 0, scale: 0.96 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(18px)",
    transition: { duration: 0.24, when: "beforeChildren", staggerChildren: 0.08, delayChildren: 0.08 },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.2, staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, y: 54, scaleY: 0.9, clipPath: "inset(28% 0 0 0)" },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 0.46, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: 30,
    scaleY: 0.96,
    clipPath: "inset(0 0 22% 0)",
    transition: { duration: 0.26, ease: [0.4, 0, 1, 1] },
  },
};

const mobileStripeContentVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.34, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 },
  },
  exit: {
    opacity: 0,
    y: 12,
    filter: "blur(8px)",
    transition: { duration: 0.18 },
  },
};

type StripeMetric = {
  left: number;
  width: number;
};

type MobileStripeMetric = {
  top: number;
  height: number;
};

type TransitionStage = "idle" | "cover";
type TransitionMode = "desktop" | "mobile" | null;

const isDesktopViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getCollapsedStripeMetrics = (navRoot: HTMLElement) => {
  const { left, width } = navRoot.getBoundingClientRect();
  const stripeWidth = width / navItems.length;

  return navItems.map((_, index) => ({
    left: left + stripeWidth * index,
    width: stripeWidth,
  }));
};

const getExpandedStripeMetrics = () => {
  const stripeWidth = window.innerWidth / navItems.length;

  return navItems.map((_, index) => ({
    left: stripeWidth * index,
    width: stripeWidth,
  }));
};

const getMobileCollapsedStripeMetrics = (navRoot: HTMLElement) =>
  Array.from(navRoot.querySelectorAll<HTMLElement>("[data-mobile-nav-stripe]")).map((stripe) => {
    const { top, height } = stripe.getBoundingClientRect();

    return { top, height };
  });

const getExpandedMobileStripeMetrics = () => {
  const stripeHeight = window.innerHeight / navItems.length;

  return navItems.map((_, index) => ({
    top: stripeHeight * index,
    height: stripeHeight,
  }));
};

const primeOverlayStripes = (
  overlayRoot: HTMLDivElement,
  stripes: HTMLDivElement[],
  metrics: StripeMetric[]
) => {
  overlayRoot.style.visibility = "visible";
  overlayRoot.style.opacity = "1";

  stripes.forEach((stripe, index) => {
    const metric = metrics[index];
    stripe.style.left = `${metric.left}px`;
    stripe.style.width = `${metric.width}px`;
    stripe.style.top = "0px";
    stripe.style.height = "100vh";
    stripe.style.opacity = "1";
    stripe.style.transform = "translateX(0px) scaleX(1)";
  });
};

const primeMobileOverlayStripes = (
  overlayRoot: HTMLDivElement,
  stripes: HTMLDivElement[],
  metrics: MobileStripeMetric[]
) => {
  overlayRoot.style.visibility = "visible";
  overlayRoot.style.opacity = "1";

  stripes.forEach((stripe, index) => {
    const metric = metrics[index];
    stripe.style.left = "0px";
    stripe.style.width = "100vw";
    stripe.style.top = `${metric.top}px`;
    stripe.style.height = `${metric.height}px`;
    stripe.style.opacity = "1";
    stripe.style.transform = "translateY(0px) scaleY(1)";
  });
};

const resetDesktopTargets = (
  badge: HTMLElement | null,
  labelWraps: HTMLElement[],
  overlayRoot: HTMLDivElement | null,
  overlayBadge: HTMLElement | null,
  overlayLabelWraps: HTMLElement[],
  overlayStripes: HTMLDivElement[],
  overlaySelectedFills: HTMLElement[],
  overlayTitle: HTMLElement | null
) => {
  if (badge) {
    badge.style.opacity = "1";
    badge.style.transform = "translateY(0px) scale(1)";
  }

  labelWraps.forEach((labelWrap) => {
    labelWrap.style.opacity = "1";
    labelWrap.style.transform = "translateY(0px)";
    labelWrap.style.filter = "blur(0px)";
  });

  if (overlayBadge) {
    overlayBadge.style.opacity = "0";
    overlayBadge.style.transform = "translateY(0px) scale(1)";
  }

  overlayLabelWraps.forEach((labelWrap) => {
    labelWrap.style.opacity = "0";
    labelWrap.style.transform = "translateY(0px)";
    labelWrap.style.filter = "blur(0px)";
  });

  overlaySelectedFills.forEach((fill) => {
    fill.style.opacity = "0";
    fill.style.transform = "scale(1)";
  });

  if (overlayTitle) {
    overlayTitle.style.opacity = "0";
    overlayTitle.style.transform = "translateY(24px) scale(0.96)";
    overlayTitle.style.filter = "blur(10px)";
  }

  overlayStripes.forEach((stripe) => {
    stripe.style.opacity = "1";
    stripe.style.transform = "translateX(0px) scaleX(1)";
  });

  if (overlayRoot) {
    overlayRoot.style.opacity = "0";
    overlayRoot.style.visibility = "hidden";
  }
};

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavTransitioning, setIsNavTransitioning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>("idle");
  const [transitionMode, setTransitionMode] = useState<TransitionMode>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setNavTransitionActive } = useNavTransition();
  const desktopNavRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const overlayRootRef = useRef<HTMLDivElement>(null);
  const mobileOverlayRootRef = useRef<HTMLDivElement>(null);
  const activeTimelineRef = useRef<ReturnType<typeof createTimeline> | null>(null);

  const pendingItem =
    navItems.find((item) => item.path === pendingPath) ??
    navItems.find((item) => item.path === location.pathname) ??
    navItems[0];

  useAnimeScope(
    desktopNavRef,
    (self, { reducedMotion }) => {
      if (reducedMotion) return;

      const root = (self as { root: HTMLElement }).root;
      const badge = root.querySelector<HTMLElement>("[data-nav-badge]");
      const stripes = Array.from(root.querySelectorAll<HTMLElement>("[data-nav-stripe]"));
      const labelWraps = Array.from(root.querySelectorAll<HTMLElement>("[data-nav-label-wrap]"));
      const sheens = Array.from(root.querySelectorAll<HTMLElement>("[data-nav-sheen]"));

      if (badge) {
        badge.style.opacity = "0";
        badge.style.transform = "translateY(-18px) scale(0.92)";
      }

      stripes.forEach((stripe) => {
        stripe.style.opacity = "0";
        stripe.style.transform = "translateX(42px) scaleX(0.86)";
        stripe.style.transformOrigin = "right center";
      });

      labelWraps.forEach((labelWrap) => {
        labelWrap.style.opacity = "0";
        labelWrap.style.transform = "translateY(30px)";
        labelWrap.style.filter = "blur(8px)";
      });

      sheens.forEach((sheen) => {
        sheen.style.opacity = "0";
        sheen.style.transform = "translateX(-120%)";
      });

      createTimeline()
        .add(badge ?? {}, {
          opacity: [0, 1],
          translateY: [-18, 0],
          scale: [0.92, 1],
          duration: 520,
          ease: "out(4)",
        })
        .add(
          stripes,
          {
            opacity: [0, 1],
            translateX: [42, 0],
            scaleX: [0.86, 1],
            duration: 620,
            ease: "out(4)",
            delay: stagger(100),
          },
          80
        )
        .add(
          labelWraps,
          {
            opacity: [0, 1],
            translateY: [30, 0],
            filter: ["blur(8px)", "blur(0px)"],
            duration: 480,
            ease: "out(4)",
            delay: stagger(85),
          },
          220
        )
        .add(
          sheens,
          {
            opacity: [0, 0.28, 0],
            translateX: ["-120%", "120%"],
            duration: 760,
            ease: "inOut(2)",
            delay: stagger(80),
          },
          300
        );
    },
    []
  );

  const clearTransitionState = () => {
    setIsNavTransitioning(false);
    setPendingPath(null);
    setTransitionStage("idle");
    setTransitionMode(null);
    setNavTransitionActive(false);
  };

  const playDesktopTransition = (targetPath: string) => {
    const navRoot = desktopNavRef.current;
    const overlayRoot = overlayRootRef.current;

    if (!navRoot || !overlayRoot || typeof window === "undefined") {
      navigate(targetPath);
      return;
    }

    if (prefersReducedMotion() || !isDesktopViewport()) {
      navigate(targetPath);
      return;
    }

    const badge = navRoot.querySelector<HTMLElement>("[data-nav-badge]");
    const labelWraps = Array.from(navRoot.querySelectorAll<HTMLElement>("[data-nav-label-wrap]"));
    const overlayStripes = Array.from(
      overlayRoot.querySelectorAll<HTMLDivElement>("[data-nav-overlay-stripe]")
    );
    const overlayBadge = overlayRoot.querySelector<HTMLElement>("[data-nav-overlay-badge]");
    const overlayLabelWraps = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-overlay-label-wrap]")
    );
    const overlaySelectedFills = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-overlay-selected-fill]")
    );
    const overlayTitle = overlayRoot.querySelector<HTMLElement>("[data-nav-overlay-title]");

    if (!overlayStripes.length || !overlayBadge || !overlayLabelWraps.length || !overlayTitle) {
      navigate(targetPath);
      return;
    }

    const collapsedMetrics = getCollapsedStripeMetrics(navRoot);
    const expandedMetrics = getExpandedStripeMetrics();

    activeTimelineRef.current?.pause();
    setPendingPath(targetPath);
    setIsNavTransitioning(true);
    setTransitionStage("cover");
    setTransitionMode("desktop");
    setNavTransitionActive(true);

    primeOverlayStripes(overlayRoot, overlayStripes, collapsedMetrics);

    overlayBadge.style.opacity = "0";
    overlayBadge.style.transform = "translateY(140px) scale(0.88)";

    overlayLabelWraps.forEach((labelWrap) => {
      labelWrap.style.opacity = "0";
      labelWrap.style.transform = "translateY(-180px)";
      labelWrap.style.filter = "blur(12px)";
    });

    overlaySelectedFills.forEach((fill) => {
      fill.style.opacity = "0";
      fill.style.transform = "scale(0.96)";
    });

    overlayTitle.style.opacity = "0";
    overlayTitle.style.transform = "translateY(24px) scale(0.96)";
    overlayTitle.style.filter = "blur(10px)";

    activeTimelineRef.current = createTimeline({
      defaults: {
        ease: "inOut(3)",
      },
    })
      .add(badge ?? {}, {
        opacity: [1, 0],
        translateY: [0, -110],
        scale: [1, 0.9],
        duration: 260,
        ease: "in(3)",
      })
      .add(
        labelWraps,
        {
          opacity: [1, 0],
          translateY: [0, 120],
          filter: ["blur(0px)", "blur(6px)"],
          duration: 260,
          delay: stagger(38),
          ease: "in(3)",
        },
        20
      )
      .add(
        overlayStripes,
        {
          left: (_, index) => [
            `${collapsedMetrics[index].left}px`,
            `${expandedMetrics[index].left}px`,
          ],
          width: (_, index) => [
            `${collapsedMetrics[index].width}px`,
            `${expandedMetrics[index].width}px`,
          ],
          duration: 620,
          delay: stagger(35),
          ease: "inOut(4)",
        },
        0
      )
      .add(
        overlayBadge,
        {
          opacity: [0, 1],
          translateY: [140, 0],
          scale: [0.88, 1],
          duration: 360,
          ease: "out(4)",
        },
        180
      )
      .add(
        overlayLabelWraps,
        {
          opacity: [0, 1],
          translateY: [-180, 0],
          filter: ["blur(12px)", "blur(0px)"],
          duration: 380,
          delay: stagger(90),
          ease: "out(4)",
        },
        260
      )
      .call(() => {
        navigate(targetPath);
      });
  };

  const playMobileTransition = (targetPath: string) => {
    const navRoot = mobileNavRef.current;
    const overlayRoot = mobileOverlayRootRef.current;

    if (!navRoot || !overlayRoot || typeof window === "undefined") {
      setMenuOpen(false);
      navigate(targetPath);
      return;
    }

    if (prefersReducedMotion() || isDesktopViewport()) {
      setMenuOpen(false);
      navigate(targetPath);
      return;
    }

    const selectedIndex = navItems.findIndex((item) => item.path === targetPath);
    const shellStripes = Array.from(
      navRoot.querySelectorAll<HTMLElement>("[data-mobile-nav-stripe]")
    );
    const shellContent = Array.from(
      navRoot.querySelectorAll<HTMLElement>("[data-mobile-nav-label-wrap]")
    );
    const overlayStripes = Array.from(
      overlayRoot.querySelectorAll<HTMLDivElement>("[data-nav-mobile-overlay-stripe]")
    );
    const overlayLabelWraps = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-mobile-overlay-label-wrap]")
    );
    const overlaySelectedFills = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-mobile-overlay-selected-fill]")
    );
    const overlayTitle = overlayRoot.querySelector<HTMLElement>("[data-nav-mobile-overlay-title]");

    if (
      selectedIndex === -1 ||
      !shellStripes.length ||
      !overlayStripes.length ||
      !overlayLabelWraps.length ||
      !overlayTitle
    ) {
      setMenuOpen(false);
      navigate(targetPath);
      return;
    }

    const collapsedMetrics = getMobileCollapsedStripeMetrics(navRoot);
    const expandedMetrics = getExpandedMobileStripeMetrics();

    activeTimelineRef.current?.pause();
    setPendingPath(targetPath);
    setIsNavTransitioning(true);
    setTransitionStage("cover");
    setTransitionMode("mobile");
    setNavTransitionActive(true);

    primeMobileOverlayStripes(overlayRoot, overlayStripes, collapsedMetrics);

    overlayLabelWraps.forEach((labelWrap) => {
      labelWrap.style.opacity = "0";
      labelWrap.style.transform = "translateY(24px)";
      labelWrap.style.filter = "blur(10px)";
    });

    overlaySelectedFills.forEach((fill) => {
      fill.style.opacity = "0";
      fill.style.transform = "scaleY(0.94)";
    });

    overlayTitle.style.opacity = "0";
    overlayTitle.style.transform = "translateY(28px) scale(0.96)";
    overlayTitle.style.filter = "blur(12px)";

    activeTimelineRef.current = createTimeline({
      defaults: {
        ease: "inOut(3)",
      },
    })
      .add(
        shellContent,
        {
          opacity: [1, 0],
          translateY: [0, 18],
          filter: ["blur(0px)", "blur(8px)"],
          duration: 220,
          delay: stagger(24),
          ease: "in(3)",
        },
        0
      )
      .add(
        shellStripes,
        {
          opacity: (_, index) => (index === selectedIndex ? [1, 0.45] : [1, 0]),
          translateX: (_, index) => {
            if (index === selectedIndex) return [0, 0];
            return index < selectedIndex ? [0, -48] : [0, 48];
          },
          duration: 260,
          delay: stagger(16),
          ease: "in(3)",
        },
        20
      )
      .add(
        overlayStripes,
        {
          top: (_, index) => [
            `${collapsedMetrics[index].top}px`,
            `${expandedMetrics[index].top}px`,
          ],
          height: (_, index) => [
            `${collapsedMetrics[index].height}px`,
            `${expandedMetrics[index].height}px`,
          ],
          duration: 540,
          delay: stagger(26),
          ease: "inOut(4)",
        },
        0
      )
      .add(
        overlayLabelWraps,
        {
          opacity: [0, 1],
          translateY: [24, 0],
          filter: ["blur(10px)", "blur(0px)"],
          duration: 300,
          delay: stagger(52),
          ease: "out(4)",
        },
        180
      )
      .call(() => {
        setMenuOpen(false);
        navigate(targetPath);
      });
  };

  const playDesktopReveal = () => {
    const navRoot = desktopNavRef.current;
    const overlayRoot = overlayRootRef.current;

    if (!navRoot || !overlayRoot || !pendingPath || typeof window === "undefined") {
      clearTransitionState();
      return;
    }

    const selectedIndex = navItems.findIndex((item) => item.path === pendingPath);
    if (selectedIndex === -1) {
      clearTransitionState();
      return;
    }

    const badge = navRoot.querySelector<HTMLElement>("[data-nav-badge]");
    const labelWraps = Array.from(navRoot.querySelectorAll<HTMLElement>("[data-nav-label-wrap]"));
    const overlayStripes = Array.from(
      overlayRoot.querySelectorAll<HTMLDivElement>("[data-nav-overlay-stripe]")
    );
    const overlayBadge = overlayRoot.querySelector<HTMLElement>("[data-nav-overlay-badge]");
    const overlayLabelWraps = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-overlay-label-wrap]")
    );
    const overlaySelectedFills = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-overlay-selected-fill]")
    );
    const overlayTitle = overlayRoot.querySelector<HTMLElement>("[data-nav-overlay-title]");

    if (!overlayStripes.length || !overlayBadge || !overlayLabelWraps.length || !overlayTitle) {
      clearTransitionState();
      return;
    }

    const collapsedMetrics = getCollapsedStripeMetrics(navRoot);
    const expandedMetrics = getExpandedStripeMetrics();

    activeTimelineRef.current?.pause();
    primeOverlayStripes(overlayRoot, overlayStripes, expandedMetrics);

    if (badge) {
      badge.style.opacity = "0";
      badge.style.transform = "translateY(-110px) scale(0.9)";
    }

    labelWraps.forEach((labelWrap) => {
      labelWrap.style.opacity = "0";
      labelWrap.style.transform = "translateY(120px)";
      labelWrap.style.filter = "blur(6px)";
    });

    overlayBadge.style.opacity = "1";
    overlayBadge.style.transform = "translateY(0px) scale(1)";

    overlayLabelWraps.forEach((labelWrap) => {
      labelWrap.style.opacity = "1";
      labelWrap.style.transform = "translateY(0px)";
      labelWrap.style.filter = "blur(0px)";
    });

    overlaySelectedFills.forEach((fill) => {
      fill.style.opacity = "0";
      fill.style.transform = "scale(0.96)";
    });

    overlayTitle.style.opacity = "0";
    overlayTitle.style.transform = "translateY(24px) scale(0.96)";
    overlayTitle.style.filter = "blur(10px)";

    activeTimelineRef.current = createTimeline({
      defaults: {
        ease: "inOut(3)",
      },
      onComplete: () => {
        resetDesktopTargets(
          badge,
          labelWraps,
          overlayRoot,
          overlayBadge,
          overlayLabelWraps,
          overlayStripes,
          overlaySelectedFills,
          overlayTitle
        );
        clearTransitionState();
      },
    })
      .add(overlayBadge, {
        opacity: [1, 0],
        translateY: [0, -72],
        scale: [1, 0.92],
        duration: 220,
        ease: "in(3)",
      })
      .add(
        overlayLabelWraps,
        {
          opacity: [1, 0],
          translateY: [0, 110],
          filter: ["blur(0px)", "blur(8px)"],
          duration: 240,
          delay: stagger(55),
          ease: "in(3)",
        },
        0
      )
      .add(
        overlayStripes,
        {
          left: (_, index) => {
            const currentLeft = expandedMetrics[index].left;

            if (index === selectedIndex) {
              return [`${currentLeft}px`, "0px"];
            }

            return index < selectedIndex
              ? [`${currentLeft}px`, `${-expandedMetrics[index].width - 72}px`]
              : [`${currentLeft}px`, `${window.innerWidth + 72}px`];
          },
          width: (_, index) =>
            index === selectedIndex
              ? [`${expandedMetrics[index].width}px`, `${window.innerWidth}px`]
              : [`${expandedMetrics[index].width}px`, `${expandedMetrics[index].width}px`],
          opacity: (_, index) => (index === selectedIndex ? [1, 1] : [1, 0]),
          duration: (_, index) => (index === selectedIndex ? 520 : 420),
          delay: (_, index) => (index === selectedIndex ? 120 : index * 28),
          ease: "inOut(4)",
        },
        100
      )
      .add(
        overlaySelectedFills[selectedIndex] ?? {},
        {
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 320,
          ease: "out(4)",
        },
        300
      )
      .add(
        overlayTitle,
        {
          opacity: [0, 1],
          translateY: [24, 0],
          scale: [0.96, 1],
          filter: ["blur(10px)", "blur(0px)"],
          duration: 360,
          ease: "out(4)",
        },
        420
      )
      .add(
        overlayTitle,
        {
          opacity: [1, 0],
          translateY: [0, -18],
          scale: [1, 1.02],
          filter: ["blur(0px)", "blur(10px)"],
          duration: 240,
          ease: "in(3)",
        },
        1080
      )
      .add(
        overlaySelectedFills[selectedIndex] ?? {},
        {
          opacity: [1, 0],
          duration: 220,
          ease: "in(3)",
        },
        1120
      )
      .add(
        overlayRoot,
        {
          opacity: [1, 0],
          duration: 260,
          ease: "inOut(3)",
        },
        1180
      )
      .add(
        badge ?? {},
        {
          opacity: [0, 1],
          translateY: [-110, 0],
          scale: [0.9, 1],
          duration: 320,
          ease: "out(4)",
        },
        1230
      )
      .add(
        labelWraps,
        {
          opacity: [0, 1],
          translateY: [120, 0],
          filter: ["blur(6px)", "blur(0px)"],
          duration: 300,
          delay: stagger(38),
          ease: "out(4)",
        },
        1260
      )
      .add(
        overlayStripes,
        {
          left: (_, index) => [
            index === selectedIndex
              ? "0px"
              : index < selectedIndex
                ? `${-expandedMetrics[index].width - 72}px`
                : `${window.innerWidth + 72}px`,
            `${collapsedMetrics[index].left}px`,
          ],
          width: (_, index) => [
            index === selectedIndex
              ? `${window.innerWidth}px`
              : `${expandedMetrics[index].width}px`,
            `${collapsedMetrics[index].width}px`,
          ],
          opacity: (_, index) => (index === selectedIndex ? [1, 1] : [0, 1]),
          duration: 0,
        },
        1430
      );
  };

  const playMobileReveal = () => {
    const overlayRoot = mobileOverlayRootRef.current;

    if (!overlayRoot || !pendingPath || typeof window === "undefined") {
      clearTransitionState();
      return;
    }

    const selectedIndex = navItems.findIndex((item) => item.path === pendingPath);
    const overlayStripes = Array.from(
      overlayRoot.querySelectorAll<HTMLDivElement>("[data-nav-mobile-overlay-stripe]")
    );
    const overlayLabelWraps = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-mobile-overlay-label-wrap]")
    );
    const overlaySelectedFills = Array.from(
      overlayRoot.querySelectorAll<HTMLElement>("[data-nav-mobile-overlay-selected-fill]")
    );
    const overlayTitle = overlayRoot.querySelector<HTMLElement>("[data-nav-mobile-overlay-title]");

    if (selectedIndex === -1 || !overlayStripes.length || !overlayLabelWraps.length || !overlayTitle) {
      clearTransitionState();
      return;
    }

    const expandedMetrics = getExpandedMobileStripeMetrics();

    activeTimelineRef.current?.pause();
    primeMobileOverlayStripes(overlayRoot, overlayStripes, expandedMetrics);

    overlayLabelWraps.forEach((labelWrap) => {
      labelWrap.style.opacity = "1";
      labelWrap.style.transform = "translateY(0px)";
      labelWrap.style.filter = "blur(0px)";
    });

    overlaySelectedFills.forEach((fill) => {
      fill.style.opacity = "0";
      fill.style.transform = "scaleY(0.94)";
    });

    overlayTitle.style.opacity = "0";
    overlayTitle.style.transform = "translateY(28px) scale(0.96)";
    overlayTitle.style.filter = "blur(12px)";

    activeTimelineRef.current = createTimeline({
      defaults: {
        ease: "inOut(3)",
      },
      onComplete: () => {
        overlayLabelWraps.forEach((labelWrap) => {
          labelWrap.style.opacity = "0";
          labelWrap.style.transform = "translateY(0px)";
          labelWrap.style.filter = "blur(0px)";
        });

        overlaySelectedFills.forEach((fill) => {
          fill.style.opacity = "0";
          fill.style.transform = "scaleY(1)";
        });

        overlayTitle.style.opacity = "0";
        overlayTitle.style.transform = "translateY(28px) scale(0.96)";
        overlayTitle.style.filter = "blur(12px)";

        overlayStripes.forEach((stripe) => {
          stripe.style.opacity = "1";
          stripe.style.transform = "translateY(0px) scaleY(1)";
        });

        overlayRoot.style.opacity = "0";
        overlayRoot.style.visibility = "hidden";
        clearTransitionState();
      },
    })
      .add(
        overlayLabelWraps,
        {
          opacity: [1, 0],
          translateY: [0, 18],
          filter: ["blur(0px)", "blur(8px)"],
          duration: 220,
          delay: stagger(28),
          ease: "in(3)",
        },
        0
      )
      .add(
        overlayStripes,
        {
          top: (_, index) => {
            const currentTop = expandedMetrics[index].top;

            if (index === selectedIndex) {
              return [`${currentTop}px`, "0px"];
            }

            return index < selectedIndex
              ? [`${currentTop}px`, `${-expandedMetrics[index].height - 72}px`]
              : [`${currentTop}px`, `${window.innerHeight + 72}px`];
          },
          height: (_, index) =>
            index === selectedIndex
              ? [`${expandedMetrics[index].height}px`, `${window.innerHeight}px`]
              : [`${expandedMetrics[index].height}px`, `${expandedMetrics[index].height}px`],
          opacity: (_, index) => (index === selectedIndex ? [1, 1] : [1, 0]),
          duration: (_, index) => (index === selectedIndex ? 480 : 360),
          delay: (_, index) => (index === selectedIndex ? 100 : index * 24),
          ease: "inOut(4)",
        },
        100
      )
      .add(
        overlaySelectedFills[selectedIndex] ?? {},
        {
          opacity: [0, 1],
          scaleY: [0.94, 1],
          duration: 280,
          ease: "out(4)",
        },
        260
      )
      .add(
        overlayTitle,
        {
          opacity: [0, 1],
          translateY: [28, 0],
          scale: [0.96, 1],
          filter: ["blur(12px)", "blur(0px)"],
          duration: 340,
          ease: "out(4)",
        },
        360
      )
      .add(
        overlayTitle,
        {
          opacity: [1, 0],
          translateY: [0, -16],
          scale: [1, 1.02],
          filter: ["blur(0px)", "blur(10px)"],
          duration: 220,
          ease: "in(3)",
        },
        900
      )
      .add(
        overlaySelectedFills[selectedIndex] ?? {},
        {
          opacity: [1, 0],
          duration: 200,
          ease: "in(3)",
        },
        930
      )
      .add(
        overlayRoot,
        {
          opacity: [1, 0],
          duration: 240,
          ease: "inOut(3)",
        },
        980
      );
  };

  const handleDesktopNavigation = (targetPath: string) => {
    if (isNavTransitioning || targetPath === location.pathname) return;
    playDesktopTransition(targetPath);
  };

  const handleMobileNavigation = (targetPath: string) => {
    if (isNavTransitioning || targetPath === location.pathname) return;
    playMobileTransition(targetPath);
  };

  useEffect(() => {
    if (!isNavTransitioning || transitionStage !== "cover" || !pendingPath) return;
    if (location.pathname !== pendingPath) return;

    const frame = window.requestAnimationFrame(() => {
      if (transitionMode === "desktop") {
        playDesktopReveal();
        return;
      }

      if (transitionMode === "mobile") {
        playMobileReveal();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isNavTransitioning, location.pathname, pendingPath, transitionMode, transitionStage]);

  useEffect(() => {
    return () => {
      activeTimelineRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!menuOpen || isDesktopViewport()) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={desktopNavRef}
        className="fixed right-0 top-0 z-50 hidden h-full w-[312px] overflow-hidden lg:flex"
        style={{ pointerEvents: isNavTransitioning ? "none" : "auto" }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-10 z-20 flex justify-center">
          <div
            data-nav-badge
            className="flex h-24 w-24 items-center justify-center rounded-full border border-white/70 bg-[#FFF7ED] shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
          >
            <img
              src="/logo.png"
              alt="FindAssure logo"
              className="h-16 w-16 object-contain"
              draggable="false"
            />
          </div>
        </div>

        {navItems.map((item) => (
          <div key={item.path} data-nav-stripe className="h-full w-[78px] origin-right">
            <button
              type="button"
              onClick={() => handleDesktopNavigation(item.path)}
              className={`${item.color} relative flex h-full w-full cursor-pointer items-end justify-center border-l border-white/35 transition-opacity duration-300`}
              style={{
                boxShadow:
                  location.pathname === item.path
                    ? "inset 0 0 0 2px rgba(255,255,255,0.38)"
                    : "inset 0 1px 0 rgba(255,255,255,0.24)",
              }}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              <div
                data-nav-sheen
                className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <div className="absolute inset-0 bg-white/0 transition-colors duration-300 hover:bg-white/8" />
              <div
                data-nav-label-wrap
                className="relative z-10 flex h-full w-full items-end justify-center pb-10"
              >
                <span
                  data-nav-label
                  className="font-display whitespace-nowrap uppercase leading-none"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                    color: "rgba(255, 247, 237, 0.74)",
                    fontSize: "56px",
                    letterSpacing: "-0.08em",
                  }}
                >
                  <span
                    data-nav-index
                    className="font-body text-[12px] tracking-[0.2em]"
                    style={{ color: "rgba(255, 247, 237, 0.88)" }}
                  >
                    {item.index}
                  </span>{" "}
                  {item.label}
                </span>
              </div>

              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-x-0 top-0 h-1 bg-[#FFF7ED]"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          </div>
        ))}
      </nav>

      <div
        ref={overlayRootRef}
        className="pointer-events-none fixed inset-0 z-[80] hidden overflow-hidden lg:block"
        style={{ visibility: "hidden", opacity: 0 }}
        aria-hidden="true"
      >
        {navItems.map((item) => (
          <div
            key={`overlay-${item.path}`}
            data-nav-overlay-stripe
            className={`absolute top-0 h-full ${item.color}`}
          >
            <div
              data-nav-overlay-selected-fill
              className="absolute inset-0"
              style={{
                opacity: 0,
                background:
                  "radial-gradient(circle at 50% 20%, rgba(255,247,237,0.22), transparent 44%), linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
              }}
            />
            <div
              data-nav-overlay-label-wrap
              className="absolute inset-x-0 bottom-10 flex justify-center"
            >
              <span
                className="font-display whitespace-nowrap uppercase leading-none"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  color: "rgba(255, 247, 237, 0.76)",
                  fontSize: "74px",
                  letterSpacing: "-0.07em",
                }}
              >
                <span
                  data-nav-overlay-index
                  className="font-body text-[14px] tracking-[0.22em]"
                  style={{ color: "rgba(255, 247, 237, 0.9)" }}
                >
                  {item.index}
                </span>{" "}
                {item.label}
              </span>
            </div>
          </div>
        ))}

        <div className="absolute inset-x-0 top-8 flex justify-center">
          <div
            data-nav-overlay-badge
            className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF7ED] shadow-[0_18px_42px_rgba(15,23,42,0.18)]"
          >
            <img
              src="/logo.png"
              alt="FindAssure logo"
              className="h-16 w-16 object-contain"
              draggable="false"
            />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-16">
          <div
            data-nav-overlay-title
            className="text-center font-display uppercase leading-none"
            style={{
              color: "rgba(255, 247, 237, 0.94)",
              fontSize: "clamp(4rem, 11vw, 10rem)",
              letterSpacing: "-0.08em",
              opacity: 0,
              transform: "translateY(24px) scale(0.96)",
              filter: "blur(10px)",
            }}
          >
            {pendingItem.label}
          </div>
        </div>
      </div>

      <div
        ref={mobileOverlayRootRef}
        className="pointer-events-none fixed inset-0 z-[72] overflow-hidden lg:hidden"
        style={{ visibility: "hidden", opacity: 0 }}
        aria-hidden="true"
      >
        {navItems.map((item) => (
          <div
            key={`mobile-overlay-${item.path}`}
            data-nav-mobile-overlay-stripe
            className={`mobile-nav-overlay-stripe absolute left-0 w-full ${item.color}`}
          >
            <div
              data-nav-mobile-overlay-selected-fill
              className="absolute inset-0"
              style={{
                opacity: 0,
                background:
                  "radial-gradient(circle at 20% 20%, rgba(255,247,237,0.22), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0))",
              }}
            />
            <div
              data-nav-mobile-overlay-label-wrap
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6"
            >
              <div className="mobile-nav-label-row">
                <span className="font-body text-[11px] uppercase tracking-[0.24em] text-white/82">
                  {item.index}
                </span>
                <span className="font-display text-[clamp(2rem,10vw,4.8rem)] uppercase leading-[0.88] tracking-display text-white">
                  {item.label}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div
            data-nav-mobile-overlay-title
            className="text-center font-display uppercase leading-none"
            style={{
              color: "rgba(255, 247, 237, 0.94)",
              fontSize: "clamp(3.2rem, 16vw, 7rem)",
              letterSpacing: "-0.08em",
              opacity: 0,
              transform: "translateY(28px) scale(0.96)",
              filter: "blur(12px)",
            }}
          >
            {pendingItem.label}
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={logoVariants}
        className="fixed left-8 top-6 z-50 lg:hidden"
      >
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF7ED] p-1.5"
            style={{ boxShadow: "0 12px 24px rgba(15, 23, 42, 0.14)" }}
          >
            <img
              src="/logo.png"
              alt="FindAssure logo"
              className="h-full w-full object-contain"
              draggable="false"
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-xl leading-none tracking-display text-foreground">
              FindAssure
            </p>
            <p className="mt-1 font-body text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Research Showcase
            </p>
          </div>
        </Link>
      </motion.div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed right-6 top-6 z-[60] flex flex-col items-end gap-1.5 lg:hidden"
        aria-label="Toggle menu"
      >
        <motion.div
          animate={menuOpen ? { rotate: 45, y: 7, width: 24 } : { rotate: 0, y: 0, width: 24 }}
          className="h-[2px] origin-center bg-foreground"
          transition={{ duration: 0.3 }}
        />
        <motion.div
          animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
          className="h-[2px] w-4 bg-foreground"
          transition={{ duration: 0.2 }}
        />
        <motion.div
          animate={menuOpen ? { rotate: -45, y: -7, width: 24 } : { rotate: 0, y: 0, width: 18 }}
          className="h-[2px] origin-center bg-foreground"
          transition={{ duration: 0.3 }}
        />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[58] flex flex-col lg:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(247,248,251,0.985) 0%, rgba(240,244,250,0.985) 100%)",
              backdropFilter: "blur(18px)",
              pointerEvents: isNavTransitioning ? "none" : "auto",
            }}
          >
            <div className="pointer-events-none h-24 flex-shrink-0" />
            <div
              ref={mobileNavRef}
              data-mobile-menu-shell
              className="mobile-nav-shell flex flex-1 flex-col pb-0 pt-1"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  variants={mobileItemVariants}
                  className="flex-1 origin-top"
                >
                  <button
                    type="button"
                    data-mobile-nav-stripe
                    onClick={() => handleMobileNavigation(item.path)}
                    className={`mobile-nav-stripe ${item.color} ${location.pathname === item.path ? "mobile-nav-stripe-active" : ""}`}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_48%)]" />
                    <div className="absolute inset-0 bg-white/0 transition-colors duration-300 hover:bg-white/6" />

                    <motion.div
                      variants={mobileStripeContentVariants}
                      data-mobile-nav-label-wrap
                      className="relative z-10 flex h-full w-full items-center gap-4 px-6 py-5 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82">
                          {item.index}
                        </span>
                        <span className="font-display text-[clamp(2rem,8.4vw,4rem)] uppercase leading-[0.9] tracking-display text-white">
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
