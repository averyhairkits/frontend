import React from 'react';

import { Icon } from 'assets/icons/icons';
import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useAdminCalendarGrid } from 'pages/home/right/useAdminCalendarGrid';

import './AdminHome.css';

export const AdminCalendarGrid = () => {
  const { gridItemTimes } = useCalendarContext();
  const {
    handleMouseUp,
    canSave,
    handleMouseDown,
    handleMouseMove,
    eventData,
    getSelectionStyle,
    handleCancel,
    isEditing,
    getPopUpStyle,
    handleSave,
    filteredConfirmedTimes,
    getEventTime,
    getEventDate,
    handleChangeTitle,
    handleChangeDescription,
  } = useAdminCalendarGrid();

  const renderEventPopup = (eventData) => (
    <div className='popUp' style={getPopUpStyle(eventData)}>
      <div className='cancelSave'>
        <button className='cancel' onClick={handleCancel}>
          Cancel
        </button>
        <button className='save' onClick={handleSave}>
          Save
        </button>
      </div>
      <input
        className='titleInput'
        type='text'
        placeholder='Add Title...'
        value={eventData.title}
        onChange={handleChangeTitle}
      />
      <div className='item'>
        <Icon.Clock className='icon' />
        <p>{`${getEventDate(eventData, true)}, 
        ${getEventDate(eventData, false)}, 
        ${getEventTime(eventData.startRow)}-
        ${getEventTime(eventData.endRow)}`}</p>
      </div>
      <div className='item'>
        <Icon.Map className='icon' />
        <p>2020 Greenwood Avenue, Evanston, IL 60201</p>
      </div>
      <div className='item'>
        <Icon.Pen className='icon' />
        <p>Description (Optional)</p>
      </div>
      <textarea
        className='description'
        placeholder='Add description...'
        value={eventData.description}
        onChange={handleChangeDescription}
      />
    </div>
  );

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      style={{ pointerEvents: canSave ? 'none' : 'auto' }}
    >
      <div className='calendarGridMask'>
        {gridItemTimes.map((_, i) => (
          <div
            key={i}
            className={`${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'}`}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseMove(i)}
            style={{
              backgroundColor: `var(--sign-up-fill-${gridItemTimes[i].numRegistered})`,
            }}
          />
        ))}
      </div>

      {/* Previously confirmed events */}
      {filteredConfirmedTimes.map((session, i) => {
        const aSelection = {
          startRow:
            (session.start.getHours() - 9) * 2 +
            (session.start.getMinutes() === 0 ? 0 : 1),
          endRow:
            (session.end.getHours() - 9) * 2 +
            (session.end.getMinutes() === 0 ? 0 : 1),
          col: session.start.getDay() === 0 ? 6 : session.start.getDay() - 1,
        };

        return (
          <div key={i} className='event' style={getSelectionStyle(aSelection)}>
            <div className='content'>
              <h1>{session.title || 'New Event'}</h1>
              <h2>
                {getEventTime(aSelection.startRow)}-
                {getEventTime(aSelection.endRow)}
              </h2>
              <h3>{session.description}</h3>
              <div className='numVolunteersContainer'>
                <Icon.User width='24px' />
                <h4>{session.volunteers.length}</h4>
              </div>
            </div>
          </div>
        );
      })}

      {/* New event or editing existing event */}
      {(eventData.startRow !== null || canSave) && (
        <div className='event' style={getSelectionStyle(eventData)}>
          <div className='content'>
            <h1>{eventData.title || '(New Event)'}</h1>
            <h2>
              {getEventTime(eventData.startRow)}-
              {getEventTime(eventData.endRow)}
            </h2>
            <div className='numVolunteersContainer'>
              <Icon.User width='24px' />
              <h4>{eventData.volunteers.length}</h4>
            </div>
          </div>
          {isEditing && renderEventPopup(eventData)}
        </div>
      )}
    </div>
  );
};

AdminCalendarGrid.propTypes = {
  gridItemTimes: PropTypes.array.isRequired,
};
