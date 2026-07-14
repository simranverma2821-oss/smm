import { ArrowRight, Download } from "lucide-react";
import { personal } from "@/data/portfolio";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-accent-50 via-white to-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start px-6 py-28 md:py-36">
        <Reveal>
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent-700">
            Hi, I&apos;m
          </p>
        </Reveal>
        <Reveal delayMs={80}>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            {personal.name}
          </h1>
        </Reveal>
        <Reveal delayMs={160}>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 sm:text-xl">
            {personal.tagline}
          </p>
        </Reveal>
        <Reveal delayMs={240}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-700"
            >
              Get in Touch
              <ArrowRight size={16} />
            </a>
            <a
              href={personal.resumeHref}
              download
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-accent-600 hover:text-accent-700"
            >
              Download Resume
              <Download size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
