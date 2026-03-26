// home page - main landing page where clients book sessions
// shows calendar with available days highlighted in pink

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import Calendar from '../components/Calendar';
import BookingModal from '../components/BookingModal';

const Home = () => {
  // state for controlling booking modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // state for storing which date user clicked
  const [selectedDate, setSelectedDate] = useState(null);

  // handle when user clicks on a day in calendar
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // close modal and reset selected date
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden px-2 py-4 relative">
      {/* admin access button - top right corner */}
      <Link
        to="/admin"
        className="absolute top-4 right-4 p-2 bg-white hover:bg-pink-100 rounded-full transition-colors shadow-soft flex items-center justify-center"
        title="Admin Access"
      >
        <Lock className="w-5 h-5 text-pink-500" />
      </Link>

      {/* header with title and instructions */}
      <div className="text-center mb-4 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-pink-500" />
          <h1 className="text-4xl font-bold text-pink-600" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white' }}>
            Tutoring Sessions
          </h1>
          <Sparkles className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-white text-base font-semibold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          Click on an available day to book your session! 
        </p>
      </div>

      {/* calendar component takes up remaining space */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <Calendar onDayClick={handleDayClick} />
      </div>

      {/* booking modal appears when user clicks a day */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />

      {/* footer */}
      <div className="text-center mt-2 text-white-500 text-xs flex-shrink-0">
        Made by Arfa
      </div>
    </div>
  );
};

export default Home;
