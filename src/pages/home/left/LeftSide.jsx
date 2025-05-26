import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useConfirmedTimesContext } from 'common/contexts/ConfirmedTimesContext';
import { useSavedTimesContext } from 'common/contexts/SavedTimesContext';
import LeftDescription from 'pages/home/left/LeftDescription';
import LeftLog from 'pages/home/left/LeftLog';
import 'pages/home/left/LeftSide.css';
import confirmedTimes from 'pages/home/right/confirmedTimes';

// Volunteer mini-calendar underline
const getVolunteerTileClass = ({ date, savedTimes }) => {
  const isSelectedDate = Array.from(savedTimes).some(
    (d) => d.time.toDateString() === date.toDateString()
  );

  const isSelectedConfirmedDate = Array.from(savedTimes).some((d) =>
    Array.from(confirmedTimes).some((e) => {
      return (
        // e.start, d, and date's dates are the same
        e.start.toDateString() === d.time.toDateString() &&
        date.toDateString() === d.time.toDateString() &&
        // d & date's times are between a start and end date in confirmedTimes
        e.start.toLocaleTimeString() <= d.time.toLocaleTimeString() &&
        e.end.toLocaleTimeString() >= d.time.toLocaleTimeString()
      );
    })
  );

  if (isSelectedConfirmedDate && isSelectedDate) return 'underlineBoth';
  if (isSelectedDate) return 'underline1';
  return '';
};

// Admin mini-calendar underline
const getAdminTileClass = ({ date, confirmedTimes }) => {
  const isConfirmedDate = Array.from(confirmedTimes).some(
    (d) => new Date(d.start).toDateString() === date.toDateString()
  );

  // if (has4MoreSelected && isConfirmedDate) return 'underlineBoth';
  if (isConfirmedDate) return 'underline2';
  // if (has4MoreSelected) return 'underline1';
  return '';
};

export default function LeftSide({ isAdmin }) {
  const { todaysDate } = useCalendarContext();
  const fourWeeksTime = 27 * 24 * 60 * 60 * 1000;
  const { savedTimes } = useSavedTimesContext();
  const { confirmedTimes } = useConfirmedTimesContext();

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
        minDate={isAdmin ? null : todaysDate}
        maxDate={
          isAdmin ? null : new Date(todaysDate.getTime() + fourWeeksTime)
        }
        value={todaysDate}
        prevLabel={<Icon.Back />}
        nextLabel={<Icon.Next />}
        tileClassName={(props) => {
          return isAdmin
            ? getAdminTileClass({ ...props, confirmedTimes })
            : getVolunteerTileClass({ ...props, savedTimes });
        }}
      />
    </div>
  );
}

LeftSide.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};
