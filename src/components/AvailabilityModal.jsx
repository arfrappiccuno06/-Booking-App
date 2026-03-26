// availability modal - admin interface for setting available time slots
// includes time picker, bulk time block, and recurring availability features

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Plus, Trash2, ChevronUp, ChevronDown, Repeat } from 'lucide-react';
import { format, addWeeks } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import toast from 'react-hot-toast';

const AvailabilityModal = ({ isOpen, onClose, selectedDate }) => {
  // state for storing time slots being edited
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // time picker state - for adding individual slots
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  // bulk time block state - for adding multiple hourly slots at once
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);

  // recurring state - apply same availability to multiple weeks
  const [recurringWeeks, setRecurringWeeks] = useState(1);

  const { availability, updateAvailability, getBookingsForDate } = useBooking();

  // load existing time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const existingSlots = availability[dateKey] || [];
      setTimeSlots([...existingSlots]);
    }
  }, [selectedDate, availability]);

  // don't render if modal is closed or no date selected
  if (!isOpen || !selectedDate) return null;

  const bookings = getBookingsForDate(selectedDate);

  // convert time picker values to formatted string (e.g., "9:00 AM")
  const getFormattedTime = (hour, minute, period) => {
    const displayHour = hour === 0 ? 12 : hour;
    const minuteStr = minute === 0 ? '00' : minute;
    return `${displayHour}:${minuteStr} ${period}`;
  };

  // add single time slot from time picker
  const handleAddFromPicker = () => {
    const timeStr = getFormattedTime(selectedHour, selectedMinute, selectedPeriod);

    if (timeSlots.includes(timeStr)) {
      toast.error('This time slot already exists');
      return;
    }

    // add and sort time slots
    const updatedSlots = [...timeSlots, timeStr].sort((a, b) => {
      const convertTo24 = (time) => {
        const [timepart, period] = time.split(' ');
        let [hours, minutes] = timepart.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return convertTo24(a) - convertTo24(b);
    });

    setTimeSlots(updatedSlots);
    toast.success('Time slot added!');
  };

  // add bulk time block - creates hourly slots from start to end hour
  const handleAddTimeBlock = () => {
    const newSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const timeStr = `${displayHour}:00 ${period}`;
      if (!timeSlots.includes(timeStr)) {
        newSlots.push(timeStr);
      }
    }

    if (newSlots.length === 0) {
      toast.error('All slots in this range already exist');
      return;
    }

    // add new slots and sort
    const updatedSlots = [...timeSlots, ...newSlots].sort((a, b) => {
      const convertTo24 = (time) => {
        const [timepart, period] = time.split(' ');
        let [hours, minutes] = timepart.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return convertTo24(a) - convertTo24(b);
    });

    setTimeSlots(updatedSlots);
    toast.success(`Added ${newSlots.length} time slots!`);
  };

  // remove a time slot (but not if it has a booking)
  const handleRemoveTimeSlot = (slot) => {
    const isBooked = bookings.some((booking) => booking.time === slot);

    if (isBooked) {
      toast.error('Cannot remove a time slot that has a booking');
      return;
    }

    setTimeSlots(timeSlots.filter((s) => s !== slot));
  };

  // save availability to firebase
  const handleSave = async () => {
    setIsSubmitting(true);

    // save for current date
    const result = await updateAvailability(selectedDate, timeSlots);

    // if recurring is enabled, save for future weeks too
    if (recurringWeeks > 1) {
      for (let i = 1; i < recurringWeeks; i++) {
        const futureDate = addWeeks(selectedDate, i);
        await updateAvailability(futureDate, timeSlots);
      }
    }

    if (result.success) {
      const message = recurringWeeks > 1
        ? `Availability updated for ${recurringWeeks} weeks! ✨`
        : 'Availability updated successfully! ✨';
      toast.success(message, { icon: '✅' });
      onClose();
    } else {
      toast.error('Failed to update availability');
    }

    setIsSubmitting(false);
  };

  // time picker increment/decrement functions
  const incrementHour = () => {
    if (selectedHour === 11) {
      setSelectedHour(0);
      setSelectedPeriod(selectedPeriod === 'AM' ? 'PM' : 'AM');
    } else {
      setSelectedHour(selectedHour + 1);
    }
  };

  const decrementHour = () => {
    if (selectedHour === 0) {
      setSelectedHour(11);
      setSelectedPeriod(selectedPeriod === 'AM' ? 'PM' : 'AM');
    } else {
      setSelectedHour(selectedHour - 1);
    }
  };

  const incrementMinute = () => {
    setSelectedMinute(selectedMinute === 30 ? 0 : 30);
  };

  const decrementMinute = () => {
    setSelectedMinute(selectedMinute === 0 ? 30 : 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-super shadow-hover max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
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
            Edit Availability
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
        </div>

        {/* time picker with up/down arrows for single slot */}
        <div className="mb-6 bg-pastel-pink p-6 rounded-super">
          <label className="text-sm font-semibold text-pink-600 mb-3 block flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Add Single Time Slot
          </label>
          <div className="flex items-center justify-center gap-4">
            {/* hour picker with arrows */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementHour}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-pink-600" />
              </button>
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-bubble text-2xl font-bold text-pink-600 my-2">
                {selectedHour === 0 ? 12 : selectedHour}
              </div>
              <button
                type="button"
                onClick={decrementHour}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-pink-600" />
              </button>
            </div>

            <span className="text-2xl font-bold text-pink-600">:</span>

            {/* minute picker with arrows */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={incrementMinute}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-pink-600" />
              </button>
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-bubble text-2xl font-bold text-pink-600 my-2">
                {selectedMinute === 0 ? '00' : selectedMinute}
              </div>
              <button
                type="button"
                onClick={decrementMinute}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-pink-600" />
              </button>
            </div>

            {/* am/pm toggle buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setSelectedPeriod('AM')}
                className={`px-4 py-2 rounded-bubble font-semibold transition-all ${
                  selectedPeriod === 'AM'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-pink-600 hover:bg-pink-100'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('PM')}
                className={`px-4 py-2 rounded-bubble font-semibold transition-all ${
                  selectedPeriod === 'PM'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-pink-600 hover:bg-pink-100'
                }`}
              >
                PM
              </button>
            </div>

            {/* add button for time picker */}
            <button
              type="button"
              onClick={handleAddFromPicker}
              className="px-6 py-3 bg-pink-500 text-white rounded-bubble hover:bg-pink-600 transition-colors flex items-center gap-2 ml-4"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* bulk time block selector - adds multiple hourly slots */}
        <div className="mb-6 bg-purple-50 p-6 rounded-super">
          <label className="text-sm font-semibold text-purple-600 mb-3 block">
            Add Time Block (Hourly Slots)
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">Start Hour</label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-bubble border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-2xl text-purple-600 mt-5">→</span>
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">End Hour</label>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-bubble border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddTimeBlock}
              className="px-6 py-3 bg-purple-500 text-white rounded-bubble hover:bg-purple-600 transition-colors mt-5"
            >
              Add Block
            </button>
          </div>
        </div>

        {/* recurring availability - apply same slots to multiple weeks */}
        <div className="mb-6 bg-blue-50 p-6 rounded-super">
          <label className="text-sm font-semibold text-blue-600 mb-3 block flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            Repeat for Multiple Weeks
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="12"
              value={recurringWeeks}
              onChange={(e) => setRecurringWeeks(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-blue-600 min-w-[100px]">
              {recurringWeeks} {recurringWeeks === 1 ? 'week' : 'weeks'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            This will apply the same availability for the next {recurringWeeks} {recurringWeeks === 1 ? 'week' : 'weeks'}
          </p>
        </div>

        {/* list of current time slots with delete option */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-pink-600 mb-3 block">
            Available Time Slots ({timeSlots.length})
          </label>

          {timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-bubble">
              No time slots added yet
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {timeSlots.map((slot) => {
                const booking = bookings.find((b) => b.time === slot);
                const isBooked = !!booking;

                return (
                  <div
                    key={slot}
                    className={`
                      flex items-center justify-between p-4 rounded-bubble
                      ${isBooked ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50'}
                    `}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-pink-500" />
                        <span className="font-bold text-gray-700">{slot}</span>
                      </div>
                      {/* show who booked this slot */}
                      {isBooked && (
                        <span className="text-sm text-green-700 font-semibold ml-6">
                          📅 Booked by: {booking.clientName}
                        </span>
                      )}
                    </div>
                    {/* delete button (disabled if slot is booked) */}
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(slot)}
                      disabled={isBooked}
                      className={`
                        p-2 rounded-full transition-colors
                        ${isBooked ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-100'}
                      `}
                      title={isBooked ? 'Cannot remove booked slot' : 'Remove slot'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-bubble hover:from-pink-500 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-soft"
        >
          {isSubmitting ? 'Saving...' : 'Save Availability ✨'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityModal;
