import { useEffect } from 'react';

import { useCalendarContext } from './CalendarContext';
import { useSavedTimesContext } from './SavedTimesContext';

export const useCalendarNav = () => {
  const { setJustSaved } = useSavedTimesContext();
  const { currentDate, setCurrentDate } = useCalendarContext();

  const handlePrevWeek = () => {
    const newStart = new Date(currentDate);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentDate(newStart);
    setJustSaved(true);
    // ^ counterintuitive but this prevents save from staying active if
    // user navigates between pages after selecting but doesn't save
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentDate);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentDate(newStart);
    setJustSaved(true);
    // ^ counterintuitive but this prevents save from staying active if
    // user navigates between pages after selecting but doesn't save
  };

  useEffect(() => {
    console.log('New currentDate: ', currentDate);
  }, [currentDate]);

  return { handlePrevWeek, handleNextWeek };
};
