import { Routes, Route } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import UserDetailsPage from './pages/UserDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailsPage />} />
    </Routes>
  )
}

export default App