import React from 'react';
import { useAdminCalendarGrid } from 'pages/home/calendar/useAdminCalendarGrid';

export const AdminCalendarGrid = ({ gridItemTimes }) => {
  const gridItems = Array.from({ length: 140 });

  const { handleMouseUp,
    handleMouseLeave,
    canSave,
    handleMouseDown,
    handleMouseMove,
    selection,
    selectionStyle,
    getSelectionStyle } = useAdminCalendarGrid({ gridItemTimes });
  

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: canSave ? 'none' : 'auto' }}
    >
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

      {/* Define event differently when its dragging and when its done dragging (mouseUp) */}
      {(selection.startRow !== null || canSave) && (
        <div className='event' style={canSave ? selectionStyle : getSelectionStyle(selection)} />
      )}
    </div>
  );
};
