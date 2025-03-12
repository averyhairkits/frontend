import React, { useState } from 'react';

import { Icon } from 'assets/icons/icons.js';
import Calendar from 'react-calendar';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import 'pages/home/LeftSide/Leftside.css';
import confirmedTimes from 'pages/home/calendar/confirmedTimes';

export default function Layout() {
  const { currentDate, todaysDate } = useCalendarContext();
  const [date] = useState(currentDate);
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            in scelerisque ipsum. Morbi a vulputate purus Duis vestibulum cursus
            erat vel suscipit. Nullam facilisis magna et libero egestas, eu
            fermentum.
          </p>
        </div>
        <h3 className='how-to-title'>
          <Icon.Faq className='Faq-icon' /> FAQS
        </h3>
        <div className='log-entry'>
          <div>
            <p>Lorem ipsum dolor sit amet?</p>
            <ul>
              <li>consectetur adipiscing elie</li>
            </ul>
          </div>
          <div>
            <p>Suspendisse in scelerisque ipsum?</p>
            <ul>
              <li>Morbi a vulputate purus</li>
            </ul>
          </div>
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
        value={date}
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
