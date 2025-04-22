import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { CalendarContextProvider } from 'common/contexts/CalendarContext';
import { ConfirmedTimesContextProvider } from 'common/contexts/ConfirmedTimesContext';
import { SavedTimesContextProvider } from 'common/contexts/SavedTimesContext';
import LeftSide from 'pages/home/left/LeftSide';
import RightSide from 'pages/home/right/RightSide';

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

const Home = ({ isAdmin }) => {
  return (
    <main>
      <NavButtons isAdmin={isAdmin} />
      <CalendarContextProvider>
        <SavedTimesContextProvider>
          <ConfirmedTimesContextProvider>
            <LeftSide isAdmin={isAdmin} /> {/* leftSection */}
            <RightSide isAdmin={isAdmin} /> {/* rightSection */}
          </ConfirmedTimesContextProvider>
        </SavedTimesContextProvider>
      </CalendarContextProvider>
    </main>
  );
};

Home.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default Home;
