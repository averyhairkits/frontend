import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import LeftDescription from 'pages/home/LeftSide/LeftDescription';
import LeftLog from 'pages/home/LeftSide/LeftLog';
import 'pages/home/LeftSide/Leftside.css';
import confirmedTimes from 'pages/home/calendar/confirmedTimes';

export default function LeftSide({ isAdmin }) {
  const { todaysDate } = useCalendarContext();
  const fourWeeksTime = 27 * 24 * 60 * 60 * 1000;
  const selectedDates = [
    new Date(2025, 1, 10),
    new Date(2025, 1, 11),
    new Date(2025, 1, 13),
  ];

  return (
    <div className='leftSection'>
      <div className='title'>
        <span className='logo-container'>
          <img src='/logo.jpeg' alt="Avery's Hair Kit Logo" />
        </span>
        Avery&apos;s Helpful Hair Kits
      </div>
      {isAdmin ? <LeftLog /> : <LeftDescription />}

      <Calendar
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: 'narrow' })
        }
        maxDetail='month'
        minDetail='month'
        minDate={todaysDate}
        maxDate={new Date(todaysDate.getTime() + fourWeeksTime)}
        value={todaysDate}
        prevLabel={<Icon.Back />}
        nextLabel={<Icon.Next />}
        tileClassName={({ date }) => {
          const isSelectedDate = selectedDates.some(
            (d) => d.toDateString() === date.toDateString()
          );
          const isConfirmedDate = confirmedTimes.some(
            (d) => d.toDateString() === date.toDateString()
          ); // doesn't account for confirmed but not selected yet
          // admin needs underline1 (4 or more sign ups), underline2, underlineBoth; volunteers need underlineBoth and underline1

          if (isSelectedDate && isConfirmedDate) return 'underlineBoth';
          if (isSelectedDate) return 'underline1';
          if (isConfirmedDate) return 'underline2';
          return '';
        }}
      />
    </div>
  );
}

LeftSide.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};
