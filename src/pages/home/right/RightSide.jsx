import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useSavedTimesContext } from 'common/contexts/SavedTimesContext';
import { useNumVolunteers } from 'common/contexts/useNumVolunteers';
import { useUser } from 'common/contexts/UserContext';
import { useVolunteerCalendar } from 'common/contexts/useVolunteerCalendar';
import 'pages/home/Home.css';
import { AdminCalendarGrid } from 'pages/home/right/AdminCalendarGrid';
import { CalendarNav } from 'pages/home/right/CalendarNav';
import { VolunteerCalendarGrid } from 'pages/home/right/VolunteerCalendarGrid';
import PropTypes from 'prop-types';

import './VolunteerHome.css';

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

const NumVolunteers = ({ ...props }) => {
  return (
    <div className='numVolunteersContainer' ref={props.optionsPopUpRef}>
      <button
        className='numVolunteersButton'
        onClick={props.handleNumVolunteersButton}
      >
        <Icon.User className='numVolunteersButtonContent' />
        {props.numVolunteers}
        <Icon.Up className='numVolunteersButtonContent' />
      </button>
      {props.isOpen && (
        <dialog className='numVolunteersPopUp'>
          {[1, 2, 3].map((option) => (
            <option
              key={option}
              className={`numVolunteersOption ${props.numVolunteers === option && 'selected'}`}
              onClick={() => props.handleOptionsPopUp(option)}
            >
              {option}
            </option>
          ))}
        </dialog>
      )}
    </div>
  );
};

NumVolunteers.propTypes = {
  optionsPopUpRef: PropTypes.func.isRequired,
  handleNumVolunteersButton: PropTypes.func.isRequired,
  numVolunteers: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleOptionsPopUp: PropTypes.func.isRequired,
};

const HeaderGrid = ({ weekdates, todaysDate }) => {
  return (
    <div className='headerGrid'>
      {weekdates.map((date) => (
        <h4 className='headerGridItem' key={date}>
          {date.toLocaleDateString(undefined, { weekday: 'short' })}
        </h4>
      ))}
      {weekdates.map((date) => (
        <h5
          className='headerGridItem'
          id={
            date.toLocaleDateString() === todaysDate.toLocaleDateString()
              ? 'today'
              : undefined
          }
          key={date}
        >
          {date.toLocaleDateString(undefined, { day: '2-digit' })}
        </h5>
      ))}
    </div>
  );
};

HeaderGrid.propTypes = {
  weekdates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  todaysDate: PropTypes.instanceOf(Date).isRequired,
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

const RightSide = ({ isAdmin }) => {
  const { user } = useUser();
   
  const { weekdates, gridItemTimes, todaysDate } = useCalendarContext();

  const {
    numVolunteers,
    isOpen,
    handleNumVolunteersButton,
    handleOptionsPopUp,
    optionsPopUpRef,
  } = useNumVolunteers();

  const {
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedCells,
    handleSave,
  } = useVolunteerCalendar({ numVolunteers: numVolunteers });

  const { canSave } = useSavedTimesContext();

  if (!user?.id) return <p>Loading...</p>;

  return (
    <div className='rightside'>
      <CalendarNav isAdmin={isAdmin} />
      <div className='rightMainSection'>
        <div className='timeContainer'>
          {/* numVolunteersContainer by itself takes up the space
              that the button would normally do if it was visible */}
          {isAdmin ? (
            <div className='numVolunteersContainer'></div>
          ) : (
            <NumVolunteers
              numVolunteers={numVolunteers}
              isOpen={isOpen}
              handleNumVolunteersButton={handleNumVolunteersButton}
              handleOptionsPopUp={handleOptionsPopUp}
              optionsPopUpRef={optionsPopUpRef}
            />
          )}
          <Times />
        </div>
        <div className='gridContainer'>
          <HeaderGrid weekdates={weekdates} todaysDate={todaysDate} />
          {isAdmin ? (
            <AdminCalendarGrid />
          ) : (
            <VolunteerCalendarGrid
              handleMouseDown={handleMouseDown}
              handleMouseEnter={handleMouseEnter}
              handleMouseUp={handleMouseUp}
              selectedCells={selectedCells}
              gridItemTimes={gridItemTimes}
            />
          )}
        </div>
      </div>
      {!isAdmin && <Save canSave={canSave} handleSave={handleSave} />}
    </div>
  );
};

RightSide.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default RightSide;
