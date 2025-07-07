import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '241498959848-5ogtiq24cevlush96p81r9pr1ppnorp2.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAONJqvY2YQp2wEjsRihMGFJy1G7dRh7OA';
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
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const fetchEvents = async () => {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    });
    setEvents(response.result.items);
  };

  const createEvent = async () => {
    const event = {
      summary: 'Test Event',
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(new Date().getTime() + 3600000).toISOString() },
    };
    await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    fetchEvents();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Google Calendar Integration</h1>
      {signedIn ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={fetchEvents}>Load Events</button>
          <button onClick={createEvent}>Create Test Event</button>
          <ul>
            {events.map(event => (
              <li key={event.id}>{event.summary} - {event.start?.dateTime}</li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;
