import React, { useState, useEffect } from 'react';

export const AdminCalendarGrid = ({ gridItemTimes }) => {
  const [selection, setSelection] = useState({
    startRow: null,
    endRow: null,
    col: null,
  });

  const [canSave, setCanSave] = useState(false);
  const [selectionStyle, setSelectionStyle] = useState();

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

  // right now, the event box doesn't become shorter unless you drag outside of selection.col
  // ^ likely because the box is above the grid, so it blocks the pointer events
  // it could be changed to have the box become longer and shorter based on the cursor's y-coor,
  // then snap the final length to the nearest grid row, but it may be fine to leave as is
  const handleMouseMove = (i) => {
    if (selection.startRow === null) return;
    console.log('canSave:', canSave);
    const { row } = getGridPosition(i);
    setSelection((prev) => ({ ...prev, endRow: row }));
  };

  const handleMouseUp = () => {
    // the condition is needed to prevent setting canSave to true if user clicks, 
    // drags outside of grid, then drags back inside (on the same click and drag)
    selection.startRow !== null && setCanSave(true);
    setSelectionStyle(getSelectionStyle(selection));
    setSelection({ col: null, endRow: null, startRow: null });
  };

  const handleLeave = () => {
    setSelection({ col: null, endRow: null, startRow: null });
  }

  useEffect(() => {
    console.log('selection (start row, end row, column): ', selection);
  }, [selection])

  useEffect(() => {
    console.log('Can Save: ', canSave);
  }, [canSave]);

  // Calculate selection box style
  const getSelectionStyle = (selection) => {
    const { startRow, endRow, col } = selection;
    if (startRow === null || col === null) return null;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    return {
      left: `calc(${(100 / 7) * col}%)`,
      width: `calc(${100 / 7}%)`, // Subtract 1px for border gap
      top: `calc(${(100 / 20) * minRow}%)`, 
      height: `calc(${(100 / 20) * (maxRow - minRow + 1)}%)`,
    };
  };

  return (
    <div
      className='calendarGrid'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleLeave}
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
