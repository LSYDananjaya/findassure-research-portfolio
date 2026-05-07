import { useRef } from "react";
import { createTimeline, splitText, stagger } from "animejs";
import useAnimeScope from "@/hooks/useAnimeScope";
import { prepareReveal, setupRevealGroups } from "@/lib/animeReveal";
import { portfolioContent } from "@/content/portfolioContent";

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const content = portfolioContent.about;

  useAnimeScope(
    pageRef,
    (self, { reducedMotion }) => {
      const root = (self as { root: HTMLElement }).root;
      const title = root.querySelector<HTMLElement>("[data-page-title]");
      const copy = root.querySelector<HTMLElement>("[data-page-copy]");
      const panel = root.querySelector<HTMLElement>("[data-page-panel]");

      setupRevealGroups(root);

      const split = title
        ? splitText(title, {
            lines: { wrap: "clip" },
          })
        : null;

      const titleLines = split?.lines ? Array.from(split.lines) : [];
      const introTargets = [copy, panel].filter(
        (target): target is HTMLElement => Boolean(target)
      );

      if (reducedMotion) {
        split?.revert();
        return;
      }

      titleLines.forEach((line) => {
        line.style.opacity = "0";
        line.style.transform = "translateY(112%)";
      });

      prepareReveal(introTargets, { y: 24, scale: 0.985, blur: 10 });

      createTimeline()
        .add(panel ?? {}, {
          opacity: [0, 1],
          translateY: [24, 0],
          scale: [0.985, 1],
          filter: ["blur(10px)", "blur(0px)"],
          duration: 520,
          ease: "out(4)",
        })
        .add(
          titleLines,
          {
            opacity: [0, 1],
            translateY: ["112%", "0%"],
            duration: 700,
            ease: "out(4)",
            delay: stagger(80),
          },
          120
        )
        .add(
          copy ?? {},
          {
            opacity: [0, 1],
            translateY: [24, 0],
            scale: [0.985, 1],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 460,
            ease: "out(4)",
          },
          320
        );

      return () => {
        split?.revert();
      };
    },
    []
  );

  return (
    <div ref={pageRef} className="px-6 pb-24 pt-32 font-body sm:px-12 lg:px-16">
      <section data-page-panel className="editorial-outline px-7 py-10 sm:px-10 sm:py-12">
        <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
          {content.hero.kicker}
        </p>
        <h1
          data-page-title
          className="mt-4 max-w-5xl font-hero text-[clamp(3.2rem,8vw,6.8rem)] leading-[0.84] tracking-hero text-foreground"
        >
          {content.hero.title[0]}
          <br />
          {content.hero.title[1]}
          <br />
          {content.hero.title[2]}
        </h1>
        <p
          data-page-copy
          className="measure-wide mt-8 max-w-3xl text-lg leading-relaxed text-foreground/78 sm:text-xl"
        >
          {content.hero.description}
        </p>
      </section>

      <section data-reveal-group className="py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="space-y-4 sm:space-y-5">
            {content.principles.map((row) => (
              <div
                key={row.title}
                data-reveal-item
                className="flex min-h-[96px] items-center gap-4 sm:min-h-[116px] sm:gap-6"
              >
                <div className={`${row.color} editorial-disc-md text-primary-foreground`}>
                  {row.number}
                </div>
                <p className="min-w-0 whitespace-nowrap font-hero text-[clamp(2rem,4.2vw,3.65rem)] leading-[0.92] tracking-hero text-foreground">
                  {row.title}
                </p>
              </div>
            ))}
          </div>

          <div data-reveal-heading className="lg:pt-4">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Research intent
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-display text-foreground sm:text-5xl">
              {content.intro.title}
            </h2>
            <p className="measure-wide mt-6 max-w-xl text-lg leading-relaxed text-foreground/76">
              {content.intro.description}
            </p>
          </div>
        </div>
      </section>

      <section data-reveal-group className="py-8">
        <div data-reveal-heading className="mb-10">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Method blocks
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
            The methodology combines four evidence-building stages
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {content.sections.map((section) => (
            <article
              key={section.name}
              data-reveal-item
              className="editorial-outline flex h-full flex-col overflow-hidden p-0"
            >
              <div
                className={`${section.accent} relative flex min-h-[18rem] flex-1 overflow-hidden px-6 py-6 text-primary-foreground sm:min-h-[20rem] sm:px-7 sm:py-7`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_56%)]" />
                <div className="relative z-10 flex w-full flex-col">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-white/82">
                    {section.role}
                  </p>
                  <div className="method-block-title mt-5 sm:mt-6">
                    {section.name.split(" ").map((part) => (
                      <p
                        key={`${section.name}-${part}`}
                        className="method-block-title-word font-display tracking-display text-white"
                      >
                        {part}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Paper-backed summary
                </p>
                <p className="measure-wide mt-4 text-base leading-relaxed text-foreground/78">
                  {section.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section data-reveal-group className="py-14">
        <div
          data-reveal-heading
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Techniques and signals
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
              Methods used across the verification stack
            </h2>
          </div>
          <p className="measure-wide max-w-xl text-base leading-relaxed text-foreground/70">
            The interface stays editorial, but the labels now track the actual models,
            scoring logic, and indoor reasoning described in the manuscript.
          </p>
        </div>

        <div className="editorial-dark-band px-6 py-8 sm:px-8">
          <div className="flex flex-wrap gap-3">
            {content.methods.map((method) => (
              <span
                key={method}
                data-reveal-item
                className="dark-surface-chip px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em]"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-group className="py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div data-reveal-heading className="editorial-outline px-7 py-8 sm:px-8">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Evaluation and governance
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
              {content.evaluation.title}
            </h2>
            <p className="measure-wide mt-6 text-base leading-relaxed text-foreground/76">
              {content.evaluation.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.evaluation.bullets.map((item) => (
              <div key={item} data-reveal-item className="editorial-note bg-white/84">
                <p className="measure-wide text-base leading-relaxed text-foreground/78">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
