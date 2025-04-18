import React, { createContext, useContext, useState } from 'react';

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

const getGridItemTimes = (weekdates) => {
  const gridItemTimes = Array.from({ length: 140 });

  for (let i = 0; i < 140; i++) {
    const dayOfWeek = Math.floor(i / 20) % 7; // This ensures we cycle through 0-6 (Monday-Sunday)
    const halfHour = i % 20;

    gridItemTimes[i] = {
      start: new Date(
        weekdates[dayOfWeek].getFullYear(),
        weekdates[dayOfWeek].getMonth(),
        weekdates[dayOfWeek].getDate(),
        9 + Math.floor(halfHour / 2),
        halfHour % 2 === 0 ? 0 : 30
      ),
      numRegistered: Math.floor(Math.random() * 7),
      // ^ random int from 0 - 6 for now until we
      // can fetch actual number from backend
    };
  }

  console.log('gridItemTimes: ', gridItemTimes);
  return gridItemTimes;
};

const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  // todaysDate and thisWeeksStart only change with the time in real life
  const todaysDate = new Date('2025-02-10T00:00:00'); // must always be a time that starts at T00:00:00
  const thisWeeksStart = new Date(todaysDate);

  setStartOfWeek(thisWeeksStart);
  const [currentDate, setCurrentDate] = useState(thisWeeksStart);
  const weekdates = weekRange(currentDate);
  const gridItemTimes = getGridItemTimes(weekdates);

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
};

const useCalendarContext = () => {
  return useContext(CalendarContext);
};

export { CalendarContext, CalendarContextProvider, useCalendarContext };
