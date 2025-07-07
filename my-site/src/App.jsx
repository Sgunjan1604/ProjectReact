import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Replace with your actual credentials from Google Cloud Console
const CLIENT_ID = '609925221544-renr6blm7gsf0v0feu44dk1rvdkmcftt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyANCMIH2ur1g20OFAW2uK0uanRBRFPyC1Q';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

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
    setSignedIn(false);
    setEvents([]);
  };

  const fetchEvents = async () => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 2500,
        orderBy: 'startTime',
      });

      const events = response.result.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));

      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDateClick = async (info) => {
    const title = prompt('Enter event title');
    if (title) {
      try {
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
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };

  const handleEventClick = async (info) => {
    const action = prompt(`Edit title or type DELETE to remove "${info.event.title}"`);
    if (!action) return;

    try {
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
    } catch (error) {
      console.error("Error updating/deleting event:", error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
      <h2>📅 Google Calendar Integration</h2>
      {!signedIn ? (
        <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Sign in with Google
        </button>
      ) : (
        <>
          <button onClick={handleLogout} style={{ marginBottom: '1rem', padding: '8px 16px' }}>
            Logout
          </button>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
          />
        </>
      )}
    </div>
  );
}

export default App;
