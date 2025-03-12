import React, { useRef, useState } from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import 'pages/home/Home.css';
import 'pages/home/VolunteerHome.css';
import { CalendarNav } from 'pages/home/calendar/CalendarNav';
import confirmedTimes from 'pages/home/calendar/confirmedTimes';
import fullTimes from 'pages/home/calendar/fullTimes';
import { useNumVolunteers } from 'pages/home/calendar/useNumVolunteers';

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

const CalendarGrid = ({ weekdates }) => {
  const gridItems = Array.from({ length: 140 });
  const gridItemTimes = [...gridItems];
  let dayOfWeek = 0;
  for (let i = 0; i < 140; i++) {
    Math.floor(i / 20) === 6
      ? (dayOfWeek = 0)
      : (dayOfWeek = Math.floor(i / 20));
    let halfHour = Math.floor(i % 20);

    gridItemTimes[i] = new Date(
      weekdates[dayOfWeek].getFullYear(),
      weekdates[dayOfWeek].getMonth(),
      weekdates[dayOfWeek].getDate(),
      9 + Math.floor(halfHour / 2),
      halfHour % 2 === 0 ? 0 : 30
    );
  }

  CalendarGrid.propTypes = {
    weekdates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  };

  const [selectedCells, setSelectedCells] = useState(new Set());
  const isDragging = useRef(false);

  const toggleSelection = (index) => {
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleMouseDown = (index) => {
    isDragging.current = true;
    toggleSelection(index);
  };

  const handleMouseEnter = (index) => {
    if (isDragging.current) {
      toggleSelection(index);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className='calendarGrid' onMouseUp={handleMouseUp}>
      {gridItems.map((_, i) => {
        const isConfirmedSession = confirmedTimes.some(
          (d) => d.getTime() === gridItemTimes[i].getTime()
        );
        const isFull = fullTimes.some(
          (d) => d.getTime() === gridItemTimes[i].getTime()
        );
        const itemType = `${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'} ${isFull ? 'full' : ''}`;

        return (
          <div
            key={i}
            // only shows confirmed session if a confirmed cell is selected
            className={`${itemType} ${selectedCells.has(i) && isConfirmedSession ? 'confirmed' : selectedCells.has(i) ? 'selected' : ''}`}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
          ></div>
        );
      })}
    </div>
  );
};

export const Calendar = () => {
  const { weekdates } = useCalendarContext();
  return (
    <div className='calendar'>
      <CalendarNav />
      <div className='rightMainSection'>
        <div className='timeContainer'>
          <NumVolunteers />
          <Times />
        </div>
        <div className='gridContainer'>
          <HeaderGrid weekdates={weekdates} />
          <CalendarGrid weekdates={weekdates} />
        </div>
      </div>
      <button className='saveButton'>Save</button>
    </div>
  );
};
