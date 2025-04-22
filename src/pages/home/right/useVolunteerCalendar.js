// While volunteers select availability
import { useEffect, useRef, useState } from 'react';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useSavedTimesContext } from 'common/contexts/SavedTimesContext';

export const useVolunteerCalendar = ({ numVolunteers }) => {
  const { savedTimes, setSavedTimes, setCanSave, justSaved, setJustSaved } =
    useSavedTimesContext(); // contains all times
  const [prevSelectedCells, setPrevSelectedCells] = useState(
    new Set(savedTimes)
  ); // contains one week
  const isDragging = useRef(false);
  const { weekdates, gridItemTimes } = useCalendarContext();

  const [selectedCells, setSelectedCells] = useState(new Map()); // contains one week

  // check if availability is different compared to last save for
  // toggling save button clickability
  const selectedCellsChanged = () => {
    if (selectedCells.size !== prevSelectedCells.size) return true;
    for (const [index, numPeople] of prevSelectedCells) {
      if (!selectedCells.has(index) || selectedCells.get(index) !== numPeople)
        return true;
    }
    return false;
  };

  // manage volunteers selecting/deselecting cells
  const toggleSelection = (index) => {
    setSelectedCells((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(index)) {
        newMap.delete(index);
      } else {
        newMap.set(index, numVolunteers); // default numPeople is 1
      }
      return newMap;
    });
  };

  // handleMouseDown, handleMouseEnter, and handleMouseUp
  // manage click and drag functions

  const handleMouseDown = (index) => {
    setJustSaved(false);
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
    setJustSaved(true);
    setCanSave(false);
    setPrevSelectedCells(new Map(selectedCells)); // saved cells are now fixed until next save
  };

  // keep checking if current selected cells are different from last saved cells
  useEffect(() => {
    !justSaved && selectedCellsChanged() ? setCanSave(true) : setCanSave(false);
  }, [selectedCells]);

  useEffect(() => {
    // newlySavedTimes is a set of time objects that are selected & saved for the current week
    const newlySavedTimes = new Set();
    // add in times that have been saved for current week
    prevSelectedCells.forEach((numPeople, index) => {
      newlySavedTimes.add({
        time: new Date(gridItemTimes[index].start),
        numPeople: numPeople,
      });
    });
    // keep savedTimes the same, but remove all times that are in the current week, and add newlySavedTimes instead
    const filteredOldTimes = Array.from(savedTimes).filter(
      (savedDate) =>
        !weekdates.some(
          (weekDate) =>
            savedDate.time.toDateString() === weekDate.toDateString()
        )
    );

    setSavedTimes(new Set([...filteredOldTimes, ...newlySavedTimes]));
  }, [prevSelectedCells]);

  useEffect(() => {
    // filter savedTimes to only include times that are in weekDates
    const filteredSavedTimes = Array.from(savedTimes).filter((savedTime) =>
      weekdates.some(
        (weekdate) => savedTime.time.toDateString() === weekdate.toDateString()
      )
    );

    // selectedCells is a map of cell numbers and num people based on gridItemTimes
    const newMap = new Map();
    filteredSavedTimes.forEach((savedTime) => {
      const index = gridItemTimes.findIndex(
        (gridItemTime) =>
          gridItemTime.start.getTime() === savedTime.time.getTime()
      );
      if (index !== -1) newMap.set(index, savedTime.numPeople);
    });

    setSelectedCells(newMap);
  }, [weekdates, savedTimes]);

  return {
    selectedCells,
    setSelectedCells,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleSave,
    setPrevSelectedCells,
    prevSelectedCells,
  };
};
