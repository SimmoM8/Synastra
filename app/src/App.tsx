import { Navigate, Route, Routes } from 'react-router-dom'
import UsersPage from './pages/UsersPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="/users/:id" element={<UsersPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App