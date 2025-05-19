import { useEffect, useState } from 'react';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useConfirmedTimesContext } from 'common/contexts/ConfirmedTimesContext';

import { useEventEditor } from './useEventEditor';

export const useAdminCalendarGrid = () => {
  const { eventData, isEditing, setIsEditing, ...eventEditor } =
    useEventEditor();
  const [canSave, setCanSave] = useState(false);

  const { confirmedTimes, setConfirmedTimes } = useConfirmedTimesContext();
  const { weekdates, gridItemTimes } = useCalendarContext();

  const buildUrl = (endpoint) =>
    `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

  // Convert grid index to row and column
  const getGridPosition = (i) => {
    const col = Math.floor(i / 20);
    const row = i % 20;
    return { row, col };
  };

  const getIndex = (row, col) => col * 20 + row;

  // only get confirmed times in the current week
  const filteredConfirmedTimes = Array.from(confirmedTimes).filter(
    (confirmedTime) =>
      weekdates.some(
        (weekdate) =>
          confirmedTime.start.toDateString() === weekdate.toDateString()
      )
  );

  const dateToRowCol = (date) => {
    const selection = {
      startRow:
        (date.start.getHours() - 9) * 2 +
        (date.start.getMinutes() === 0 ? 0 : 1),
      endRow:
        (date.end.getHours() - 9) * 2 +
        (date.end.getMinutes() === 0 ? 0 : 1) -
        1, // -1 to stop at end of last row
      col: date.start.getDay() === 0 ? 6 : date.start.getDay() - 1,
    };

    return selection;
  };

  const handleMouseDown = (i) => {
    const { row, col } = getGridPosition(i);
    eventEditor.setSelection({
      startRow: row,
      endRow: row,
      col,
    });
  };

  const handleMouseMove = (i) => {
    if (eventData.startRow === null) return;
    const { row } = getGridPosition(i);
    eventEditor.setSelection({ endRow: row });
  };

  const handleMouseUp = () => {
    eventData.startRow !== null && setCanSave(true);
    const minRow = Math.min(eventData.startRow, eventData.endRow);
    const maxRow = Math.max(eventData.startRow, eventData.endRow);

    const hasOverlap = filteredConfirmedTimes.some((confirmedTime) => {
      const confirmedSelection = dateToRowCol(confirmedTime);

      return (
        confirmedSelection.col === eventData.col &&
        confirmedSelection.startRow <= maxRow &&
        confirmedSelection.endRow >= minRow
      );
    });

    hasOverlap ? handleCancel() : setIsEditing(true);
  };

  const getSelectionStyle = ({ startRow, endRow, col }) => {
    if (startRow === null || col === null) return null;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    return {
      left: `calc(${(100 / 7) * col}%)`,
      width: `calc(${100 / 7}%)`,
      top: `calc(${(100 / 20) * minRow}%)`,
      height: `calc(${(100 / 20) * (maxRow === minRow ? 1 : 1 + maxRow - minRow)}%)`,
    };
  };

  const getPopUpStyle = ({ col, startRow, endRow }) => {
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    return {
      boxShadow: `${col <= 3 ? '2px' : '-2px'} 2px 4px 0 var(--medium-gray)`,
      left: col <= 3 ? '110%' : 'auto',
      right: col > 3 ? '110%' : 'auto',
      top: minRow <= 3 ? '0%' : maxRow >= 17 ? 'auto' : '-5vh',
      bottom: maxRow >= 17 ? '0%' : 'auto',
    };
  };

  const handleCancel = () => {
    eventEditor.resetEvent();
    setCanSave(false);
  };

  const handleSave = async () => {
    const { title, description, startRow, endRow, col, volunteers } = eventData;
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    const newConfirmedTime = {
      title: title,
      start: gridItemTimes[getIndex(minRow, col)].start,
      end: gridItemTimes[getIndex(maxRow, col)].end,
      description: description,
      volunteers: volunteers,
    };

    const newConfirmedTimes = new Set([...confirmedTimes, newConfirmedTime]);
    setConfirmedTimes(newConfirmedTimes);
    console.log("here are new confirmed times", newConfirmedTimes);

    try {
      const response = await fetch(buildUrl('/admin/approve_request'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newConfirmedTime),
        });
      if (!response.ok) {
        const error = await response.json();
        console.error('Request failed:', error);
        return;
      }
      const result = await response.json();
      console.log('Successfully sent admin approve to backend:', result);
    } catch (error) {
      console.error('Network error:', error);
    }

    eventEditor.resetEvent();
    setCanSave(false);
  };

  const getEventTime = (row, isStart) => {
    if (isStart) {
      return gridItemTimes[getIndex(row, 0)].start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return gridItemTimes[getIndex(row, 0)].end.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventDate = (s, isDate) => {
    return weekdates[s.col].toLocaleDateString(
      'en-US',
      isDate ? { month: '2-digit', day: '2-digit' } : { weekday: 'long' }
    );
  };

  useEffect(() => {
    console.log('event (start row, end row, column): ', eventData);
  }, [eventData]);

  useEffect(() => {
    console.log('Can Save: ', canSave);
  }, [canSave]);

  // edit event pop up
  useEffect(() => {
    console.log(`edit event pop up ${isEditing ? 'opened' : 'closed'}`);
  }, [isEditing]);

  useEffect(() => {
    console.log('Confirmed Times: ', confirmedTimes);
  }, [confirmedTimes]);

  return {
    handleMouseUp,
    canSave,
    dateToRowCol,
    handleMouseDown,
    handleMouseMove,
    eventData,
    getSelectionStyle,
    isEditing,
    handleCancel,
    getPopUpStyle,
    handleSave,
    filteredConfirmedTimes,
    getEventTime,
    getEventDate,
    handleChangeTitle: eventEditor.handleChangeTitle,
    handleChangeDescription: eventEditor.handleChangeDescription,
  };
};
