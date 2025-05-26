import { useConfirmedTimesContext } from 'common/contexts/ConfirmedTimesContext';
import { useEffect, useState } from 'react';
import { useUser } from './UserContext';

export const useLeftLog = () => {
  const { confirmedTimes } = useConfirmedTimesContext();
  const [activityLog, setActivityLog] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const user_name = `${user.firstname} ${user.lastname}`;

    const logEntries = Array.from(confirmedTimes).map((session) => ({
      id: session.id,
      user: user_name || 'Unknown',
      action: session.status === 'cancelled' ? 'cancelled' : 'created',
      start: new Date(session.start),
      end: new Date(session.end),
    }));

    setActivityLog(logEntries);
  }, [confirmedTimes]);

  return activityLog;
};