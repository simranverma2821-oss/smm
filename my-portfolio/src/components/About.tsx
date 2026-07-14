import { personal } from "@/data/portfolio";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="About" title="A bit about me" />
      </Reveal>
      <Reveal delayMs={80}>
        <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
          {personal.bio}
        </p>
      </Reveal>
      <Reveal delayMs={160}>
        <div className="mt-8 flex flex-wrap gap-3">
          {["Quick Learner", "Detail-Oriented", "Strong Communicator"].map((trait) => (
            <span
              key={trait}
              className="rounded-full bg-accent-50 px-4 py-1.5 text-sm font-medium text-accent-800"
            >
              {trait}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
