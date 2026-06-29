export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-tight text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-ink-muted">{subtitle}</p>
      )}
    </div>
  );
}