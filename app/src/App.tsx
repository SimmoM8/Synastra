import UserNode from './components/UserNode'
import SearchInput from './components/SearchInput'
import { useEffect, useState } from 'react'

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(
      'https://api-userapi.onrender.com/api/users/getUsers',
      {
        headers: {
            'x-api-key': 'elev-hemlighet-2026'
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  return (
    <>
      <h1>Synastra</h1>
      <p>Users as light nodes in a connected network</p>

      <SearchInput
        placeholder="Search the constellation..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)} />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
          <ul>
            {users.map(user =>
              <li>
                <UserNode
                  name={user.profile.name}
                  username={user.username}
                  city={user.profile.address.city} />
              </li>
            )}
          </ul>
      )}
    </>
  )
}

export default App
