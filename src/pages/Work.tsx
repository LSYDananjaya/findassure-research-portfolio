import { useRef } from "react";
import { createTimeline, splitText, stagger } from "animejs";
import AnimatedWorkflowFlow from "@/components/AnimatedWorkflowFlow";
import useAnimeScope from "@/hooks/useAnimeScope";
import { prepareReveal, setupRevealGroups } from "@/lib/animeReveal";
import { portfolioContent } from "@/content/portfolioContent";

const Work = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const content = portfolioContent.work;

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
        <div data-reveal-heading className="mb-10">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Stack layers
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
            The architecture separates experience, orchestration, and intelligence
          </h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {content.stageColumns.map((column) => (
            <article key={column.title} data-reveal-item className="editorial-outline p-6 sm:p-7">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h3 className="font-display text-4xl tracking-display text-foreground">
                  {column.title}
                </h3>
                <span className={`${column.color} h-4 w-20 rounded-full opacity-90`} />
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

      <section data-reveal-group className="py-8">
        <div
          data-reveal-heading
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Core modules
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
              Distinct services support retrieval, verification, and governance
            </h2>
          </div>
          <p className="measure-wide max-w-xl text-base leading-relaxed text-foreground/70">
            The page now maps directly to the paper’s subsystem boundaries instead of
            flattening everything into generic feature cards.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {content.modules.map((module, index) => (
            <article key={module.title} data-reveal-item className="editorial-frame p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="editorial-disc-sm bg-accent-teal text-primary-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                      {module.layer}
                    </p>
                    <h3 className="mt-2 font-display text-3xl tracking-display text-foreground">
                      {module.title}
                    </h3>
                  </div>
                </div>
                <span className="rounded-full border border-primary/12 bg-white/74 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {module.stack}
                </span>
              </div>

              <p className="measure-wide mt-6 text-base leading-relaxed text-foreground/76">
                {module.detail}
              </p>

              <div className="mt-6 border-t border-foreground/10 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Repo footprint: {module.footprint}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section data-reveal-group className="py-14">
        <div data-reveal-heading className="mb-10">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            End-to-end flow
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
            The modules converge into a staged and reviewable claim journey
          </h2>
        </div>

        <AnimatedWorkflowFlow steps={content.workflowSteps} />
      </section>
    </div>
  );
};

export default Work;
