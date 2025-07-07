import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';
import CalendarUI from './CalendarUI';

const CLIENT_ID = '241498959848-5ogtiq24cevlush96p81r9pr1ppnorp2.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAONJqvY2YQp2wEjsRihMGFJy1G7dRh7OA';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const signIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const createEvent = async (dateStr) => {
    const event = {
      summary: 'New Event from My Site',
      description: 'Event created by React + Google Calendar',
      start: {
        dateTime: `${dateStr}T10:00:00`,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: `${dateStr}T11:00:00`,
        timeZone: 'Asia/Kolkata',
      },
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      alert("Event Created!");
      console.log(response);
    } catch (err) {
      alert("Error creating event.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={signIn}>Sign in with Google</button>
      <CalendarUI onDateClick={createEvent} />
    </div>
  );
}

export default App;
