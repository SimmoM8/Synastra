import { Link, useParams } from 'react-router-dom'
import useUsers from '../hooks/useUsers'

function UserDetailsPage() {
  const { id } = useParams()
  const {
    data: users = [],
    isLoading,
    isError,
    error
  } = useUsers()

  if (isLoading) {
    return <p>Locating light node...</p>
  }

  if (isError) {
    return <p>Signal lost: {error.message}</p>
  }

  const user = users.find(user => user.id === Number(id))

  if (!user) {
    return <p>Light node not found.</p>
  }

  return (
    <>
      <Link to="/">← Back to constellation</Link>

      <h1>{user.profile.name}</h1>
      <p>@{user.username}</p>

      <h2>Location</h2>
      <p>{user.profile.address.street}</p>
      <p>
        {user.profile.address.zipCode} {user.profile.address.city}
      </p>

      <h2>Contact</h2>
      <p>{user.profile.email}</p>

      <h2>Roles</h2>
      <p>{user.roles.join(', ')}</p>

      <h2>Settings</h2>
      <p>Theme: {user.settings.theme}</p>
      <p>
        Email notifications:
        {user.settings.notifications.email ? ' enabled' : ' disabled'}
      </p>
      <p>
        Push notifications:
        {user.settings.notifications.push ? ' enabled' : ' disabled'}
      </p>
    </>
  )
}

export default UserDetailsPage