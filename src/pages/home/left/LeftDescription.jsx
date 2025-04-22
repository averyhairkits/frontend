import React from 'react';

import { Icon } from 'assets/icons/icons';

export default function LeftDescription() {
  return (
    <div className='white-bg'>
      <h3 className='how-to-title'>
        <Icon.HowTo className='how-to-icon' /> How-To
      </h3>
      <div className='details'>
        <ol>
          <li>Navigate between weeks using the forward and backward arrows.</li>
          <li>
            Select your team&apos;s headcount from the dropdown in the top left.
          </li>
          <li>
            Click and drag to choose the dates and time slots when you&apos;ll
            be available.
          </li>
          <li>
            Time slots with confirmed events that still have vacancies are
            highlighted in purple.
          </li>
          <li>Click &quot;Save&quot; to finalize your availability.</li>
          <li>
            To cancel an appointment, deselect the relevant time slots using the
            same click-and-drag method and click &quot;Save.&quot;
          </li>
          <li>
            If a volunteering activity is scheduled during your available times,
            you&apos;ll receive an email notification.
          </li>
          {/* insert additional steps here: one step is a <li/> */}
        </ol>
      </div>

      <h3 className='how-to-title'>
        <Icon.Faq className='Faq-icon' /> FAQS
      </h3>
      <div className='details'>
        <p>How will I know if a session I was scheduled for was cancelled?</p>
        <ul>
          <li>
            You will be promptly informed by email and the notification center
            in the top right.
          </li>
        </ul>
        <p>How will I know if a session I was scheduled for was cancelled?</p>
        <ul>
          <li>
            You will be promptly informed by email and the notification center
          </li>
        </ul>
        {/* insert additional questions & answers here: one question and answer is a <p/> <ul> <li/> </ul> */}
      </div>
    </div>
  );
}
