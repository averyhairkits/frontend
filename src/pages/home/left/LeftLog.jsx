import { Icon } from 'assets/icons/icons';
import { useLeftLog } from 'common/contexts/useLeftLog';
import React from 'react';

export default function LeftLog() {
  const activityLog = useLeftLog();

  //group log entries by user + action
  const grouped = {};
  activityLog.forEach(({ user, action, start, end }) => {
    const key = `${user}-${action}`;
    if (!grouped[key]) grouped[key] = { user, action, sessions: [] };

    grouped[key].sessions.push({ start, end });
  });

  const formatTimeRange = (start, end) => {
    const options = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
    const startStr = start.toLocaleString('en-US', options);
    const endStr = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className='white-bg'>
      <h3 className='how-to-title'>
        <Icon.Clock className='how-to-icon' /> Activity Log
      </h3>
      <div className='details'>
        {Object.values(grouped).map(({ user, action, sessions }, i) => (
          <div key={i}>
            <p>{user} {action} the following sessions:</p>
            <ul>
              {sessions.map(({ start, end }, j) => (
                <li key={j}>{formatTimeRange(start, end)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}