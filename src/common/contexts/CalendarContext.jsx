import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';

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


const getGridItemTimes = (weekdates, slots = []) => {
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
    );

    gridItemTimes[i] = {
      start: start,
      end: end,
      size: matchingSlot ? matchingSlot.current_size : 0,
    };
  }

  console.log('gridItemTimes: ', gridItemTimes);
  return gridItemTimes;
};

const CalendarContext = createContext();

const CalendarContextProvider = ({ children, mode }) => {
  // todaysDate and thisWeeksStart only change with the time in real life
  const todaysDate = new Date('2025-02-10T00:00:00'); // must always be a time that starts at T00:00:00
  const thisWeeksStart = new Date(todaysDate);

  setStartOfWeek(thisWeeksStart);
  const [currentDate, setCurrentDate] = useState(thisWeeksStart);
  const weekdates = weekRange(currentDate);
  const [gridItemTimes, setGridItemTimes] = useState([]);
  const [slots, setSlots] = useState([]);


  useEffect(() => {
    const fetchSlots = async () => {
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

          const computedGrid = getGridItemTimes(weekdates, flatSlots);
          setGridItemTimes(computedGrid);
          console.log('admin view lots fetched and grid set:', computedGrid);
        } catch (err) {
          console.error('Error fetching slots:', err);
        }
      }
      else {
        const computedGrid = getGridItemTimes(weekdates, []); // no slots for volunteer's calendars
        setGridItemTimes(computedGrid);
        console.log('admin view lots fetched and grid set:', computedGrid);
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
