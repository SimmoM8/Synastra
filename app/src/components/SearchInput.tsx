interface SearchInputProps {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SearchInput({
  placeholder,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <label className="relative block">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-slate-500"
      >
        <circle cx="11" cy="11" r="6" strokeWidth="1.5" />
        <path d="m16 16 4 4" strokeWidth="1.5" />
      </svg>

      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-full border border-white/10 bg-slate-900/45 py-3 pl-11 pr-5 text-sm font-light tracking-wide text-slate-200 outline-none backdrop-blur-xl transition placeholder:text-slate-600 hover:border-white/15 focus:border-violet-300/30 focus:bg-slate-900/70 focus:ring-2 focus:ring-violet-400/5"
      />
    </label>
  )
}

export default SearchInput