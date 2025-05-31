import React from 'react';

import PropTypes from 'prop-types';

import { useConfirmedTimesContext } from 'common/contexts/ConfirmedTimesContext';

export const VolunteerCalendarGrid = ({
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  selectedCells,
  gridItemTimes,
}) => {
  const gridItems = Array.from({ length: 140 });
  const { confirmedTimes } = useConfirmedTimesContext();
  //let hasStarted = false;

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ overflow: 'hidden' }} // differ from admin calendarGrid
    >
      {gridItems.map((_, i) => {
        if (!gridItemTimes[i] || !gridItemTimes[i].start) {
          console.log('gridItemsTimes not found');
          return false;
        }

        const isConfirmedSession = Array.from(confirmedTimes).some((session) => {
          const sessionStart = new Date(session.start).getTime();
          const sessionEnd = new Date(session.end).getTime();
          const cellStart = gridItemTimes[i].start.getTime();
          return cellStart >= sessionStart && cellStart < sessionEnd;
        });


        const itemType =
          `${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'}`.trim();

        const size = Math.min(gridItemTimes[i].size, 5);
        const isSelected = selectedCells.has(i);
        const backgroundColor =
          !isSelected && size > 0 ? `var(--sign-up-fill-${size})` : undefined;

        return (
          <div
            key={i}
            className={`${itemType} ${
              selectedCells.has(i)
                ? isConfirmedSession
                  ? `confirmed selected${selectedCells.get(i)}`
                  : `selected${selectedCells.get(i)}`
                : isConfirmedSession
                ? 'confirmed'
                : ''
            }`}

            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            style={{
              backgroundColor: !isConfirmedSession && !isSelected && size > 0
                ? `var(--sign-up-fill-${size})`
                : undefined,
              pointerEvents: isConfirmedSession ? 'none' : 'auto',
            }}

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
