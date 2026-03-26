// booking modal - popup where clients create bookings
// shows available time slots and allows clients to cancel their bookings

import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import toast from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, selectedDate }) => {
  // form state
  const [clientName, setClientName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // toggle to show/hide client's existing bookings
  const [showMyBookings, setShowMyBookings] = useState(false);

  const { getAvailableSlots, createBooking, getBookingsForDate, deleteBooking } = useBooking();

  // don't render if modal is closed or no date selected
  if (!isOpen || !selectedDate) return null;

  const availableSlots = getAvailableSlots(selectedDate);
  const allBookings = getBookingsForDate(selectedDate);

  // handle booking form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate name input
    if (!clientName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    // validate time slot selection
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    setIsSubmitting(true);

    // create booking in firebase
    const result = await createBooking(selectedDate, selectedTime, clientName.trim());

    if (result.success) {
      toast.success('Booking confirmed! See you soon! ✨', {
        duration: 4000,
        icon: '🎉',
      });
      // reset form and close modal
      setClientName('');
      setSelectedTime('');
      setShowMyBookings(false);
      onClose();
    } else {
      toast.error('Booking failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  // handle client canceling their own booking
  const handleCancelBooking = async (bookingId, clientNameFromBooking) => {
    if (window.confirm(`Cancel your booking at ${allBookings.find(b => b.id === bookingId)?.time}?`)) {
      const result = await deleteBooking(bookingId);
      if (result.success) {
        toast.success('Booking cancelled successfully');
      } else {
        toast.error('Failed to cancel booking');
      }
    }
  };

  // find bookings that match the entered client name
  const myBookings = allBookings.filter(
    (booking) => booking.clientName.toLowerCase() === clientName.trim().toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-super shadow-hover max-w-md w-full p-8 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 transition-colors"
        >
          <X className="w-5 h-5 text-pink-500" />
        </button>

        {/* title showing selected date */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">
            Book Your Session
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
        </div>

        {/* booking form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* name input field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-pink-600 mb-2">
              <User className="w-4 h-4" />
              Your Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setShowMyBookings(false);
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-bubble border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* notification if client has existing bookings */}
          {clientName.trim() && myBookings.length > 0 && !showMyBookings && (
            <div className="bg-blue-50 p-4 rounded-bubble">
              <p className="text-sm text-blue-700 mb-2">
                Found {myBookings.length} existing booking{myBookings.length > 1 ? 's' : ''} for this name on this day!
              </p>
              <button
                type="button"
                onClick={() => setShowMyBookings(true)}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                View & manage your bookings
              </button>
            </div>
          )}

          {/* list of client's existing bookings with cancel option */}
          {showMyBookings && myBookings.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-bubble space-y-2">
              <h3 className="text-sm font-semibold text-blue-600 mb-3">Your Bookings:</h3>
              {myBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between bg-white p-3 rounded-bubble"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span className="font-semibold text-gray-700">{booking.time}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(booking.id, booking.clientName)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-bubble hover:bg-red-200 transition-colors flex items-center gap-1 text-sm font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setShowMyBookings(false)}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                ← Back to booking
              </button>
            </div>
          )}

          {/* time slot selection grid */}
          {!showMyBookings && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-pink-600 mb-2">
                <Clock className="w-4 h-4" />
                Select Time Slot
              </label>

              {availableSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No available time slots for this day
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`
                        py-3 px-4 rounded-bubble font-semibold transition-all
                        ${
                          selectedTime === slot
                            ? 'bg-pink-500 text-white shadow-soft'
                            : 'bg-pastel-pink text-pink-600 hover:bg-pink-200'
                        }
                      `}
                      disabled={isSubmitting}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* submit button */}
          {availableSlots.length > 0 && !showMyBookings && (
            <button
              type="submit"
              disabled={isSubmitting || !clientName.trim() || !selectedTime}
              className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-bubble hover:from-pink-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-soft"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking ✨'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
