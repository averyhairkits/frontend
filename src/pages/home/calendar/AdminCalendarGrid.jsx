import React, { useState, useEffect } from 'react';

export const AdminCalendarGrid = ({ gridItemTimes }) => {
  const [selection, setSelection] = useState({
    startRow: null,
    endRow: null,
    col: null,
  });
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [canSave, setCanSave] = useState(false);
  const [selectionStyle, setSelectionStyle] = useState();

  const gridItems = Array.from({ length: 140 });

  // Convert grid index to row and column
  const getGridPosition = (i) => {
    const col = Math.floor(i / 20);
    const row = i % 20;
    return { row, col };
  };

  const toggleSelection = (i) => {
    const {row} = getGridPosition(i);
    
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      const { startRow, endRow, col } = selection;
      // if select direction switches
      if ((endRow > row && startRow < endRow) ||
          (endRow < row && startRow > endRow)) {
        const startOverSet = new Set();
        // convert row, col to grid index
        startOverSet.add(col*20 + startRow);
        return startOverSet;
      }
      if (!newSet.has(col*20 + row)) {
        newSet.add(col*20 + row);
      }
      return newSet;
    });
  };

  useEffect(() => {
    console.log(selection.endRow);
  }, [selection.endRow])

  const handleMouseDown = (i) => {

    const { row, col } = getGridPosition(i);
    toggleSelection(i);
    setSelection({
      startRow: row,
      endRow: row,
      col,
    });
  
  };

  const handleMouseMove = (i) => {
    if (selection.startRow === null) return;
    console.log('canSave:', canSave);
    const { row } = getGridPosition(i);
    toggleSelection(i);
    setSelection((prev) => ({ ...prev, endRow: row }));
  };

  const handleMouseUp = () => {
    setCanSave(true);
    setSelectionStyle(getSelectionStyle(selection));
    setSelection({ col: null, endRow: null, startRow: null });
  };

  const handleLeave = () => {
    setSelection({ col: null, endRow: null, startRow: null });
  }

  useEffect(() => {
    console.log(canSave);
  }, [canSave]);

  useEffect(() => {
    console.log('selectedCells: ', selectedCells);
  }, [selectedCells]);

  // Calculate selection box style
  const getSelectionStyle = (selection) => {
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
        <div className='unsavedEvent' style={canSave ? selectionStyle : getSelectionStyle(selection)} />
      )}
    </div>
  );
};
