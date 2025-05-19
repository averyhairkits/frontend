import { useEffect, useState } from 'react';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useConfirmedTimesContext } from 'common/contexts/ConfirmedTimesContext';

import { useUser } from 'common/contexts/UserContext';
import { useEventEditor } from './useEventEditor';
export const useAdminCalendarGrid = () => {
  const { eventData, isEditing, setIsEditing, ...eventEditor } =
    useEventEditor();
  const [canSave, setCanSave] = useState(false);
  const [selectedSessionToDelete, setSelectedSessionToDelete] = useState(null);

  const { confirmedTimes, setConfirmedTimes } = useConfirmedTimesContext();
  const { weekdates, gridItemTimes } = useCalendarContext();
  const { user } = useUser();

  const buildUrl = (endpoint) =>
    `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;


  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(buildUrl(`/admin/get_sessions?user_id=${user.id}`));
        const data = await res.json();

        if (!res.ok) {
          console.error('Failed to fetch sessions:', data.error || 'Unknown error');
          return;
        }
        console.log("data here", data);
        // Assume each session has id, title, start, end, description, status
        if (data){

        }
        const parsed = data.sessions.map((s) => ({
          ...s,
          start: new Date(s.start),
          end: new Date(s.end),
          volunteers: s.volunteers || [], // fallback
        }));

        setConfirmedTimes(new Set(parsed));
      } catch (err) {
        console.error('Fetch sessions network error:', err);
      }
    };

    fetchSessions();
  }, [user?.id]);


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

    const localToUTCISO = (date) => {
      const offsetMs = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offsetMs);
    };

    const newConfirmedTime = {
      title,
      start: localToUTCISO(gridItemTimes[getIndex(minRow, col)].start),
      end: localToUTCISO(gridItemTimes[getIndex(maxRow, col)].end),
      description,
      volunteers,
      created_by: user.id,
    };

    // const newConfirmedTime = {
    //   title: title,
    //   start: gridItemTimes[getIndex(minRow, col)].start,
    //   end: gridItemTimes[getIndex(maxRow, col)].end,
    //   description: description,
    //   volunteers: volunteers,
    //   created_by: user.id,
    // };

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
      if (!result.session) {
        console.error('No session ID returned from backend');
        return;
      }
      const confirmedSessionWithId = { ...newConfirmedTime, id: result.session };
      const newConfirmedTimes = new Set([...confirmedTimes, confirmedSessionWithId]);
      setConfirmedTimes(newConfirmedTimes);
      console.log("NEW CONFIRMED TIMES HERE", newConfirmedTimes);

    } catch (error) {
      console.error('Network error:', error);
    }

    eventEditor.resetEvent();
    setCanSave(false);
  };

  const getEventTime = (row, isStart) => {
  const timeBlock = gridItemTimes[getIndex(row, 0)];
  if (!timeBlock) return '--:--';

  if (isStart) {
    if (!timeBlock.start) return '--:--';
    return timeBlock.start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    if (!timeBlock.end) return '--:--';
    return timeBlock.end.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
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


  const handleSessionClick = (session) => {
    setSelectedSessionToDelete(session);
  };



 const confirmDelete = async () => {
  if (!selectedSessionToDelete?.id) return;

  try {
    const response = await fetch(
      buildUrl(`/admin/cancel_request/${selectedSessionToDelete.id}`),
      { method: 'PUT' }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to cancel session:', error);
      return;
    }

    // update the local confirmedTimes set with the cancelled status
    const updated = new Set(
      Array.from(confirmedTimes).map((session) =>
        session.id === selectedSessionToDelete.id
          ? { ...session, status: 'cancelled' }
          : session
      )
    );
    setConfirmedTimes(updated);
    setSelectedSessionToDelete(null);
  } catch (err) {
    console.error('Cancel network error:', err);
  }
};

const cancelDelete = () => {
  setSelectedSessionToDelete(null);
};


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
    handleSessionClick,
    confirmDelete,
    cancelDelete,
    selectedSessionToDelete,
  };
};
