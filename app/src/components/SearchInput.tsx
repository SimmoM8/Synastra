interface SearchInputProps {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SearchInput(props: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e)
  }

  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={handleChange}
    />
  )
}

export default SearchInput