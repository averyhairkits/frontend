import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useSavedTimesContext } from 'common/contexts/SavedTimesContext';
import LeftDescription from 'pages/home/left/LeftDescription';
import LeftLog from 'pages/home/left/LeftLog';
import 'pages/home/left/LeftSide.css';
import confirmedTimes from 'pages/home/right/confirmedTimes';

// Volunteer mini-calendar underline
const getVolunteerTileClass = ({ date, savedTimes }) => {
  const isSelectedDate = Array.from(savedTimes).some(
    (d) => d.toDateString() === date.toDateString()
  );

  const isSelectedConfirmedDate = Array.from(savedTimes).some((d) =>
    Array.from(confirmedTimes).some(
      (e) =>
        // d, and date's dates are the same, and their times are between
        // a start and end date in confirmedTimes
        date.toDateString() === d.toDateString() &&
        e.start.toLocaleTimeString() <= d.toLocaleTimeString() &&
        e.end.toLocaleTimeString() >= d.toLocaleTimeString()
    )
  );

  if (isSelectedConfirmedDate && isSelectedDate) return 'underlineBoth';
  if (isSelectedConfirmedDate) return 'underline2';
  if (isSelectedDate) return 'underline1';
  return '';
};

// // Admin mini-calendar underline
// const getAdminTileClass = ({ date, allSavedTimes, confirmedTimes }) => {
//   const isConfirmedDate = Array.from(confirmedTimes).some(
//     (d) => d.toDateString() === date.toDateString()
//   );

//   if (has4MoreSelected && isConfirmedDate) return 'underlineBoth';
//   if (isConfirmedDate) return 'underline2';
//   if (has4MoreSelected) return 'underline1';
// }

export default function LeftSide({ isAdmin }) {
  const { todaysDate } = useCalendarContext();
  const fourWeeksTime = 27 * 24 * 60 * 60 * 1000;
  const { savedTimes } = useSavedTimesContext();

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
        tileClassName={(props) => {
          // replace '' with getAdminTileClass when implemented
          return isAdmin ? '' : getVolunteerTileClass({ ...props, savedTimes });
        }}
      />
    </div>
  );
}

LeftSide.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};
