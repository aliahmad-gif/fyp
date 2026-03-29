import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminRole from './pages/AdminRole'
import { CartProvider } from './components/CartContext'
import './index.css'

function LandingWithNav() {
  const navigate = useNavigate()
  return (
    <LandingPage
      onNavigateToSignUp={() => {}}
      onNavigateToLogin={() => {}}
      onNavigateToCart={() => {}}
      onNavigateToProfile={() => navigate('/profile')}
      onNavigateToDiscovery={() => {}}
      onNavigateToMeasurement={() => {}}
      onNavigateToProduct={() => {}}
    />
  )
}

function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <div className="shrink-0 bg-[#f9fafb] px-4 py-2 border-b border-[#e5e7eb]">
        <Link to="/" className="text-[#023337] font-semibold hover:underline">← Back to Home</Link>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <AdminRole />
      </div>
    </div>
  )
}

const App = () => (
    <CartProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LandingWithNav />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    </CartProvider>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
