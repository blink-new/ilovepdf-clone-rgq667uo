import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { MergePDF } from './pages/MergePDF'
import { SplitPDF } from './pages/SplitPDF'
import { CompressPDF } from './pages/CompressPDF'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/merge" element={<MergePDF />} />
        <Route path="/split" element={<SplitPDF />} />
        <Route path="/compress" element={<CompressPDF />} />
        {/* Add more routes as we build more tools */}
      </Routes>
    </Router>
  )
}

export default App