import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Root from './components/root'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="/user/dashboard" element={<h1>User Dashboard</h1>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>

  )
}

export default App