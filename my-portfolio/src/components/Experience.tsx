import { Briefcase } from "lucide-react";
import { experience } from "@/data/portfolio";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="Experience" title="Where I've worked" />
      </Reveal>

      <div className="relative border-l border-slate-200 pl-8">
        {experience.map((entry, index) => (
          <Reveal key={entry.role} delayMs={index * 100}>
            <div className="relative pb-12 last:pb-0">
              <span className="absolute -left-[2.35rem] flex h-8 w-8 items-center justify-center rounded-full bg-accent-600 text-white ring-4 ring-white">
                <Briefcase size={14} />
              </span>
              <p className="text-sm font-medium text-accent-700">{entry.period}</p>
              <h3 className="mt-1 font-heading text-xl font-semibold text-slate-900">
                {entry.role}
              </h3>
              <p className="text-sm font-medium text-slate-500">{entry.organization}</p>
              <ul className="mt-3 space-y-1.5 text-slate-600">
                {entry.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
