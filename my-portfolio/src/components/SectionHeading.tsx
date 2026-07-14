type SectionHeadingProps = {
  eyebrow: string;
  title: string;
};

export default function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="mb-10">
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-700">
        {eyebrow}
      </p>
      <h2 className="font-heading text-3xl font-semibold text-slate-900 sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
