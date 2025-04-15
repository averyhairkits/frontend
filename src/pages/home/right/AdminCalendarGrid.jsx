import React from 'react';

import { Icon } from 'assets/icons/icons';
import PropTypes from 'prop-types';

import { useAdminCalendarGrid } from 'pages/home/right/useAdminCalendarGrid';

import './AdminHome.css';

export const AdminCalendarGrid = () => {
  const gridItems = Array.from({ length: 140 });

  const {
    handleMouseUp,
    canSave,
    handleMouseDown,
    handleMouseMove,
    selection,
    getSelectionStyle,
    handleCancel,
    isEditing,
    getPopUpStyle,
    handleSave,
    filteredConfirmedTimes,
    getEventTime,
  } = useAdminCalendarGrid();

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      style={{ pointerEvents: canSave ? 'none' : 'auto' }}
    >
      <div className='calendarGridMask'>
        {/* ^^ disable any more selections after one has been made (save is enabled) */}
        {gridItems.map((_, i) => {
          // remains constant regardless of selections
          const itemType = `${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'}`;

          return (
            <div
              key={i}
              // only shows confirmed session if a confirmed cell is selected
              className={`${itemType}`}
              onMouseDown={() => handleMouseDown(i)}
              onMouseEnter={() => handleMouseMove(i)}
              onMouseUp={handleMouseUp}
            ></div>
          );
        })}
      </div>

      {/* previously confirmed events */}
      {filteredConfirmedTimes.map((session, i) => {
        const aSelection = {
          startRow:
            (session.start.getHours() - 9) * 2 +
            (session.start.getMinutes() === 0 ? 0 : 1), // add one row for half hour
          endRow:
            (session.end.getHours() - 9) * 2 +
            (session.end.getMinutes() === 0 ? 0 : 1),
          col: session.start.getDay() === 0 ? 6 : session.start.getDay() - 1,
          // sunday's are 0 in getDay(), but are at the last column here
        };

        return (
          <div
            key={i}
            className='event'
            style={getSelectionStyle(aSelection)}
            // canSave ? retrieve selectionStyle that's already been assigned,
            // otherwise retrieve current style from current selection
          >
            <div className='content'>
              <h1>Hair Kit Packing Session</h1>
              <h2>
                {getEventTime(aSelection.startRow)}-
                {getEventTime(aSelection.endRow)}
              </h2>
              <h3>{session.description}</h3>
              <div className='numVolunteersContainer'>
                <Icon.User width='24px'></Icon.User>
                <h4>{session.volunteers.length}</h4>
              </div>
            </div>
          </div>
        );
      })}

      {/* Define event differently when its dragging and when its done dragging (mouseUp) */}
      {(selection.startRow !== null || canSave) && (
        <div
          className='event'
          style={getSelectionStyle(selection)}
          // canSave ? retrieve selectionStyle that's already been assigned,
          // otherwise retrieve current style from current selection
        >
          <div className='content'>
            <h1>(New Event)</h1>
            <h2>
              {getEventTime(selection.startRow)}-
              {getEventTime(selection.endRow)}
            </h2>
            <div className='numVolunteersContainer'>
              <Icon.User width='24px'></Icon.User>
              <h4>0</h4>
            </div>
          </div>
          {isEditing && (
            <div className='popUp' style={getPopUpStyle(selection)}>
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

AdminCalendarGrid.propTypes = {
  gridItemTimes: PropTypes.array.isRequired,
};
