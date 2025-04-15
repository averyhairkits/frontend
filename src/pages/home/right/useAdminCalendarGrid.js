import { useEffect, useState } from 'react';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useConfirmedTimesContext } from 'common/contexts/ConfirmedTimesContext';

// keeping gridItemTimes input for when events are mapped to actual dates
export const useAdminCalendarGrid = () => {
  const [selection, setSelection] = useState({
    startRow: null,
    endRow: null,
    col: null,
  });

  const [canSave, setCanSave] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const { confirmedTimes, setConfirmedTimes } = useConfirmedTimesContext();
  const { weekdates, gridItemTimes } = useCalendarContext();

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
    setIsEditing(true);
  };

  useEffect(() => {
    console.log('selection (start row, end row, column): ', selection);
  }, [selection]);

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
      width: `calc(${100 / 7}%)`,
      top: `calc(${(100 / 20) * minRow}%)`,
      height: `calc(${(100 / 20) * (maxRow - minRow + 1)}%)`,
    };
  };

  const getPopUpStyle = (selection) => {
    const { startRow, endRow, col } = selection;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    return {
      boxShadow: `${col <= 3 ? '2px' : '-2px'} 2px 4px 0 var(--medium-gray)`,
      // position of pop up depends on location of its event
      left: col <= 3 ? '10vw' : 'auto',
      right: col > 3 ? '10vw' : 'auto',
      top: minRow <= 3 ? '0%' : maxRow >= 17 ? 'auto' : '-5vh',
      bottom: maxRow >= 17 ? '0%' : 'auto',
    };
  };

  // edit event pop up
  useEffect(() => {
    console.log(`edit event pop up ${isEditing ? 'opened' : 'closed'}`);
  }, [isEditing]);

  const handleCancel = () => {
    setIsEditing(false);
    setCanSave(false);
    setSelection({ col: null, endRow: null, startRow: null });
  };

  const handleSave = () => {
    setCanSave(true);
    setSelection({ col: null, endRow: null, startRow: null });
  };

  return {
    handleMouseUp,
    canSave,
    handleMouseDown,
    handleMouseMove,
    selection,
    getSelectionStyle,
    isEditing,
    handleCancel,
    getPopUpStyle,
    handleSave,
  };
};
