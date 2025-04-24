import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import './index.css'
import Root from './components/root'
import Login from './pages/Login'
import ProyectedRoutes from './utils/ProtectedRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin/dashboard" element={<protectedRooute requireRole={['admin']}><h1>Admin Dashboard</h1></protectedRooute>} />
        <Route path="/user/dashboard" element={<h1>User Dashboard</h1>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/unauthorized" element={<h1 className='font -bold text -3xl mt-20 ml-20'>Unauthorized</h1>} />

      </Routes>
    </Router>

  )
}

export default App;