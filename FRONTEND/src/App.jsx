import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './index.css'
import Root from './components/root'
import Login from './pages/Login'
import ProyectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import AdminAlerts from './pages/AdminAlerts'
import AdminLayout from './pages/AdminLayout'
import AdminQuais from './pages/AdminQuais'
import AdminNavires from './pages/AdminNavires'
import AdminPredictCongestion from './pages/AdminPredictCongestion'
import AdminUtilisateurs from './pages/AdminUtilisateurs'
import AdminMarchandises from './pages/AdminMarchandises'
import AdminStockage from './pages/AdminStockage'
import AgentLayout from './pages/AgentLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin/dashboard" element={
          <ProyectedRoutes requireRole={['admin']}>
            <AdminLayout />
          </ProyectedRoutes>
        }>
          <Route index element={<Dashboard />} />
          <Route path="alerts" element={<AdminAlerts />} />
          <Route path="quais" element={<AdminQuais />} />
          <Route path="navires" element={<AdminNavires />} />
          <Route path="predict-congestion" element={<AdminPredictCongestion />} />
          <Route path="utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="marchandises" element={<AdminMarchandises />} />
          <Route path="stockage" element={<AdminStockage />} />
        </Route>
        {/* Agent routes */}
        <Route path="/user/dashboard" element={
          <ProyectedRoutes requireRole={['agent']}>
            <AgentLayout />
          </ProyectedRoutes>
        }>
          <Route index element={<Dashboard />} />
          <Route path="predict-congestion" element={<AdminPredictCongestion />} />
        </Route>
        <Route
         index
         element={<h1>Summary of dashboard</h1>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/unauthorized" element={<h1 className='font -bold text -3xl mt-20 ml-20'>Unauthorized</h1>} />
      </Routes>
    </Router>

  )
}

export default App;