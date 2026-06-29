export default function FormInput({
  label,
  labelAction,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  ...props
}) {
  return (
    <div>
      {(label || labelAction) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-medium text-ink-muted"
            >
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-navy-800/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-gold-500/50 ${
          error ? "border-red-500/50" : "border-white/10"
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Checkbox({ name, checked, onChange, label, error }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-white/20 bg-navy-800 accent-gold-500"
        />
        <span className="text-sm leading-relaxed text-ink-muted">
          {label}
        </span>
      </label>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}