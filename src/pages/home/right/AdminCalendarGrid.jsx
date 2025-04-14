import React from 'react';

import { Icon } from 'assets/icons/icons';
import PropTypes from 'prop-types';

import { useAdminCalendarGrid } from 'pages/home/right/useAdminCalendarGrid';

import './AdminHome.css';

export const AdminCalendarGrid = ({ gridItemTimes }) => {
  const gridItems = Array.from({ length: 140 });

  const {
    handleMouseUp,
    handleMouseLeave,
    canSave,
    handleMouseDown,
    handleMouseMove,
    selection,
    selectionStyle,
    getSelectionStyle,
    handleCancel,
    isEditing,
    popUpStyle,
  } = useAdminCalendarGrid({ gridItemTimes });

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
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

      {/* Define event differently when its dragging and when its done dragging (mouseUp) */}
      {(selection.startRow !== null || canSave) && (
        <div
          className='event'
          style={canSave ? selectionStyle : getSelectionStyle(selection)}
          // canSave ? retrieve selectionStyle that's already been assigned, otherwise retrieve current style from current selection
        >
          <div className='content'>
            <h1>Hair Kit Packing Session</h1>
            <h2>12:00 pm - 03:00 pm</h2>
            <h3>Lorem ipsum dolor amet, consectetur adipiscing elit.</h3>
            <div className='numVolunteersContainer'>
              <Icon.User width='24px'></Icon.User>
              <h4>3</h4>
            </div>
          </div>
          {isEditing && (
            <div className='popUp' style={popUpStyle}>
              <button onClick={handleCancel}>Cancel</button>
              <button>Save</button>
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
