import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = "241498959848-5ogtiq24cevlush96p81r9pr1ppnorp2.apps.googleusercontent.com";
const API_KEY = "AIzaSyAONJqvY2YQp2wEjsRihMGFJy1G7dRh7OA";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const GoogleCalendar = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();
          setSignedIn(auth.isSignedIn.get());

          // Optional: Listen for sign-in state changes
          auth.isSignedIn.listen(setSignedIn);
        });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleShowEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      })
      .then((response) => {
        const events = response.result.items;
        setEvents(events);
        console.log("Fetched events:", events);
      });
  };

  return (
    <div>
      <h2>Google Calendar Integration</h2>
      {!signedIn && <button onClick={handleSignIn}>Sign in with Google</button>}
      {signedIn && <button onClick={handleShowEvents}>Show Upcoming Events</button>}

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.summary}</strong> <br />
            {event.start.dateTime || event.start.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleCalendar;
