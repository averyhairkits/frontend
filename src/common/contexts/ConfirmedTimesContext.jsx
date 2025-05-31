// After admin saves a confirmed event
import React, { createContext, useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

const ConfirmedTimesContext = createContext();

const ConfirmedTimesContextProvider = ({ children }) => {
  const [confirmedTimes, setConfirmedTimes] = useState(new Set());

  useEffect(() => {
  const confirmedOnly = Array.from(confirmedTimes).filter(
    (s) => s.status === 'confirmed'
  );
  console.log('Confirmed sessions:', confirmedOnly);
}, [confirmedTimes]);

  return (
    <ConfirmedTimesContext.Provider
      value={{
        confirmedTimes,
        setConfirmedTimes,
      }}
    >
      {children}
    </ConfirmedTimesContext.Provider>
  );
};

ConfirmedTimesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useConfirmedTimesContext = () => {
  return useContext(ConfirmedTimesContext);
};

export {
  ConfirmedTimesContext,
  ConfirmedTimesContextProvider,
  useConfirmedTimesContext
};

