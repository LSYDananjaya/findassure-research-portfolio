import { useRef } from "react";
import { Link } from "react-router-dom";
import { createTimeline, onScroll, splitText, stagger } from "animejs";
import useAnimeScope from "@/hooks/useAnimeScope";
import { prepareReveal, setupRevealGroups } from "@/lib/animeReveal";
import { portfolioContent } from "@/content/portfolioContent";
import AngledIphoneMockup from "@/components/AngledIphoneMockup";

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const content = portfolioContent.home;

  useAnimeScope(
    pageRef,
    (self, { reducedMotion }) => {
      const root = (self as { root: HTMLElement }).root;
      const heroTitle = root.querySelector<HTMLElement>("[data-hero-title]");
      const heroCopy = root.querySelector<HTMLElement>("[data-hero-copy]");
      const heroActions = root.querySelector<HTMLElement>(
        "[data-hero-actions]",
      );
      const heroStack = root.querySelector<HTMLElement>("[data-hero-stack]");

      setupRevealGroups(root);

      const split = heroTitle
        ? splitText(heroTitle, {
            lines: { wrap: "clip" },
          })
        : null;

      const heroLines = split?.lines ? Array.from(split.lines) : [];
      const introTargets = [heroCopy, heroActions, heroStack].filter(
        (target): target is HTMLElement => Boolean(target),
      );

      if (reducedMotion) {
        split?.revert();
        return;
      }

      heroLines.forEach((line) => {
        line.style.opacity = "0";
        line.style.transform = "translateY(112%)";
      });

      prepareReveal(introTargets, { y: 26, scale: 0.985, blur: 10 });

      createTimeline()
        .add(heroLines, {
          opacity: [0, 1],
          translateY: ["112%", "0%"],
          duration: 720,
          ease: "out(4)",
          delay: stagger(90),
        })
        .add(
          heroCopy ?? {},
          {
            opacity: [0, 1],
            translateY: [26, 0],
            scale: [0.985, 1],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 460,
            ease: "out(4)",
          },
          260,
        )
        .add(
          heroActions ?? {},
          {
            opacity: [0, 1],
            translateY: [26, 0],
            scale: [0.985, 1],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 420,
            ease: "out(4)",
          },
          380,
        )
        .add(
          heroStack ?? {},
          {
            opacity: [0, 1],
            translateY: [26, 0],
            scale: [0.985, 1],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 520,
            ease: "out(4)",
          },
          260,
        );

      const band = root.querySelector<HTMLElement>("[data-band-scroll]");
      const bandItems = Array.from(
        root.querySelectorAll<HTMLElement>("[data-band-item]"),
      );

      if (band && bandItems.length) {
        prepareReveal(bandItems, { y: 18, scale: 0.97, blur: 6, opacity: 0.5 });

        createTimeline({
          autoplay: onScroll({
            target: band,
            repeat: false,
          }),
        }).add(bandItems, {
          opacity: [0.5, 1],
          translateY: [18, 0],
          scale: [0.97, 1],
          filter: ["blur(6px)", "blur(0px)"],
          duration: 360,
          ease: "out(4)",
          delay: stagger(65),
        });
      }

      return () => {
        split?.revert();
      };
    },
    [],
  );

  return (
    <div ref={pageRef} className="overflow-hidden font-body">
      <div className="border-b border-white/40 pb-4 pt-20 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {content.marqueeWords.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="mx-8 flex items-center gap-8 font-body text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              {word}
              <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-40" />
            </span>
          ))}
        </div>
      </div>

      <section className="px-6 pb-14 pt-28 sm:px-12 sm:pt-32 lg:px-16">
        <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
          <div className="space-y-8">
            <div>
              <h1
                data-hero-title
                className="font-hero text-[clamp(3.5rem,9vw,8rem)] leading-[0.82] tracking-hero text-foreground"
              >
                {content.hero.title[0]}
                <br />
                {content.hero.title[1]}
                <br />
                {content.hero.title[2]}
              </h1>
              <p
                data-hero-copy
                className="measure-wide mt-8 max-w-2xl text-lg leading-relaxed text-foreground/78 sm:text-xl"
              >
                {content.hero.description}
              </p>
            </div>

            <div data-hero-actions className="flex flex-wrap gap-4">
              <Link
                to="/work"
                className="button-primary inline-flex items-center px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-90"
              >
                {content.hero.primaryCta}
              </Link>
              <Link
                to="/about"
                className="button-secondary inline-flex items-center px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-white/90"
              >
                {content.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div data-hero-stack className="space-y-5">
            <div className="editorial-frame p-6 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] bg-accent-teal p-6 text-primary-foreground">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-white/76">
                    {content.heroPanels.finder.label}
                  </p>
                  <p className="mt-8 font-hero text-6xl leading-none tracking-hero">
                    {content.heroPanels.finder.index}
                  </p>
                  <p className="measure-wide mt-4 max-w-xs text-base leading-relaxed text-white/88">
                    {content.heroPanels.finder.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="editorial-note bg-white/86">
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {content.heroPanels.owner.label}
                    </p>
                    <p className="measure-wide mt-3 text-base leading-relaxed text-foreground/78">
                      {content.heroPanels.owner.description}
                    </p>
                  </div>
                  <div className="editorial-note bg-accent-orange text-primary-foreground">
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                      {content.heroPanels.admin.label}
                    </p>
                    <p className="measure-wide mt-3 text-base leading-relaxed text-white/88">
                      {content.heroPanels.admin.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.heroPanels.signals.map((label, index) => (
                <div key={label} className="editorial-note bg-white/82">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 font-display text-2xl tracking-display text-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-reveal-group className="px-4 py-12 sm:px-12 sm:py-14 lg:px-16">
        <div className="editorial-frame overflow-hidden px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)] lg:items-center">
            <div data-reveal-heading className="min-w-0 space-y-6 sm:space-y-7">
              <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Mobile app preview
              </p>
              <h2 className="max-w-3xl font-display text-[2.35rem] leading-[0.98] tracking-display text-foreground sm:text-5xl sm:leading-none">
                Finder, owner, and admin journeys stay visible on device
              </h2>
              <p className="measure-wide max-w-full text-base leading-relaxed text-foreground/76 sm:max-w-xl sm:text-lg">
                The prototype brings FindAssure's evidence workflow into a
                mobile interface, moving from item intake to owner claim review
                and supervised release without exposing sensitive details too
                early.
              </p>

              <div className="grid min-w-0 gap-4 sm:grid-cols-3">
                {["Finder intake", "Owner claim", "Admin review"].map(
                  (item, index) => (
                    <div
                      key={item}
                      data-reveal-item
                      className="editorial-note min-w-0 bg-white/82"
                    >
                      <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-3 font-display text-xl leading-tight tracking-display text-foreground sm:text-2xl">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div
              data-reveal-item
              className="mt-4 flex min-w-0 justify-center lg:mt-0 lg:justify-end"
            >
              <AngledIphoneMockup />
            </div>
          </div>
        </div>
      </section>

      <section data-reveal-group className="px-6 py-14 sm:px-12 lg:px-16">
        <div
          data-reveal-heading
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Research contributions
            </p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl tracking-display text-foreground sm:text-5xl">
              The portfolio foregrounds the four contributions argued in the
              paper
            </h2>
          </div>
          <p className="measure-wide max-w-xl text-base leading-relaxed text-foreground/70">
            The overview page now mirrors the research claim directly: recovery
            improves when visual evidence, semantic retrieval, indoor reasoning,
            and secure information release are treated as one system.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-4">
          {content.contributions.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="editorial-outline p-6 sm:p-7"
            >
              <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Contribution
              </p>
              <h3 className="mt-5 font-display text-3xl tracking-display text-foreground">
                {item.title}
              </h3>
              <p className="measure-wide mt-4 text-base leading-relaxed text-foreground/74">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section data-reveal-group className="px-6 py-14 sm:px-12 lg:px-16">
        <div
          data-reveal-heading
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Three-step flow
            </p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl tracking-display text-foreground sm:text-5xl">
              Capture, match, and protect define the recovery logic
            </h2>
          </div>
          <p className="measure-wide max-w-xl text-base leading-relaxed text-foreground/70">
            Each stage adds evidence, narrows ambiguity, and postpones sensitive
            disclosure until the workflow is confident enough to justify a
            handover.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {content.processColumns.map((column) => (
            <article
              key={column.title}
              data-reveal-item
              className="editorial-outline p-6 sm:p-7"
            >
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-4xl tracking-display text-foreground sm:text-5xl">
                    {column.title}
                  </p>
                  <p className="measure-wide mt-3 text-sm leading-relaxed text-muted-foreground">
                    {column.caption}
                  </p>
                </div>
                <span
                  className={`${column.color} h-4 w-20 rounded-full opacity-90`}
                />
              </div>

              <div className="space-y-3">
                {column.items.map((item) => (
                  <div
                    key={item}
                    className={`${column.color} rounded-[18px] px-5 py-4 text-base font-semibold leading-snug text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section data-reveal-group className="px-6 py-14 sm:px-12 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <div className="space-y-6">
            {content.principles.map((row) => (
              <div
                key={row.title}
                data-reveal-item
                className="flex items-center gap-5 sm:gap-7"
              >
                <div
                  className={`${row.color} editorial-disc text-primary-foreground`}
                >
                  {row.number}
                </div>
                <p className="font-hero text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-hero text-foreground">
                  {row.title}
                </p>
              </div>
            ))}
          </div>

          <div data-reveal-heading className="space-y-6">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Why the coupling matters
            </p>
            <h2 className="max-w-2xl font-display text-4xl tracking-display text-foreground sm:text-5xl">
              {content.rationale.title}
            </h2>
            <p className="measure-wide max-w-xl text-lg leading-relaxed text-foreground/76">
              {content.rationale.description}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.rationale.bullets.map((item) => (
                <div key={item} className="editorial-note bg-white/84">
                  <p className="measure-wide text-base leading-relaxed text-foreground/78">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-12 lg:px-16">
        <div
          data-band-scroll
          className="editorial-dark-band overflow-hidden px-6 py-8 sm:px-8"
        >
          <div className="mb-6 flex items-center justify-between gap-6">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                Research stack
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-display text-white sm:text-4xl">
                Connected layers across the FindAssure workflow
              </h2>
            </div>
            <Link
              to="/work"
              className="hidden sm:inline-flex font-body text-sm font-semibold uppercase tracking-[0.16em] text-white/90 transition-opacity hover:opacity-70"
            >
              Open architecture
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {content.researchStack.map((band) => (
              <span
                key={band}
                data-band-item
                className="dark-surface-chip px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em]"
              >
                {band}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-group className="px-6 py-14 sm:px-12 lg:px-16">
        <div data-reveal-heading className="mb-10">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Continue through the portfolio
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
            The rest of the site follows the same evidence-first language
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {content.featureCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              data-reveal-item
              className="group editorial-outline p-6 sm:p-7"
            >
              <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Open page
              </p>
              <h3 className="mt-5 font-display text-3xl tracking-display text-foreground transition-opacity group-hover:opacity-70">
                {card.title}
              </h3>
              <p className="measure-wide mt-4 text-base leading-relaxed text-foreground/74">
                {card.detail}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="px-6 pb-12 pt-8 sm:px-12 lg:px-16">
        <div className="editorial-outline flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-hero text-[clamp(3.4rem,9vw,7rem)] leading-[0.84] tracking-hero text-foreground">
              Safer
              <br />
              returns.
            </p>
            <p className="measure-wide mt-4 max-w-xl text-base leading-relaxed text-foreground/72">
              {content.footer}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Link
              to="/work"
              className="transition-colors hover:text-foreground"
            >
              System
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-foreground"
            >
              Research
            </Link>
            <Link
              to="/team"
              className="transition-colors hover:text-foreground"
            >
              Team
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
