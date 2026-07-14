import { Mail, Phone } from "lucide-react";
import { personal } from "@/data/portfolio";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <SectionHeading eyebrow="Contact" title="Let's work together" />
      </Reveal>

      <div className="grid gap-12 md:grid-cols-5">
        <Reveal className="md:col-span-2" delayMs={80}>
          <p className="text-slate-600">
            Have a business that needs better local visibility, or a marketing project in
            mind? Reach out — I&apos;d love to hear about it.
          </p>
          <div className="mt-6 space-y-3">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-3 text-sm font-medium text-slate-800 hover:text-accent-700"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                <Mail size={18} />
              </span>
              {personal.email}
            </a>
            {personal.phone && (
              <a
                href={`tel:${personal.phone}`}
                className="flex items-center gap-3 text-sm font-medium text-slate-800 hover:text-accent-700"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                  <Phone size={18} />
                </span>
                {personal.phone}
              </a>
            )}
          </div>
        </Reveal>

        <Reveal className="md:col-span-3" delayMs={160}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
