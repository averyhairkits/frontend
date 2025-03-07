import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import 'pages/home/Home.css';
import 'pages/home/VolunteerHome.css';
import { useCalendarNav } from 'pages/home/calendar/useCalendarNav';
import { useNumVolunteers } from 'pages/home/calendar/useNumVolunteers';

const CalendarNav = ({
  todaysDate,
  thisWeeksStart,
  currentDate,
  weekdates,
}) => {
  const { handlePrevWeek, handleNextWeek } = useCalendarNav();
  const hasMonthOverlap = weekdates[0].getMonth() !== weekdates[6].getMonth();
  const atTodaysWeek =
    thisWeeksStart.toLocaleDateString() !== weekdates[0].toLocaleDateString();
  const isFourWeeksAhead =
    currentDate.getTime() - todaysDate.getTime() > 14 * 24 * 60 * 60 * 1000;

  return (
    <nav className='calendarNav'>
      {atTodaysWeek ? (
        <button onClick={handlePrevWeek} className='calendarNavButton'>
          <Icon.Back className='calendarNavIcon' />
        </button>
      ) : (
        <button className='calendarNavButton' />
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
      {isFourWeeksAhead ? (
        <button className='calendarNavButton' />
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
};

const Times = () => {
  const AllTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '',
  ];

  return (
    <div className='timeList'>
      {AllTimes.map((time) => (
        <div className='boldedSymbol' key={time}>
          {time === '9:00 AM' && <Icon.Sunrise className='sunIcon' />}
          {time === '12:00 PM' && <Icon.Noon className='sunIcon' />}
          {time === '5:00 PM' && <Icon.Sunset className='sunIcon' />}
          {time}
        </div>
      ))}
    </div>
  );
};

const NumVolunteers = () => {
  const {
    numVolunteers,
    isOpen,
    handleNumVolunteersButton,
    handleOptionsPopUp,
    optionsPopUpRef,
  } = useNumVolunteers();

  return (
    <div className='numVolunteersContainer' ref={optionsPopUpRef}>
      <button
        className='numVolunteersButton'
        onClick={handleNumVolunteersButton}
      >
        <Icon.Person className='numVolunteersButtonContent' />
        {numVolunteers}
        <Icon.Up className='numVolunteersButtonContent' />
      </button>
      {isOpen && (
        <dialog className='numVolunteersPopUp'>
          {[1, 2, 3].map((option) => (
            <option
              key={option}
              className={`numVolunteersOption ${numVolunteers === option && 'selected'}`}
              onClick={() => handleOptionsPopUp(option)}
            >
              {option}
            </option>
          ))}
        </dialog>
      )}
    </div>
  );
};

const HeaderGrid = ({ weekdates }) => {
  return (
    <div className='headerGrid'>
      {weekdates.map((date) => (
        <h4 className='headerGridItem' key={date}>
          {date.toLocaleDateString(undefined, { weekday: 'short' })}
        </h4>
      ))}
      {weekdates.map((date) => (
        <h5 className='headerGridItem' key={date}>
          {date.toLocaleDateString(undefined, { day: '2-digit' })}
        </h5>
      ))}
    </div>
  );
};

HeaderGrid.propTypes = {
  weekdates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
};

const CalendarGrid = () => {
  const gridItems = Array.from({ length: 140 });

  return (
    <div className='calendarGrid'>
      {gridItems.map((_, i) => {
        const itemType =
          i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom';
        return <div key={i} className={itemType}></div>;
      })}
    </div>
  );
};

export const Calendar = () => {
  const { todaysDate, thisWeeksStart, currentDate, weekdates } =
    useCalendarContext();
  return (
    <div className='calendar'>
      <CalendarNav
        todaysDate={todaysDate}
        thisWeeksStart={thisWeeksStart}
        currentDate={currentDate}
        weekdates={weekdates}
      />
      <div className='rightMainSection'>
        <div className='timeContainer'>
          <NumVolunteers />
          <Times />
        </div>
        <div className='gridContainer'>
          <HeaderGrid weekdates={weekdates} />
          <CalendarGrid />
        </div>
      </div>
      <button className='saveButton'>Save</button>
    </div>
  );
};
