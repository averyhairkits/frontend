import React from 'react';

import PropTypes from 'prop-types';

import NavButtons from 'pages/home/NavButtons';
import LeftSide from 'pages/home/left/LeftSide';
import RightSide from 'pages/home/right/RightSide';

import './Home.css';

const Home = ({ isAdmin }) => {
  return (
    <main>
      <NavButtons isAdmin={isAdmin} />
      <LeftSide isAdmin={isAdmin} /> {/* leftSection */}
      <RightSide isAdmin={isAdmin} /> {/* rightSection */}
    </main>
  );
};

Home.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default Home;
