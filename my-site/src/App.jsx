import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CLIENT_ID = '609925221544-renr6blm7gsf0v0feu44dk1rvdkmcftt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyANCMIH2ur1g20OFAW2uK0uanRBRFPyC1Q';
const SCOPES = "https://www.googleapis.com/auth/calendar";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setSignedIn);
        if (authInstance.isSignedIn.get()) {
          fetchEvents();
        }
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(fetchEvents);
  };

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
    setEvents([]);
  };

  const fetchEvents = async () => {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 2500,
      orderBy: 'startTime',
    });

    const items = response.result.items.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));

    setEvents(items);
  };

  const handleDateClick = async (info) => {
    const title = prompt('Enter event title');
    if (title) {
      const newEvent = {
        summary: title,
        start: {
          dateTime: info.dateStr,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(new Date(info.dateStr).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'Asia/Kolkata',
        },
      };

      await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: newEvent,
      });

      fetchEvents();
    }
  };

  const handleEventClick = async (info) => {
    const action = prompt(`Edit title or type DELETE to remove "${info.event.title}"`);
    if (!action) return;

    if (action.toLowerCase() === 'delete') {
      await gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: info.event.id,
      });
    } else {
      await gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: info.event.id,
        resource: {
          summary: action,
          start: { dateTime: info.event.start.toISOString(), timeZone: 'Asia/Kolkata' },
          end: { dateTime: info.event.end.toISOString(), timeZone: 'Asia/Kolkata' },
        },
      });
    }

    fetchEvents();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📅 My Google Calendar</h2>
      {!signedIn ? (
        <button onClick={handleLogin}>Sign in with Google</button>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
      )}
    </div>
  );
}

export default App;
