import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useCalendarNav } from 'pages/home/useCalendarNav';
import { useNumVolunteers } from 'pages/home/useNumVolunteers';

import './VolunteerHome.css';

const CalendarNav = ({ currentDate, weekdates }) => {
  const { handlePrevWeek, handleNextWeek } = useCalendarNav();

  return (
    <nav className='calendarNav'>
      <button onClick={handlePrevWeek} className='calendarNavButton'>
        <Icon.Back className='calendarNavIcon' />
      </button>
      <h6>
        {currentDate.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
        })}
        {' - '}
        {weekdates[0].getMonth() !== weekdates[6].getMonth()
          ? weekdates[6].toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
            })
          : weekdates[6].toLocaleDateString(undefined, { day: 'numeric' })}
      </h6>
      <button onClick={handleNextWeek} className='calendarNavButton'>
        <Icon.Next className='calendarNavIcon' />
      </button>
    </nav>
  );
};

CalendarNav.propTypes = {
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
        const row = Math.floor(i / 7);
        const itemType =
          row % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom';
        return <div key={i} className={itemType}></div>;
      })}
    </div>
  );
};

const VolunteerHome = () => {
  const { currentDate, weekdates } = useCalendarContext();

  return (
    <main>
      <button className='navButton'>
        <Icon.Logout className='navIcon' />
      </button>
      <div className='leftSection'></div>
      <div className='rightSection'>
        <CalendarNav currentDate={currentDate} weekdates={weekdates} />
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
    </main>
  );
};

export default VolunteerHome;
