import { useEffect } from 'react';

import { useCalendarContext } from 'common/contexts/CalendarContext';

export const useCalendarNav = () => {
  const { currentDate, setCurrentDate } = useCalendarContext();

  const handlePrevWeek = () => {
    const newStart = new Date(currentDate);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentDate(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentDate);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentDate(newStart);
  };

  useEffect(() => {
    console.log('New currentDate: ', currentDate);
  }, [currentDate]);

  return { handlePrevWeek, handleNextWeek };
};
