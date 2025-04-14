import React from 'react';

import { Icon } from 'assets/icons/icons.js';
import Calendar from 'react-calendar';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import 'pages/home/LeftSide/Leftside.css';
import confirmedTimes from 'pages/home/calendar/confirmedTimes';

export default function Layout() {
  const { todaysDate } = useCalendarContext();
  const fourWeeksTime = 27 * 24 * 60 * 60 * 1000;
  const selectedDates = [
    new Date(2025, 1, 10),
    new Date(2025, 1, 11),
    new Date(2025, 1, 13),
  ];

  return (
    <div className='leftSection'>
      <div className='title'>
        <span className='logo-container'>
          <img src='/logo.jpeg' alt="Avery's Hair Kit Logo" />
        </span>
        Avery&apos;s Helpful Hair Kits
      </div>

      <div className='white-bg'>
        <h3 className='how-to-title'>
          <Icon.HowTo className='how-to-icon' /> How-To
        </h3>
        <div className='log-entry'>
          <p>
            <ol>
              <li>
                Navigate between weeks using the forward and backward arrows.
              </li>
              <li>
                Select your teams headcount from the dropdown in the top left.
              </li>
              <li>
                Click and drag to choose the dates and time slots when
                you&apos;ll reavailable.
              </li>
              <li>
                Time slots with confirmed events that still have vacancies are
                highlighted in purple.
              </li>
              <li> Click &quot;Save&quot; to finalize your availability. </li>
              <li>
                To cancel an appointment, deselect the relevant time slots using
                the same click-and-drag method and click &quot;Save&quot;.
              </li>
              <li>
                If a volunteering activity is scheduled during your available
                times, you&apos;ll receive an email notification.
              </li>
            </ol>
          </p>
        </div>
        <h3 className='how-to-title'>
          <Icon.Faq className='Faq-icon' /> FAQS
        </h3>
        <div className='log-entry'>
          <div>
            <p>
              Q: How will I know if a session I was scheduled for was cancelled?
            </p>
            <ul>
              <li>
                A: You will be promptly informed by email and the notification
                center in the top right.
              </li>
            </ul>
          </div>
          <div></div>
        </div>
      </div>

      <Calendar
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: 'narrow' })
        }
        maxDetail='month'
        minDetail='month'
        minDate={todaysDate}
        maxDate={new Date(todaysDate.getTime() + fourWeeksTime)}
        value={todaysDate}
        prevLabel={<Icon.Back />}
        nextLabel={<Icon.Next />}
        tileClassName={({ date }) => {
          const isSelectedDate = selectedDates.some(
            (d) => d.toDateString() === date.toDateString()
          );
          const isConfirmedDate = confirmedTimes.some(
            (d) => d.toDateString() === date.toDateString()
          ); // doesn't account for confirmed but not selected yet

          if (isSelectedDate && isConfirmedDate) return 'underlineBoth';
          if (isSelectedDate) return 'underline1';
          if (isConfirmedDate) return 'underline2';
          return '';
        }}
      />
    </div>
  );
}
