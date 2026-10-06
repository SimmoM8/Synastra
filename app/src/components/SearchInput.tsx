function SearchInput(props: { placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e);
    console.log(`Search input changed: ${e.target.value}`);
  }

  return (
      <input
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={handleChange} />
  )
}

export default SearchInput