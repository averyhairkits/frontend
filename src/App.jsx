import React from 'react';

import VolunteerHome from 'VolunteerHome';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { UserProvider } from 'common/contexts/UserContext';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<VolunteerHome />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
