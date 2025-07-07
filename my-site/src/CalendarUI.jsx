import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import './calendar.css';

const CalendarUI = ({ onDateClick }) => {
  const calendarRef = useRef();

  return (
    <div>
      <h2>My Google Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={(info) => {
          const clickedDate = info.dateStr;
          onDateClick(clickedDate); // Pass to parent for event creation
        }}
        ref={calendarRef}
        height="auto"
      />
    </div>
  );
};

export default CalendarUI;
