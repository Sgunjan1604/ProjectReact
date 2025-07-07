import React from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import './index.css';
import GoogleCalendar from './GoogleCalendar';

const App = () => {
  return (  
    <>
      <Navbar />
      <Home />
      <GoogleCalendar />
    </>
  );
};

export default App;
