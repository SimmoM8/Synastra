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
  <main className="min-h-screen bg-slate-950 text-slate-100">
    <div className="mx-auto max-w-6xl px-6 py-16">

      <header className="mb-12">
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-violet-400">
          The Constellation
        </p>

        <h1 className="text-5xl font-light tracking-tight">
          Synastra
        </h1>

        <p className="mt-4 max-w-xl text-slate-400">
          People become points of light in a connected network.
        </p>
      </header>

      <SearchInput
        placeholder="Search the constellation..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {users.length === 0 ? (
        <p>No lights detected.</p>
      ) : filteredUsers.length === 0 ? (
        <p>No matching lights found.</p>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

    </div>
  </main>
)
}

export default UsersPage