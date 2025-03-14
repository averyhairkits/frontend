import React from 'react';

import { Icon } from 'assets/icons/icons.js';

import Layout from 'pages/home/LeftSide/Leftside';
import { Calendar } from 'pages/home/calendar/Calendar';

import './Home.css';

const VolunteerHome = () => {
  return (
    <main>
      <button className='navButton'>
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
