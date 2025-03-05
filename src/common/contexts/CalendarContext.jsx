import React, { createContext, useContext, useState } from 'react';

import PropTypes from 'prop-types';

const weekRange = (date) => {
  const startOfWeek = new Date(date);
  if (date.getDay() === 0) {
    startOfWeek.setDate(date.getDate() - 6);
  } else {
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
  }
  const weekDates = [];
  const temp = new Date(startOfWeek);
  for (let i = 0; i < 7; i++) {
    weekDates.push(new Date(temp));
    temp.setDate(temp.getDate() + 1);
  }
  return weekDates;
};

const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(
    new Date('2025-02-10T00:00:00')
  );
  const weekdates = weekRange(currentDate);

  return (
    <CalendarContext.Provider
      value={{ currentDate, setCurrentDate, weekdates }}
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
