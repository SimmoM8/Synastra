import { useState } from 'react'
import UserNode from './components/UserNode'
import SearchInput from './components/SearchInput'
import useUsers from './hooks/useUsers'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const { users, loading } = useUsers()

  return (
    <>
      <h1>Synastra</h1>
      <p>Users as light nodes in a connected network</p>

      <SearchInput
        placeholder="Search the constellation..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Mapping constellation...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <UserNode
                name={user.profile.name}
                username={user.username}
                city={user.profile.address.city}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default App