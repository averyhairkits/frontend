import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import { useNavigate } from 'react-router-dom';

import Layout from 'pages/home/LeftSide/Leftside';
import { Calendar } from 'pages/home/calendar/Calendar';

import './Home.css';

const VolunteerHome = () => {
  const navigate = useNavigate();

  return (
    <main>
      <button className='navButton' onClick={() => navigate('/signup')}>
        <Icon.Logout className='navIcon' />
      </button>
      <div className='leftSection'>
        <Layout />
      </div>
      <Calendar /> {/* rightSection */}
    </main>
  );
};

export default VolunteerHome;
