import { useEffect, useState } from 'react';

const [activityLog, setActivityLog] = useState([]);

useEffect(() => {
  const logEntries = Array.from(confirmedTimes).map((session) => {
    return {
      id: session.id,
      user: session.created_by_name || 'Unknown',
      action: session.status === 'cancelled' ? 'cancelled' : 'created',
      start: session.start,
      end: session.end,
    };
  });

  setActivityLog(logEntries);
}, [confirmedTimes]);
