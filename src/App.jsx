import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CalendarContextProvider } from 'common/contexts/CalendarContext';
import { UserProvider } from 'common/contexts/UserContext';
import VolunteerHome from 'pages/home/VolunteerHome';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <CalendarContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<VolunteerHome />} />
          </Routes>
        </BrowserRouter>
      </CalendarContextProvider>
    </UserProvider>
  );
}
