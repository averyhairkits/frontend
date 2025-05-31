// While volunteers select availability
import { useEffect, useRef, useState } from 'react';

import { useCalendarContext } from './CalendarContext';
import { useConfirmedTimesContext } from './ConfirmedTimesContext';
import { useSavedTimesContext } from './SavedTimesContext';
import { useUser } from './UserContext';

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
  const { confirmedTimes, setConfirmedTimes } = useConfirmedTimesContext();

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
    setJustSaved(true);
    setCanSave(false);
    setPrevSelectedCells(new Map(selectedCells)); // saved cells are now fixed until next save

    const selectedTimestamps = Array.from(selectedCells.entries())
      .filter(([index, size]) => {
        // Only include if this cell is new or its size changed
        return (
          !prevSelectedCells.has(index) || prevSelectedCells.get(index) !== size
        );
      })
      .map(([index, size]) => {
        const item = gridItemTimes[index];
        if (!item?.start) return null;

        const offsetMs = item.start.getTimezoneOffset() * 60000;
        const isoTime = new Date(item.start.getTime() - offsetMs).toISOString();

        return {
          slot_time: isoTime,
          request_size: size,
          user_id: user.id,
        };
      })
      .filter(Boolean);

    console.log('selected timestamps', selectedTimestamps);
    console.log(typeof selectedTimestamps);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildUrl('/api/new_request'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reqTimes: selectedTimestamps,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Request failed:', error);
        return;
      }
      const result = await response.json();
      console.log(
        'Successfully submitted slot request from inside handleSave:',
        result
      );
    } catch (error) {
      console.error('Network error:', error);
    }
  };

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
    const fetchConfirmedSessions = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/get_user_sessions?user_id=${user.id}`
        );
        const data = await res.json();

        if (data.sessions) {
          const parsed = data.sessions.map((entry) => {
            const s = entry.sessions;
            return {
              ...s,
              start: new Date(s.start),
              end: new Date(s.end),
            };
          });

          setConfirmedTimes(new Set(parsed));
          console.log('setConfirmedTimes with new sessions');
        }
      } catch (err) {
        console.error('Error fetching confirmed sessions:', err);
      }
    };

    fetchConfirmedSessions();
  }, [user?.id]);

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
