// After volunteers save selected times
import React, { createContext, useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';


const SavedTimesContext = createContext();

const SavedTimesContextProvider = ({ children }) => {
  const [savedTimes, setSavedTimes] = useState(new Set());
  const [canSave, setCanSave] = useState(false);

  // justSaved is used to determine whether to activate the save
  // button when calendar navigation is being used.
  // This eliminates the need to put selectedCells as a context
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    console.log('Updated all saved times: ', savedTimes);
  }, [savedTimes]);

  useEffect(() => {
    console.log("Can press 'save'? ", canSave);
  }, [canSave]);

  return (
    <SavedTimesContext.Provider
      value={{
        savedTimes,
        setSavedTimes,
        canSave,
        setCanSave,
        justSaved,
        setJustSaved,
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
