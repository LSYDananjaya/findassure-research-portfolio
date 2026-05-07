import { useRef } from "react";
import { createTimeline, splitText, stagger } from "animejs";
import { Github, Globe, Linkedin, Mail } from "lucide-react";
import useAnimeScope from "@/hooks/useAnimeScope";
import { prepareReveal, setupRevealGroups } from "@/lib/animeReveal";
import { portfolioContent } from "@/content/portfolioContent";

const Team = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const content = portfolioContent.team;

  useAnimeScope(
    pageRef,
    (self, { reducedMotion }) => {
      const root = (self as { root: HTMLElement }).root;
      const title = root.querySelector<HTMLElement>("[data-page-title]");
      const heroPanel = root.querySelector<HTMLElement>("[data-page-hero]");
      const summary = root.querySelector<HTMLElement>("[data-page-summary]");

      setupRevealGroups(root);

      const split = title
        ? splitText(title, {
            lines: { wrap: "clip" },
          })
        : null;

      const titleLines = split?.lines ? Array.from(split.lines) : [];
      const introPanels = [heroPanel, summary].filter(
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

      prepareReveal(introPanels, { y: 28, scale: 0.985, blur: 10 });

      createTimeline()
        .add(introPanels, {
          opacity: [0, 1],
          translateY: [28, 0],
          scale: [0.985, 1],
          filter: ["blur(10px)", "blur(0px)"],
          duration: 540,
          ease: "out(4)",
          delay: stagger(120),
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
          180
        );

      return () => {
        split?.revert();
      };
    },
    []
  );

  const contactItems = [
    {
      key: "email",
      label: "Gmail",
      icon: Mail,
      getHref: (value: string) => (value ? `mailto:${value}` : undefined),
    },
    {
      key: "github",
      label: "GitHub",
      icon: Github,
      getHref: (value: string) => value || undefined,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      getHref: (value: string) => value || undefined,
    },
    {
      key: "portfolio",
      label: "Portfolio",
      icon: Globe,
      getHref: (value: string) => value || undefined,
    },
  ] as const;

  return (
    <div ref={pageRef} className="px-6 pb-24 pt-32 font-body sm:px-12 lg:px-16">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <div data-page-hero className="editorial-outline px-7 py-10 sm:px-10 sm:py-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {content.hero.kicker}
          </p>
          <h1
            data-page-title
            className="mt-4 break-words font-hero text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.9] tracking-hero text-foreground pr-2 sm:pr-4"
          >
            {content.hero.title[0]}
            <br />
            {content.hero.title[1]}
            <br />
            {content.hero.title[2]}
          </h1>

          <p className="measure-wide mt-8 max-w-2xl text-lg leading-relaxed text-foreground/76">
            {content.hero.description}
          </p>
        </div>

        <div data-page-summary className="editorial-frame px-7 py-10 sm:px-10 sm:py-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Team overview
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
            {content.summary.title}
          </h2>
          <p className="measure-wide mt-6 max-w-xl text-base leading-relaxed text-foreground/74">
            {content.summary.description}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.relatedInfo.map((item) => (
              <div key={item.label} className="editorial-note bg-white/84">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-2xl tracking-display text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-group className="py-14">
        <div data-reveal-heading className="mb-10">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Team members
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-display text-foreground sm:text-5xl">
            Four project-member profiles and their primary responsibilities
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {content.members.map((member) => (
            <article
              key={member.name}
              data-reveal-item
              className="editorial-frame flex flex-col p-6 sm:p-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="team-avatar-shell relative flex h-24 w-24 flex-shrink-0 items-end overflow-hidden rounded-[24px] p-4 sm:h-28 sm:w-28">
                  {/* @ts-expect-error image is optional/inferred */}
                  {member.image ? (
                    <img
                      // @ts-expect-error image is optional/inferred
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div
                        className={`absolute inset-x-0 bottom-0 h-2/5 rounded-b-[24px] ${member.accent} opacity-88`}
                      />
                      <div className="team-avatar-badge relative z-10 flex h-10 w-10 items-center justify-center text-xs font-semibold uppercase tracking-[0.16em] sm:h-12 sm:w-12 sm:text-sm">
                        {member.initials}
                      </div>
                    </>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {member.role}
                  </p>
                  <h3 className="mt-3 font-display text-3xl tracking-display text-foreground">
                    {member.name}
                  </h3>
                  <p className="measure-wide mt-3 text-base leading-relaxed text-foreground/76">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-1 flex-col gap-6 border-t border-foreground/10 pt-6">
                <div>
                  <p className="font-body text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Key responsibilities
                  </p>
                  <p className="measure-wide mt-2.5 text-[0.95rem] leading-relaxed text-foreground">
                    {member.contribution}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="font-body text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Components worked on
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {member.components.map((component) => (
                      <span key={component} className="profile-chip">
                        {component}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto grid gap-6">
                  <div>
                    <p className="font-body text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Contact channels
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {contactItems.map((item) => {
                        const value = member.contacts[item.key];
                        const href = item.getHref(value);
                        const Icon = item.icon;

                        return (
                          <a
                            key={item.key}
                            className={`profile-contact ${href ? "" : "profile-contact-muted"}`}
                            href={href}
                            target={href && item.key !== "email" ? "_blank" : undefined}
                            rel={href && item.key !== "email" ? "noreferrer" : undefined}
                            aria-disabled={!href}
                            title={value || `No ${item.label} provided`}
                          >
                            <span className="profile-contact-icon">
                              <Icon size={14} strokeWidth={2.5} />
                            </span>
                            <span className="font-body text-[0.72rem] font-bold uppercase tracking-[0.16em] text-foreground">
                              {item.label}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;
