// While volunteers select availability
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useSavedTimesContext } from 'common/contexts/SavedTimesContext';

const AvailabilityContext = createContext();

const AvailabilityContextProvider = ({ children }) => {
  const [selectedCells, setSelectedCells] = useState(new Set()); // contains one week
  const [canSave, setCanSave] = useState(false);
  const { savedTimes, setSavedTimes } = useSavedTimesContext(); // contains all times
  const [prevSelectedCells, setPrevSelectedCells] = useState(
    new Set(savedTimes)
  ); // contains one week
  const isDragging = useRef(false);
  const { weekdates, gridItemTimes } = useCalendarContext();

  // check if availability is different compared to last save for
  // toggling save button clickability
  const selectedCellsChanged = () => {
    if (selectedCells.size !== prevSelectedCells.size) return true;
    for (const val of prevSelectedCells) {
      if (!selectedCells.has(val)) return true;
    }
    return false;
  };

  // manage volunteers selecting/deselecting cells
  const toggleSelection = (index) => {
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index); // deselect cell if it was selected
      } else {
        newSet.add(index); // select cell if it was not selected
      }
      return newSet;
    });
  };

  // handleMouseDown, handleMouseEnter, and handleMouseUp
  // manage click and drag functions

  const handleMouseDown = (index) => {
    isDragging.current = true;
    toggleSelection(index);
  };

  const handleMouseEnter = (index) => {
    if (isDragging.current) {
      toggleSelection(index);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // clicking save button
  const handleSave = () => {
    console.log('Saved');
    setCanSave(false);
    setPrevSelectedCells(new Set(selectedCells)); // saved cells are now fixed until next save
  };

  // keep checking if current selected cells are different from last saved cells
  useEffect(() => {
    selectedCellsChanged() ? setCanSave(true) : setCanSave(false);
  }, [selectedCells]);

  useEffect(() => {
    // newlySavedTimes is a set of time objects that are selected & saved for the current week
    const newlySavedTimes = new Set();
    // add in times that have been saved for current week
    prevSelectedCells.forEach((val) => {
      newlySavedTimes.add(new Date(gridItemTimes[val]));
    });
    // keep savedTimes the same, but remove all times that are in the current week, and add newlySavedTimes instead
    setSavedTimes([
      ...Array.from(savedTimes).filter(
        (savedDate) =>
          !weekdates.some(
            (weekDate) => savedDate.toDateString() === weekDate.toDateString()
          )
      ),
      ...newlySavedTimes,
    ]);
  }, [prevSelectedCells]);

  useEffect(() => {
    // filter savedTimes to only include times that are in weekDates
    const filteredSavedTimes = Array.from(savedTimes).filter((savedDate) =>
      weekdates.some(
        (weekDate) => savedDate.toDateString() === weekDate.toDateString()
      )
    );
    // selectedCells is a set of cell numbers based on gridItemTimes
    setSelectedCells(
      new Set(
        filteredSavedTimes.map((savedTime) =>
          gridItemTimes.findIndex(
            (gridItemTime) => gridItemTime.getTime() === savedTime.getTime()
          )
        )
      )
    );
  }, [weekdates, savedTimes]);

  useEffect(() => {
    console.log("Can press 'save'? ", canSave);
  }, [canSave]);

  return (
    <AvailabilityContext.Provider
      value={{
        selectedCells,
        setSelectedCells,
        canSave,
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        handleSave,
        setPrevSelectedCells,
        prevSelectedCells,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
};

AvailabilityContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAvailabilityContext = () => {
  return useContext(AvailabilityContext);
};

export {
  AvailabilityContext,
  AvailabilityContextProvider,
  useAvailabilityContext,
};
