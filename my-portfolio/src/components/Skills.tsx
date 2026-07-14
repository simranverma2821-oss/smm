import {
  MapPin,
  Search,
  MousePointerClick,
  Globe,
  Palette,
  FileSpreadsheet,
  FileText,
  Calculator,
} from "lucide-react";
import { skills } from "@/data/portfolio";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "Google My Business": MapPin,
  SEO: Search,
  "Google Ads": MousePointerClick,
  "WordPress (Basic)": Globe,
  Canva: Palette,
  "MS Office (Word/Excel/PowerPoint)": FileSpreadsheet,
  "Google Docs/Sheets": FileText,
  "Tally (Basic)": Calculator,
};

export default function Skills() {
  return (
    <section id="skills" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading eyebrow="Skills" title="What I work with" />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {skills.map((skill, index) => {
            const Icon = icons[skill.name] ?? Search;
            return (
              <Reveal key={skill.name} delayMs={index * 60}>
                <div className="flex h-full flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-medium text-slate-800">{skill.name}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
