import { useEffect } from 'react';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useAvailabilityContext } from 'common/contexts/useAvailabilityContext';

export const useCalendarNav = () => {
  const { currentDate, setCurrentDate } = useCalendarContext();
  const { setSelectedCells, setPrevSelectedCells } = useAvailabilityContext();

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
    console.log(
      'Resetting selectedCells and prevSelectedCells for week change'
    );
  }, [currentDate, setSelectedCells, setPrevSelectedCells]);

  useEffect(() => {
    console.log('New currentDate: ', currentDate);
  }, [currentDate]);

  return { handlePrevWeek, handleNextWeek };
};
