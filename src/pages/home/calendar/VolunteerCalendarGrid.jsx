import React from 'react';

import PropTypes from 'prop-types';

import confirmedTimes from 'pages/home/calendar/confirmedTimes';
import fullTimes from 'pages/home/calendar/fullTimes';

export const VolunteerCalendarGrid = ({
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  selectedCells,
  gridItemTimes,
}) => {
  const gridItems = Array.from({ length: 140 });

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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

VolunteerCalendarGrid.propTypes = {
  handleMouseDown: PropTypes.func.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseUp: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectedCells: PropTypes.instanceOf(Set).isRequired,
  gridItemTimes: PropTypes.instanceOf(Array).isRequired,
  savedTimes: PropTypes.instanceOf(Set).isRequired,
};
