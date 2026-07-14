import { personal } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {personal.name}. All rights reserved.
        </p>
        <a href={`mailto:${personal.email}`} className="hover:text-accent-700">
          {personal.email}
        </a>
      </div>
    </footer>
  );
}
