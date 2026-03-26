// admin page - password protected dashboard for managing availability
// allows admin to set time slots and view/delete all bookings

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from '../components/Calendar';
import AvailabilityModal from '../components/AvailabilityModal';
import { useBooking } from '../context/BookingContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Admin = () => {
  // authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // bookings list visibility
  const [showAllBookings, setShowAllBookings] = useState(false);

  const navigate = useNavigate();
  const { bookings, deleteBooking } = useBooking();

  // admin password from environment variable
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  // check if admin is already authenticated in this session
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  // handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      toast.success('Welcome, Admin! ✨');
    } else {
      toast.error('Incorrect password');
    }
  };

  // handle logout - clear session and go home
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    navigate('/');
  };

  // open availability modal when admin clicks a day
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // close availability modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // delete a booking with confirmation
  const handleDeleteBooking = async (bookingId, clientName) => {
    if (window.confirm(`Delete booking for ${clientName}?`)) {
      const result = await deleteBooking(bookingId);
      if (result.success) {
        toast.success('Booking deleted successfully');
      } else {
        toast.error('Failed to delete booking');
      }
    }
  };

  // show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-super shadow-hover max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-3xl font-bold text-pink-600 mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600">
              Enter the secret code to continue
            </p>
          </div>

          {/* login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-pink-600 mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-bubble border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-bubble hover:from-pink-500 hover:to-pink-600 transition-all transform hover:scale-105 shadow-soft"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-3 text-pink-600 hover:bg-pink-50 rounded-bubble transition-colors"
            >
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // convert bookings object to sorted array
  const allBookings = Object.entries(bookings).map(([id, booking]) => ({
    id,
    ...booking,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // admin dashboard - shown after successful login
  return (
    <div className="min-h-screen py-4 px-4">
      {/* header with logout button */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-5xl font-bold text-pink-600" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white' }}>
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-white hover:bg-pink-100 transition-colors shadow-soft"
            title="Logout"
          >
            <LogOut className="w-6 h-6 text-pink-500" />
          </button>
        </div>
        <p className="text-white text-lg font-semibold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          Click on any day to edit your availability
        </p>
      </div>

      {/* calendar in admin mode - all days are clickable */}
      <Calendar onDayClick={handleDayClick} isAdmin={true} />

      {/* availability modal for editing time slots */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />

      {/* all bookings list section */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-super shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              All Bookings ({allBookings.length})
            </h2>
            <button
              onClick={() => setShowAllBookings(!showAllBookings)}
              className="px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-bubble transition-colors"
            >
              {showAllBookings ? 'Hide' : 'Show'} All
            </button>
          </div>

          {/* bookings list - only shown when toggled */}
          {showAllBookings && (
            <div className="space-y-3">
              {allBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bookings yet
                </div>
              ) : (
                allBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-pastel-pink rounded-bubble hover:shadow-soft transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {booking.clientName}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                        <span>
                          {format(new Date(booking.date), 'EEEE, MMM d, yyyy')}
                        </span>
                        <span className="text-pink-600 font-semibold">
                          {booking.time}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBooking(booking.id, booking.clientName)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                      title="Delete booking"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
