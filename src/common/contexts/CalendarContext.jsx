import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

import PropTypes from 'prop-types';

function setStartOfWeek(date) {
  if (date.getDay() === 0) {
    date.setDate(date.getDate() - 6);
  } else {
    date.setDate(date.getDate() - date.getDay() + 1);
  }
}

const weekRange = (date) => {
  const startOfWeek = new Date(date);
  setStartOfWeek(startOfWeek);

  const weekDates = [];
  const temp = new Date(startOfWeek);
  for (let i = 0; i < 7; i++) {
    weekDates.push(new Date(temp));
    temp.setDate(temp.getDate() + 1);
  }
  return weekDates;
};

const getGridItemTimes = (weekdates, overbookedTimes, slots = []) => {
  const gridItemTimes = Array.from({ length: 140 });

  for (let i = 0; i < 140; i++) {
    const dayOfWeek = Math.floor(i / 20) % 7; // This ensures we cycle through 0-6 (Monday-Sunday)
    const halfHour = i % 20;
    const start = new Date(
      weekdates[dayOfWeek].getFullYear(),
      weekdates[dayOfWeek].getMonth(),
      weekdates[dayOfWeek].getDate(),
      9 + Math.floor(halfHour / 2),
      halfHour % 2 === 0 ? 0 : 30
    );
    const end = new Date(start.getTime() + 30 * 60 * 1000); // add 30 minutes after start

    const matchingSlot = slots.find(
      (slot) => new Date(slot.slot_time).getTime() === start.getTime()
    ); //searching for matching slot in slots

    gridItemTimes[i] = {
      start: start,
      end: end,
      size: matchingSlot ? matchingSlot.current_size : 0,
      isOverbooked: overbookedTimes.has(start.getTime()), // check if start time is in the overbooked times
 
    }
  }

  console.log('gridItemTimes: ', gridItemTimes);
  return gridItemTimes;
};

const CalendarContext = createContext();

const CalendarContextProvider = ({ children, mode }) => {
  // todaysDate and thisWeeksStart only change with the time in real life
  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0); // must always be a time that starts at T00:00:00
  const thisWeeksStart = new Date(todaysDate);

  setStartOfWeek(thisWeeksStart);
  const [currentDate, setCurrentDate] = useState(thisWeeksStart);
  const weekdates = weekRange(currentDate);
  const [gridItemTimes, setGridItemTimes] = useState([]);
  const [slots, setSlots] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    const fetchSlots = async () => {
      if (!user?.id) return;

      if (mode === 'admin') {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get_slots`);
          const data = await res.json();

          const flatSlots = data.weeks.flatMap((week) =>
            week.slots.map((slot) => ({
              ...slot,
              slot_time: new Date(slot.slot_time),
            }))
          );
          setSlots(flatSlots);

          const computedGrid = getGridItemTimes(weekdates, new Set(), flatSlots);
          setGridItemTimes(computedGrid);
          console.log('admin view lots fetched and grid set:', computedGrid);
        } catch (err) {
          console.error('Error fetching slots:', err);
        }
      }
      else { //volunteer fetch
        try {
          console.log("running volunteer calendar now");
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get_user_slots?user_id=${user.id}`);
          const data = await res.json();
          console.log("data is this ", data);

          const flatSlots = data.weeks.flatMap((week) =>
            week.slots.map((slot) => ({
              ...slot,
              slot_time: new Date(slot.slot_time),
            }))
          );
          setSlots(flatSlots);
          console.log("FLatslots is dis", flatSlots);

          const overbookedTimes = new Set(
          (data.summary?.overbookedSlots || []).map(slot =>
            new Date(slot.slot_time).getTime()
          )
        );
          const computedGrid = getGridItemTimes(weekdates,overbookedTimes, flatSlots);
          setGridItemTimes(computedGrid);
          console.log('volunteer view lots fetched and grid set:', computedGrid);
        } catch (err) {
          console.error('Error fetching slots:', err);
        }
      }
    };

    fetchSlots();
  }, [currentDate]);

  return (
    <CalendarContext.Provider
      value={{
        todaysDate,
        thisWeeksStart,
        currentDate,
        setCurrentDate,
        weekdates,
        gridItemTimes,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

CalendarContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  mode: PropTypes.oneOf(['admin', 'volunteer']).isRequired,
};

const useCalendarContext = () => {
  return useContext(CalendarContext);
};

export { CalendarContext, CalendarContextProvider, useCalendarContext };
