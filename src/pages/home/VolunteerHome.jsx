import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import { useNavigate } from 'react-router-dom';

import { CalendarContextProvider } from 'common/contexts/CalendarContext';
import { SavedTimesContextProvider } from 'common/contexts/SavedTimesContext';
import { AvailabilityContextProvider } from 'common/contexts/useAvailabilityContext';
import Layout from 'pages/home/LeftSide/Leftside';
import { Calendar } from 'pages/home/calendar/Calendar';

import './Home.css';

const VolunteerHome = () => {
  const navigate = useNavigate();

  return (
    <main>
      <button className='navButton' onClick={() => navigate('/')}>
        <Icon.Logout className='navIcon' />
      </button>
      <CalendarContextProvider>
        <SavedTimesContextProvider>
          <AvailabilityContextProvider>
            <Layout /> {/* leftSection */}
            <Calendar /> {/* rightSection */}
          </AvailabilityContextProvider>
        </SavedTimesContextProvider>
      </CalendarContextProvider>
    </main>
  );
};

export default VolunteerHome;
