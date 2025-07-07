import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = "241498959848-5ogtiq24cevlush96p81r9pr1ppnorp2.apps.googleusercontent.com"; // Replace with your actual client ID
const API_KEY = "AIzaSyAONJqvY2YQp2wEjsRihMGFJy1G7dRh7OA"; // Replace with your actual API key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

const GoogleCalendar = () => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleListEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      })
      .then((response) => {
        const events = response.result.items;
        console.log("Upcoming events:", events);
        alert(`Fetched ${events.length} event(s). Check console.`);
      });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Google Calendar Integration</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
      <button onClick={handleListEvents} style={{ marginLeft: '1rem' }}>
        Show Upcoming Events
      </button>
    </div>
  );
};

export default GoogleCalendar;
