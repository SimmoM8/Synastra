import { useState } from 'react'
import UserNode from '../components/UserNode'
import SearchInput from '../components/SearchInput'
import useUsers from '../hooks/useUsers'

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: users = [],
    isLoading,
    isError,
    error
  } = useUsers()

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase()

    return (
      user.profile.name.toLowerCase().includes(search) ||
      user.username.toLowerCase().includes(search) ||
      user.profile.address.city.toLowerCase().includes(search)
    )
  })

  if (isLoading) {
    return <p>Mapping constellation...</p>
  }

  if (isError) {
    return <p>Signal lost: {error.message}</p>
  }

  return (
    <>
      <h1>Synastra</h1>
      <p>Users as light nodes in a connected network</p>

      <SearchInput
        placeholder="Search the constellation..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {users.length === 0 ? (
        <p>No users detected.</p>
      ) : filteredUsers.length === 0 ? (
        <p>No matching users found.</p>
      ) : (
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id}>
              <UserNode
                id={user.id}
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

export default UsersPage