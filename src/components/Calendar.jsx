// calendar component - displays monthly calendar with availability
// shows available days in pink for clients, all days clickable for admin

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday
} from 'date-fns';
import { useBooking } from '../context/BookingContext';

const Calendar = ({ onDayClick, isAdmin = false }) => {
  // track which month is currently being displayed
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { hasAvailability, getBookingsForDate } = useBooking();

  // calculate calendar dates to display
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // get array of all days to show (includes prev/next month overflow)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // navigate to previous month
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // navigate to next month
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // determine styling for each day cell
  const getDayStyle = (day) => {
    // gray out days from other months
    if (!isSameMonth(day, currentMonth)) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }

    // admin can click all days in current month
    if (isAdmin) {
      return 'bg-white hover:bg-pink-100 cursor-pointer transform hover:scale-105 transition-all';
    }

    // clients can only click days with availability
    const available = hasAvailability(day);
    if (available) {
      return 'bg-pastel-pink hover:bg-pink-200 cursor-pointer transform hover:scale-105 transition-all border-2 border-pink-300';
    }

    // unavailable days are grayed out
    return 'bg-gray-100 text-gray-500 cursor-not-allowed';
  };

  // handle clicking on a day
  const handleDayClick = (day) => {
    // ignore clicks on other month's days
    if (!isSameMonth(day, currentMonth)) return;

    // clients can't click unavailable days
    if (!isAdmin && !hasAvailability(day)) return;

    onDayClick(day);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* month navigation header */}
      <div className="bg-white rounded-super shadow-soft p-3 mb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-pink-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-pink-500" />
          </button>

          <h2 className="text-3xl font-bold text-pink-600">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-pink-100 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-pink-500" />
          </button>
        </div>
      </div>

      {/* calendar grid */}
      <div className="bg-white rounded-super shadow-soft p-3">
        {/* week day headers (sun, mon, tue...) */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-pink-600 text-sm py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* days grid with booking indicators */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const bookings = getBookingsForDate(day);
            const hasBookings = bookings.length > 0;

            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`
                  h-16 rounded-bubble p-2
                  flex flex-col items-center justify-center
                  relative
                  ${getDayStyle(day)}
                  ${isToday(day) ? 'ring-2 ring-pink-500' : ''}
                `}
              >
                <span className="text-base font-semibold">
                  {format(day, 'd')}
                </span>

                {/* booking indicator dots */}
                {hasBookings && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {bookings.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-pink-500"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* legend showing what colors mean (client view only) */}
        {!isAdmin && (
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-pastel-pink border-2 border-pink-300" />
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-100" />
              <span className="text-gray-600">Unavailable</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
