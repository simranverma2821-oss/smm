import { Award, GraduationCap } from "lucide-react";
import { certifications, education } from "@/data/portfolio";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Certifications() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div id="certifications">
            <Reveal>
              <SectionHeading eyebrow="Certifications" title="Courses & training" />
            </Reveal>
            <ul className="space-y-3">
              {certifications.map((cert, index) => (
                <Reveal key={cert} delayMs={index * 60}>
                  <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <Award size={18} className="flex-shrink-0 text-accent-600" />
                    <span className="text-sm font-medium text-slate-800 sm:text-base">
                      {cert}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div id="education">
            <Reveal>
              <SectionHeading eyebrow="Education" title="Academic background" />
            </Reveal>
            <ul className="space-y-3">
              {education.map((entry, index) => (
                <Reveal key={entry.degree} delayMs={index * 60}>
                  <li className="flex gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4">
                    <GraduationCap size={18} className="mt-0.5 flex-shrink-0 text-accent-600" />
                    <div>
                      <p className="font-heading text-base font-semibold text-slate-900">
                        {entry.degree}
                      </p>
                      <p className="text-sm text-slate-600">{entry.institution}</p>
                      <p className="text-sm text-slate-500">{entry.period}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
