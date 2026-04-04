import React from "react";

const BookAppointmentButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${className}`}
    >
      Book Appointment
    </button>
  );
};

export default BookAppointmentButton;
