import Link from "next/link";

const base =
  "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-gold-sm hover:shadow-gold",
  secondary:
    "border border-ink/15 text-ink hover:border-gold-500/50 hover:text-gold-400",
  ghost: "text-ink-muted hover:text-gold-400",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}