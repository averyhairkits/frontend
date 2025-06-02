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
  const [predictedVolunteers, setPredictedVolunteers] = useState([]);

  const { confirmedTimes, setConfirmedTimes } = useConfirmedTimesContext();
  const { weekdates, gridItemTimes } = useCalendarContext();
  const [loadingSessions, setLoadingSessions] = useState(true);
  const { user } = useUser();

  const buildUrl = (endpoint) =>
    `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

  useEffect(() => {
    if (!user?.id) return;

    const fetchSessions = async () => {
      setLoadingSessions(true);
      try {
        const res = await fetch(buildUrl(`/admin/get_sessions`));
        const data = await res.json();

        if (!res.ok) {
          console.error(
            'Failed to fetch sessions:',
            data.error || 'Unknown error'
          );
          return;
        }
        console.log('admin fetched session here', data);
        //assume each session has id, title, start, end, description, status
        const parsed = data.sessions.map((s) => ({
          ...s,
          start: new Date(s.start.replace(' ', 'T')), //convert 'YYYY-MM-DD HH:MM:SS' → 'YYYY-MM-DDTHH:MM:SS'
          end: new Date(s.end.replace(' ', 'T')),
          current_size: s.volunteer_count || 0,
          volunteers: s.volunteers || [], // fallback
          created_by_name: s.created_by_user
            ? `${s.created_by_user.firstname} ${s.created_by_user.lastname}`
            : 'Unknown',
        }));

        setConfirmedTimes(new Set(parsed));
      } catch (err) {
        console.error('Fetch sessions network error:', err);
      } finally {
        setLoadingSessions(false); // after all
      }
    };

    fetchSessions();
  }, [user?.id]);

  const getStartEndTimesFromEvent = ({ startRow, endRow, col }) => {
    if (startRow === null || endRow === null || col === null)
      return { start: null, end: null };

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    const start = gridItemTimes[getIndex(minRow, col)]?.start || null;
    const end = gridItemTimes[getIndex(maxRow, col)]?.end || null;

    return { start, end };
  };

  useEffect(() => {
    const fetchPredictedVolunteers = async () => {
      const { start, end } = getStartEndTimesFromEvent(eventData);

      if (!start || !end) return;

      try {
        const res = await fetch(
          buildUrl(
            `/admin/match_volunteers?start=${encodeURIComponent(formatLocalDateTimeForDB(start))}&end=${encodeURIComponent(formatLocalDateTimeForDB(end))}`
          )
        );
        const data = await res.json();

        if (!res.ok) {
          console.error(
            'Failed to fetch predicted volunteers:',
            data.error || 'Unknown error'
          );
          return;
        }
        console.log('here is fetched predicted volunteers data', data);
        console.log('here are attending volunteers:', data.volunteers);

        setPredictedVolunteers({
          current_size: data.current_size,
          volunteers: data.volunteers,
        });
      } catch (err) {
        console.error('Volunteer match fetch error:', err);
      }
    };

    fetchPredictedVolunteers();
  }, [eventData.startRow, eventData.endRow, eventData.col]);

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
      if (confirmedTime.status === 'cancelled') return false;

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

  const formatLocalDateTimeForDB = (date) => {
    if (!date || !(date instanceof Date)) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSave = async () => {
    if (!user?.id) {
      return;
    }

    const { title, description } = eventData;
    const { start, end } = getStartEndTimesFromEvent(eventData);
    if (!start || !end) return;

    const newConfirmedTime = {
      title,
      start: formatLocalDateTimeForDB(start),
      end: formatLocalDateTimeForDB(end),
      description,
      created_by: user.id,
      volunteers: predictedVolunteers.volunteers || [],
      current_size: predictedVolunteers.current_size || 0,
    };

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

      const confirmedSessionWithId = {
        id: result.session.id,
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        created_by: user.id,
        volunteers: predictedVolunteers.volunteers || [],
        current_size: predictedVolunteers.current_size || 0,
        status: 'confirmed',
      };

      const newConfirmedTimes = new Set([
        ...confirmedTimes,
        confirmedSessionWithId,
      ]);
      setConfirmedTimes(newConfirmedTimes);
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
    if (typeof session.id !== 'string') {
    console.log('Invalid session.id:', typeof session.id);
    return;
  }
    setSelectedSessionToDelete(session);
  };

  const confirmDelete = async () => {
    if (!selectedSessionToDelete?.id) return;

    try {
      const response = await fetch(
        buildUrl(`/admin/cancel_request/${String(selectedSessionToDelete?.id)}`),
        { method: 'PUT' }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to cancel session:', error);
        return;
      }

      const updatedArray = Array.from(confirmedTimes).map((session) =>
        session.id === selectedSessionToDelete.id
          ? { ...session, status: 'cancelled' }
          : session
      );

      // Check if anything actually changed
      let changed = false;
      const confirmedArray = Array.from(confirmedTimes);
      for (let i = 0; i < confirmedArray.length; i++) {
        if (confirmedArray[i].status !== updatedArray[i].status) {
          changed = true;
          break;
      } }

      // Only update if changed
      if (changed) {
        setConfirmedTimes(new Set(updatedArray));
      }
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
    predictedVolunteers,
    loadingSessions,
  };
};
