// While volunteers select availability
import { useEffect, useRef, useState } from 'react';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useSavedTimesContext } from 'common/contexts/SavedTimesContext';
import { useUser } from 'common/contexts/UserContext';

export const useVolunteerCalendar = ({ numVolunteers }) => {
  const buildUrl = (endpoint) =>
    `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

  const { savedTimes, setSavedTimes, setCanSave, justSaved, setJustSaved } =
    useSavedTimesContext(); // contains all times
  const [prevSelectedCells, setPrevSelectedCells] = useState(
    new Set(savedTimes)
  ); // contains one week
  const isDragging = useRef(false);
  const { weekdates, gridItemTimes } = useCalendarContext();

  const [selectedCells, setSelectedCells] = useState(new Map()); // contains one week
  
  const { user } = useUser();

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
    const item = gridItemTimes[index];
    if (item?.isOverbooked) return;

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

  const handleSave = async () => {
    console.log('Saved');
    setJustSaved(true);
    setCanSave(false);
    setPrevSelectedCells(new Map(selectedCells)); // saved cells are now fixed until next save
  

    //convert selected cells to ISO timestamps
    const selectedTimestamps = Array.from(selectedCells.keys()).map((index) => {
      const item = gridItemTimes[index];
      return item?.start?.toISOString(); // safely get ISO string
    }).filter(Boolean);


    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildUrl('/api/new_request'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reqTimeStampList: selectedTimestamps,
          request_size: numVolunteers,
          user_id: user.id,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Request failed:', error);
        return;
      }
      const result = await response.json();
      console.log('Successfully submitted slot request:', result);
    } catch (error) {
      console.error('Network error:', error);
    }

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
      const item = gridItemTimes[index];
      if (!item || !item.start) return;
      newlySavedTimes.add({
        time: new Date(item.start),
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
