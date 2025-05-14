import React from 'react';

import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import {
  PrivateRoute,
  PublicOnlyRoute,
} from 'common/components/routes/ProtectedRoutes';
import { CalendarContextProvider } from 'common/contexts/CalendarContext';
import { ConfirmedTimesContextProvider } from 'common/contexts/ConfirmedTimesContext';
import { SavedTimesContextProvider } from 'common/contexts/SavedTimesContext';
import { UserProvider } from 'common/contexts/UserContext';
import AuthCallback from 'pages/account/AuthCallback';
import RequestPasswordReset from 'pages/account/RequestPasswordReset';
import ResetPassword from 'pages/account/ResetPassword';
import SignUp from 'pages/account/SignUpAndLogin';
import Home from 'pages/home/Home';
import UserList from 'pages/home/right/UserList';
import NotFound from 'pages/not-found/NotFound';

import './App.css';
import RoleRedirect from './RoleRedirect';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PublicOnlyRoute />}>
            <Route path='' element={<SignUp />} />
            <Route path='login' element={<SignUp />} />
            <Route path='forgot-password' element={<RequestPasswordReset />} />
          </Route>

          <Route path='auth/callback' element={<AuthCallback />} />
          <Route path='auth/reset-password' element={<ResetPassword />} />

          <Route path='/' element={<PrivateRoute />}>
            <Route index element={<RoleRedirect />} />
            <Route
              element={
                <CalendarContextProvider mode='volunteer'>
                  <SavedTimesContextProvider>
                    <ConfirmedTimesContextProvider>
                      <Outlet />
                    </ConfirmedTimesContextProvider>
                  </SavedTimesContextProvider>
                </CalendarContextProvider>
              }
            >
              <Route path='volunteer-home' element={<Home isAdmin={false} />} />
            </Route>

            <Route
              element={
                <CalendarContextProvider mode='admin'>
                  <SavedTimesContextProvider>
                    <ConfirmedTimesContextProvider>
                      <Outlet />
                    </ConfirmedTimesContextProvider>
                  </SavedTimesContextProvider>
                </CalendarContextProvider>
              }
            >
              <Route path='admin-home' element={<Home isAdmin={true} />} />
              <Route path='user-list' element={<UserList />} />
            </Route>
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
