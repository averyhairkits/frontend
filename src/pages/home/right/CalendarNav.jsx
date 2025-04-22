import React from 'react';

import { Icon } from 'assets/icons/icons';
import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import 'pages/home/Home.css';
import { useCalendarNav } from 'pages/home/right/useCalendarNav';

export const CalendarNav = ({ isAdmin }) => {
  const { handlePrevWeek, handleNextWeek } = useCalendarNav();
  const { todaysDate, thisWeeksStart, currentDate, weekdates } =
    useCalendarContext();
  const hasMonthOverlap = weekdates[0].getMonth() !== weekdates[6].getMonth();
  const atTodaysWeek =
    thisWeeksStart.toLocaleDateString() === weekdates[0].toLocaleDateString();
  const isFourWeeksAhead =
    currentDate.getTime() - todaysDate.getTime() > 14 * 24 * 60 * 60 * 1000;

  return (
    <nav className='calendarNav'>
      {isAdmin || !atTodaysWeek ? (
        <button onClick={handlePrevWeek} className='calendarNavButton'>
          <Icon.Back className='calendarNavIcon' />
        </button>
      ) : (
        <button className='calendarNavButton' /> // only have empty space
      )}
      <h6>
        {currentDate.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
        })}
        {' - '}
        {hasMonthOverlap
          ? weekdates[6].toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
            })
          : weekdates[6].toLocaleDateString(undefined, { day: 'numeric' })}
      </h6>
      {!isAdmin && isFourWeeksAhead ? (
        <button className='calendarNavButton' /> // only have empty space
      ) : (
        <button onClick={handleNextWeek} className='calendarNavButton'>
          <Icon.Next className='calendarNavIcon' />
        </button>
      )}
    </nav>
  );
};

CalendarNav.propTypes = {
  thisWeeksStart: PropTypes.instanceOf(Date).isRequired,
  todaysDate: PropTypes.instanceOf(Date).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  weekdates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
