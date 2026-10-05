function SearchInput(props: { placeholder: string }) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Search input changed: ${e.target.value}`);
  }

  return (
      <input
          type="text"
          placeholder={props.placeholder}
          onChange={handleChange} />
  )
}

export default SearchInput