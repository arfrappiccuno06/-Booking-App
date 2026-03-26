// booking context - manages all booking and availability data globally
// this provides state and functions to all components that need booking data

import { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { format } from 'date-fns';

// create context for sharing booking data across components
const BookingContext = createContext();

// custom hook to access booking context from any component
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

// provider component that wraps the app and provides booking data
export const BookingProvider = ({ children }) => {
  // state for storing all bookings from firebase
  const [bookings, setBookings] = useState({});
  // state for storing availability (what time slots are available per day)
  const [availability, setAvailability] = useState({});
  // loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // listen to bookings from firebase in real-time
  // automatically updates when bookings change in the database
  useEffect(() => {
    const bookingsRef = ref(database, 'bookings');

    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      setBookings(data || {});
      setLoading(false);
    });

    // cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // listen to availability from firebase in real-time
  // automatically updates when admin changes availability
  useEffect(() => {
    const availabilityRef = ref(database, 'availability');

    const unsubscribe = onValue(availabilityRef, (snapshot) => {
      const data = snapshot.val();
      setAvailability(data || {});
    });

    // cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // create a new booking in firebase
  // takes a date, time slot, and client name
  const createBooking = async (date, time, clientName) => {
    try {
      const bookingsRef = ref(database, 'bookings');
      const newBookingRef = push(bookingsRef);

      await set(newBookingRef, {
        date: format(date, 'yyyy-MM-dd'),
        time,
        clientName,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  };

  // delete a booking from firebase by its id
  const deleteBooking = async (bookingId) => {
    try {
      const bookingRef = ref(database, `bookings/${bookingId}`);
      await remove(bookingRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { success: false, error: error.message };
    }
  };

  // update availability for a specific date
  // admin uses this to set what time slots are available
  const updateAvailability = async (date, timeSlots) => {
    try {
      const dateKey = format(date, 'yyyy-MM-dd');
      const availabilityRef = ref(database, `availability/${dateKey}`);

      if (timeSlots && timeSlots.length > 0) {
        await set(availabilityRef, timeSlots);
      } else {
        // remove availability if no slots
        await remove(availabilityRef);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating availability:', error);
      return { success: false, error: error.message };
    }
  };

  // get available time slots for a specific date
  // filters out slots that are already booked
  const getAvailableSlots = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dateAvailability = availability[dateKey] || [];

    // get all bookings for this date
    const dateBookings = Object.values(bookings).filter(
      (booking) => booking.date === dateKey
    );

    // filter out booked time slots from available slots
    const bookedTimes = dateBookings.map((booking) => booking.time);
    return dateAvailability.filter((slot) => !bookedTimes.includes(slot));
  };

  // check if a date has any availability
  // used to highlight available days on calendar
  const hasAvailability = (date) => {
    const availableSlots = getAvailableSlots(date);
    return availableSlots.length > 0;
  };

  // get all bookings for a specific date
  // used by admin to see who booked what
  const getBookingsForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return Object.entries(bookings)
      .filter(([_, booking]) => booking.date === dateKey)
      .map(([id, booking]) => ({ id, ...booking }));
  };

  // all values and functions provided to child components
  const value = {
    bookings,
    availability,
    loading,
    createBooking,
    deleteBooking,
    updateAvailability,
    getAvailableSlots,
    hasAvailability,
    getBookingsForDate,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
