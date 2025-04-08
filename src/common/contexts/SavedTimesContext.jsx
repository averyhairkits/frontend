// After volunteers save selected times
import React, { createContext, useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

const SavedTimesContext = createContext();

const SavedTimesContextProvider = ({ children }) => {
  const [savedTimes, setSavedTimes] = useState(new Set());

  useEffect(() => {
    console.log('Updated all saved times: ', savedTimes);
  }, [savedTimes]);

  return (
    <SavedTimesContext.Provider
      value={{
        savedTimes,
        setSavedTimes,
      }}
    >
      {children}
    </SavedTimesContext.Provider>
  );
};

SavedTimesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useSavedTimesContext = () => {
  return useContext(SavedTimesContext);
};

export { SavedTimesContext, SavedTimesContextProvider, useSavedTimesContext };
