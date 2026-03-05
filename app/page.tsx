import { Section } from "@/components/section";
import { InlineLinkItem } from "@/components/inline-link-item";

export default function Home() {
  const currentItems: string[] = [];

  const buildingItems = [
    "Robots to Annoy My Roommates",
  ];

  const nowItems = [
    "Learning @ Watonomous",
    "Getting Ready for Intramural Playoffs",
    "Frolicking in the Spring Breeze",
  ];

  return (
    <>
      <Section label="Currently">
        <ul className="space-y-1 text-xs">
          <InlineLinkItem
            prefix="Engineering @"
            name="UWaterloo"
            logoSrc="/Waterloo.png"
            url="https://uwaterloo.ca/mechanical-mechatronics-engineering/"
          />
          <InlineLinkItem
            prefix="Research @"
            name="MiON Forest"
            logoSrc="/Mion.png"
            url="https://mionscience.odoo.com/forest"
          />
          {currentItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section label="Building">
        <ul className="space-y-1 text-xs">
          <InlineLinkItem
            prefix="Communities @"
            name="GrassrootsKW"
            logoSrc="/Grassroots.png"
            url="https://grassrootskw.org"
          />
          <InlineLinkItem
            prefix="Wind Turbines @"
            name="Waturbine"
            logoSrc="/Waturbine.png"
            url="https://waturbine.ca/"
          />
          {buildingItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section label="Previously">
        <ul className="space-y-1 text-xs">
          <InlineLinkItem
            prefix="Engineering @"
            name="Checklick"
            logoSrc="/Checklick.png"
            url="https://www.linkedin.com/company/checklick/"
          />
          <InlineLinkItem
            prefix="Environment @"
            name="City of Markham"
            logoSrc="/Markham.png"
            url="https://www.markham.ca"
          />
        </ul></Section>

      <Section label="Now">
        <ul className="space-y-1 text-xs text-[var(--color-muted)]">
          {nowItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <footer className="pt-4 font-mono text-[10px] font-light text-[var(--color-muted)]">
        <div className="mb-5 h-px w-full bg-white/10" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href="https://github.com/jasonkdeng"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jasondeng625"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <span>jason.deng[at]uwaterloo.ca</span>
        </div>
      </footer>
    </>
  );
}
