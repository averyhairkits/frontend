import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { CalendarContextProvider } from 'common/contexts/CalendarContext';
import { SavedTimesContextProvider } from 'common/contexts/SavedTimesContext';
import { AvailabilityContextProvider } from 'common/contexts/useAvailabilityContext';
import LeftSide from 'pages/home/LeftSide/Leftside';
import { Calendar } from 'pages/home/calendar/Calendar';

import './Home.css';

const NavButtons = ({ isAdmin }) => {
  const navigate = useNavigate();

  return (
    <nav className='navButtonsContainer'>
      <button className='navButton' onClick={() => navigate('/')}>
        <Icon.Logout className='navIcon' />
      </button>
      {isAdmin && (
        <button className='navButton'>
          <Icon.User className='navIcon' />
        </button>
      )}
      {isAdmin && (
        <button className='navButton' onClick={() => navigate('/admin-home')}>
          <Icon.Home className='navIcon' />
        </button>
      )}
    </nav>
  );
};

NavButtons.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

const VolunteerHome = ({ isAdmin }) => {
  return (
    <main>
      <NavButtons isAdmin={isAdmin} />
      <CalendarContextProvider>
        <SavedTimesContextProvider>
          <AvailabilityContextProvider>
            <LeftSide isAdmin={isAdmin} /> {/* leftSection */}
            <Calendar isAdmin={isAdmin} /> {/* rightSection */}
          </AvailabilityContextProvider>
        </SavedTimesContextProvider>
      </CalendarContextProvider>
    </main>
  );
};

VolunteerHome.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default VolunteerHome;
