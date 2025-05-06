import React from 'react';

import { Icon } from 'assets/icons/icons';
import { useUser } from 'common/contexts/UserContext';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const NavButtons = ({ isAdmin }) => {
  const navigate = useNavigate();
  const { logout } = useUser();

  return (
    <nav className='navButtonsContainer'>
      <button className='navButton' 
      onClick={async () => {
      logout();
      navigate('/');
      }}>
        <Icon.Logout className='navIcon' />
      </button>
      {isAdmin && (
        <button className='navButton'>
          <Icon.User
            className='navIcon'
            onClick={() => navigate('/user-list')}
          />
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

export default NavButtons;
