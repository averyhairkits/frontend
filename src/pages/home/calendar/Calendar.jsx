import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useAvailabilityContext } from 'common/contexts/useAvailabilityContext';
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

const CalendarGrid = ({
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  selectedCells,
  gridItemTimes,
}) => {
  const gridItems = Array.from({ length: 140 });

  return (
    <div className='calendarGrid' onMouseUp={handleMouseUp}>
      {gridItems.map((_, i) => {
        const isConfirmedSession = confirmedTimes.some(
          (d) => d.getTime() === gridItemTimes[i].getTime()
        );
        const isFull = fullTimes.some(
          (d) => d.getTime() === gridItemTimes[i].getTime()
        );

        // remains constant regardless of selections
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

CalendarGrid.propTypes = {
  handleMouseDown: PropTypes.func.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseUp: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectedCells: PropTypes.instanceOf(Set).isRequired,
  gridItemTimes: PropTypes.instanceOf(Array).isRequired,
  savedTimes: PropTypes.instanceOf(Set).isRequired,
};

const Save = ({ canSave, handleSave }) => {
  return (
    <button
      onClick={handleSave}
      className={`saveButton ${canSave ? 'clickable' : ''}`}
    >
      Save
    </button>
  );
};

Save.propTypes = {
  canSave: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export const Calendar = () => {
  const { weekdates, gridItemTimes } = useCalendarContext();
  const {
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedCells,
    canSave,
    handleSave,
  } = useAvailabilityContext();
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
          <CalendarGrid
            handleMouseDown={handleMouseDown}
            handleMouseEnter={handleMouseEnter}
            handleMouseUp={handleMouseUp}
            selectedCells={selectedCells}
            gridItemTimes={gridItemTimes}
          />
        </div>
      </div>
      <Save canSave={canSave} handleSave={handleSave} />
    </div>
  );
};
