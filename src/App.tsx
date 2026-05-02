import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppAssistant from './components/WhatsAppAssistant';
import Home from './pages/Home';
import Services from './pages/Services';
import Laptops from './pages/Laptops';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './server/lib/middleware/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-slate-50 font-sans text-brand-dark selection:bg-brand-accent selection:text-brand-dark">
          <Navbar />
          <main className="min-h-[calc(100vh-80px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/laptops" element={<Laptops />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <WhatsAppAssistant />
      </Router>
    </AuthProvider>
  );
}
