import { useState } from 'react';

function SearchInput(props: { placeholder: string }) {
    const [input, setInput] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    console.log(`Search input changed: ${e.target.value}`);
  }

  return (
      <input
          type="text"
          placeholder={props.placeholder}
          value={input}
          onChange={handleChange} />
  )
}

export default SearchInput