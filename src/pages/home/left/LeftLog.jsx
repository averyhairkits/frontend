import React from 'react';

import { Icon } from 'assets/icons/icons';

export default function LeftLog() {
  return (
    <div className='white-bg'>
      <h3 className='how-to-title'>
        <Icon.Clock className='how-to-icon' /> Cancellation Log
      </h3>
      <div className='log-entry'>
        <div>
          <p>Melissa M. canceled the following sessions:</p>
          <ul>
            <li>02/11 (Tue) 01:00 PM - 02:00 PM</li>
            <li>02/13 (Thu) 11:00 AM - 12:30 PM</li>
          </ul>
        </div>
        <div>
          <p>John D. canceled the following sessions:</p>
          <ul>
            <li>Tue 9:00 AM - 10:00 AM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
