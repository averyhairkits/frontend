import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  PrivateRoute,
  PublicOnlyRoute,
} from 'common/components/routes/ProtectedRoutes';
import { UserProvider } from 'common/contexts/UserContext';
import AuthCallback from 'pages/account/AuthCallback';
import RequestPasswordReset from 'pages/account/RequestPasswordReset';
import ResetPassword from 'pages/account/ResetPassword';
import SignUp from 'pages/account/SignUpAndLogin';
import VolunteerHome from 'pages/home/VolunteerHome';
import NotFound from 'pages/not-found/NotFound';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}></Route>
          <Route path='/' element={<PublicOnlyRoute />}>
            <Route
              path='volunteer-home'
              element={<VolunteerHome isAdmin={false} />}
            />
            <Route
              path='admin-home'
              element={<VolunteerHome isAdmin={true} />}
            />
            <Route path='/' element={<SignUp />} />
            <Route path='forgot-password' element={<RequestPasswordReset />} />
          </Route>
          <Route path='auth/callback' element={<AuthCallback />} />
          <Route path='auth/reset-password' element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
