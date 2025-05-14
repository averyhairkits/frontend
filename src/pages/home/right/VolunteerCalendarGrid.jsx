import React from 'react';

import PropTypes from 'prop-types';

import confirmedTimes from 'pages/home/right/confirmedTimes';

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

        // const isFull = fullTimes.some(
        //   (d) => d.getTime() === gridItemTimes[i].start.getTime()
        // );

        const isOverbooked = gridItemTimes[i]?.isOverbooked;

        // remains constant regardless of selections
        // const itemType = `${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'} ${isFull ? 'full' : ''}`;

        const itemType = `${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'} 
        ${isOverbooked ? 'overbooked' : ''}`.trim();

        const size = Math.min(gridItemTimes[i].size, 5);
        const isSelected = selectedCells.has(i);
        const backgroundColor =
          !isSelected && size > 0
            ? `var(--sign-up-fill-${size})`
            : undefined;

        return (
          <div
            key={i}
            className={`${itemType} ${selectedCells.has(i) && isConfirmedSession ? 'confirmed' : selectedCells.has(i) ? `selected${selectedCells.get(i)}` : ''}`}
            onMouseDown={() => !isOverbooked && handleMouseDown(i)}
            onMouseEnter={() => !isOverbooked && handleMouseEnter(i)}
            style={{ backgroundColor }}
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
  selectedCells: PropTypes.instanceOf(Map).isRequired,
  gridItemTimes: PropTypes.array.isRequired,
  numVolunteers: PropTypes.number.isRequired,
};
