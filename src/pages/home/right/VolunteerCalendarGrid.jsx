import React from 'react';

import PropTypes from 'prop-types';

import confirmedTimes from 'pages/home/right/confirmedTimes';
import fullTimes from 'pages/home/right/fullTimes';

export const VolunteerCalendarGrid = ({
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  selectedCells,
  gridItemTimes,
}) => {
  const gridItems = Array.from({ length: 140 });
  let hasStarted = false;

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ overflow: 'hidden' }} // differ from admin calendarGrid
    >

      {gridItems.map((_, i) => {
        if (!gridItemTimes[i] || !gridItemTimes[i].start) {
          console.log("gridItemsTimes not found");
          return false;
        }

        const isConfirmedSession = Array.from(confirmedTimes).some((d) => {
          if (d.end.getTime() === gridItemTimes[i].start.getTime()) {
            hasStarted = false;
            return true;
          }
          if (d.start.getTime() === gridItemTimes[i].start.getTime()) {
            hasStarted = true;
            return true;
          }
          if (hasStarted) {
            return true;
          }
          return false;
        });

        const isFull = fullTimes.some(
          (d) => d.getTime() === gridItemTimes[i].start.getTime()
        );

        // remains constant regardless of selections
        const itemType = `${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'} ${isFull ? 'full' : ''}`;

        return (
          <div
            key={i}
            // only shows confirmed session if a confirmed cell is selected
            className={`${itemType} ${selectedCells.has(i) && isConfirmedSession ? 'confirmed' : selectedCells.has(i) ? `selected${selectedCells.get(i)}` : ''}`}
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
  gridItemTimes: PropTypes.array.isRequired,
  numVolunteers: PropTypes.number.isRequired,
};
