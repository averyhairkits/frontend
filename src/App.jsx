import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  PrivateRoute,
  PublicOnlyRoute,
} from 'common/components/routes/ProtectedRoutes';
import { CalendarContextProvider } from 'common/contexts/CalendarContext';
import { UserProvider } from 'common/contexts/UserContext';
<<<<<<< Updated upstream
=======
import NavLayout from 'common/layouts/NavLayout';
>>>>>>> Stashed changes
import AuthCallback from 'pages/account/AuthCallback';
import RequestPasswordReset from 'pages/account/RequestPasswordReset';
import ResetPassword from 'pages/account/ResetPassword';
import SignUp from 'pages/account/SignUpAndLogin';
import Home from 'pages/home/Home';
import VolunteerHome from 'pages/home/VolunteerHome';
import NotFound from 'pages/not-found/NotFound';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <CalendarContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route index element={<Home />} />
            </Route>
            <Route path='/' element={<PublicOnlyRoute />}>
              <Route path='volunteer-home' element={<VolunteerHome />} />
              <Route path='signup' element={<SignUp />} />
              <Route
                path='forgot-password'
                element={<RequestPasswordReset />}
              />
            </Route>
            <Route path='auth/callback' element={<AuthCallback />} />
            <Route path='auth/reset-password' element={<ResetPassword />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CalendarContextProvider>
    </UserProvider>
  );
}
