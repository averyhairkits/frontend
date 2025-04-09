import React, { useState } from 'react';

import confirmedTimes from 'pages/home/calendar/confirmedTimes';

export const AdminCalendarGrid = ({ selectedCells, gridItemTimes }) => {
  const [selection, setSelection] = useState({
    startRow: null,
    endRow: null,
    col: null,
  });

  const gridItems = Array.from({ length: 140 });

  // Convert grid index to row and column
  const getGridPosition = (i) => {
    const col = Math.floor(i / 20);
    const row = i % 20;
    return { row, col };
  };

  const handleMouseDown = (i) => {
    const { row, col } = getGridPosition(i);
    setSelection({
      startRow: row,
      endRow: row,
      col,
    });
  };

  const handleMouseMove = (i) => {
    if (selection.startRow === null) return;
    const { row } = getGridPosition(i);
    setSelection((prev) => ({ ...prev, endRow: row }));
  };

  const handleMouseUp = () => {
    setSelection({ col: null, endRow: null, startRow: null });
  };

  // Calculate selection box style
  const getSelectionStyle = () => {
    const { startRow, endRow, col } = selection;
    if (startRow === null || col === null) return null;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    return {
      left: `calc(${(100 / 7) * col}% + 1px)`, // Account for 1px gap
      width: `calc(${100 / 7}% - 2px)`, // Subtract 2px for gaps
      top: `calc(${(100 / 20) * minRow}% + 1px)`, // 20 rows
      height: `calc(${(100 / 20) * (maxRow - minRow + 1)}% - 2px)`,
      // does not work properly when put in .css file
      backgroundColor: '#b300ea30',
      border: '1px solid #b300ea80',
    };
  };

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

        // remains constant regardless of selections
        const itemType = `${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'}`;

        return (
          <div
            key={i}
            // only shows confirmed session if a confirmed cell is selected
            className={`${itemType} ${selectedCells.has(i) && isConfirmedSession ? 'confirmed' : selectedCells.has(i) ? 'selected' : ''}`}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseMove(i)}
            onMouseUp={handleMouseUp}
          ></div>
        );
      })}

      {/* Floating selection box */}
      {selection.startRow !== null && (
        <div className='draggingBox' style={getSelectionStyle()} />
      )}
    </div>
  );
};
