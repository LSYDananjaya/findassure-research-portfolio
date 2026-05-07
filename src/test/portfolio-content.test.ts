import { describe, expect, it } from "vitest";
import { portfolioContent } from "@/content/portfolioContent";
import fs from "node:fs";
import path from "node:path";

describe("portfolio content", () => {
  it("keeps research-backed narrative across overview, system, and research pages", () => {
    expect(portfolioContent.home.hero.description).toContain(
      "progressive evidence refinement"
    );
    expect(portfolioContent.work.hero.description).toContain(
      "confidence-aware location reasoning"
    );
    expect(portfolioContent.about.hero.description).toContain(
      "medium-sized institutional environments"
    );
  });

  it("removes placeholder team member naming from the team page", () => {
    const memberNames = portfolioContent.team.members.map((member) => member.name);

    expect(memberNames).not.toContain("Member One");
    expect(memberNames).not.toContain("Member Two");
    expect(memberNames).not.toContain("Member Three");
    expect(memberNames).not.toContain("Member Four");
  });

  it("captures the research contribution and governance themes from the paper", () => {
    expect(portfolioContent.home.contributions).toHaveLength(4);
    expect(
      portfolioContent.about.sections.some((section) =>
        section.title.includes("Privacy") || section.title.includes("Governance")
      )
    ).toBe(true);
    expect(
      portfolioContent.work.modules.some((module) => module.title === "Fraud monitoring")
    ).toBe(true);
  });

  it("uses /team consistently for routing and internal portfolio links", () => {
    const root = path.resolve(__dirname, "..");
    const appSource = fs.readFileSync(path.join(root, "App.tsx"), "utf8");
    const navSource = fs.readFileSync(
      path.join(root, "components", "Navigation.tsx"),
      "utf8"
    );
    const indexSource = fs.readFileSync(path.join(root, "pages", "Index.tsx"), "utf8");

    expect(portfolioContent.home.featureCards.some((card) => card.to === "/team")).toBe(true);
    expect(appSource).toContain('path="/team"');
    expect(appSource).not.toContain('path="/contact"');
    expect(navSource).toContain('path: "/team"');
    expect(navSource).not.toContain('path: "/contact"');
    expect(indexSource).toContain('to="/team"');
    expect(indexSource).not.toContain('to="/contact"');
  });

  it("keeps the team page focused on four member profiles without unrelated page CTAs", () => {
    const root = path.resolve(__dirname, "..");
    const teamSource = fs.readFileSync(path.join(root, "pages", "Team.tsx"), "utf8");

    expect(portfolioContent.team.members).toHaveLength(4);
    expect(teamSource).not.toContain("System map");
    expect(teamSource).not.toContain("Research flow");
    expect(teamSource).not.toContain("Architecture");
    expect(teamSource).not.toContain("Methodology");
  });

  it("defines structured team profile data with owned components and contact channels", () => {
    portfolioContent.team.members.forEach((member) => {
      expect(member.components.length).toBeGreaterThan(0);
      expect(member.contacts.email).toBeDefined();
      expect(member.contacts.github).toBeDefined();
      expect(member.contacts.linkedin).toBeDefined();
      expect(member.contacts.portfolio).toBeDefined();
    });
  });

  it("uses full-screen stripe-based mobile navigation with dedicated transition helpers", () => {
    const root = path.resolve(__dirname, "..");
    const navSource = fs.readFileSync(
      path.join(root, "components", "Navigation.tsx"),
      "utf8"
    );

    expect(navSource).toContain("playMobileTransition");
    expect(navSource).toContain("playMobileReveal");
    expect(navSource).toContain("handleMobileNavigation");
    expect(navSource).toContain("mobileNavRef");
    expect(navSource).toContain("data-mobile-menu-shell");
    expect(navSource).not.toContain("min-h-[108px]");
    expect(navSource).not.toContain("mobile-nav-active");
  });

  it("keeps mobile navigation stripes rectangular and removes status-copy labels", () => {
    const root = path.resolve(__dirname, "..");
    const navSource = fs.readFileSync(
      path.join(root, "components", "Navigation.tsx"),
      "utf8"
    );
    const cssSource = fs.readFileSync(path.join(root, "index.css"), "utf8");

    expect(navSource).not.toContain("Current page");
    expect(navSource).not.toContain("Open page");
    expect(cssSource).not.toContain("border-radius: 28px");
    expect(cssSource).toContain(".mobile-nav-stripe");
  });

  it("renders desktop navbar indices horizontally without parentheses", () => {
    const root = path.resolve(__dirname, "..");
    const navSource = fs.readFileSync(
      path.join(root, "components", "Navigation.tsx"),
      "utf8"
    );

    expect(navSource).not.toContain("({item.index})");
    expect(navSource).toContain("{item.index}");
    expect(navSource).toContain("data-nav-index");
    expect(navSource).toContain("data-nav-overlay-index");
  });
});
