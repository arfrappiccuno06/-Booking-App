// main app component that sets up routing and global providers
// this wraps the entire application with booking context and router

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BookingProvider } from './context/BookingContext';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    // booking provider gives all components access to booking data
    <BookingProvider>
      {/* router handles navigation between home and admin pages */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>

      {/* toast notifications for success/error messages */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(255, 182, 193, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#f0559d',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BookingProvider>
  );
}

export default App;
