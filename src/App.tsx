import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { blink } from './blink/client'
import { HomePage } from './pages/HomePage'
import { MergePDF } from './pages/MergePDF'
import { SplitPDF } from './pages/SplitPDF'
import { CompressPDF } from './pages/CompressPDF'
import { PDFToWord } from './pages/PDFToWord'
import { WatermarkPDF } from './pages/WatermarkPDF'
import { Dashboard } from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Pricing from './pages/Pricing'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading iLovePDF...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/merge" element={<MergePDF user={user} />} />
        <Route path="/split" element={<SplitPDF user={user} />} />
        <Route path="/compress" element={<CompressPDF user={user} />} />
        <Route path="/pdf-to-word" element={<PDFToWord user={user} />} />
        <Route path="/watermark" element={<WatermarkPDF user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </Router>
  )
}

export default App