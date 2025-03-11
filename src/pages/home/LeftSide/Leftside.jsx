import React, { useState } from 'react';

import { Icon } from 'assets/icons/icons.js';
import Calendar from 'react-calendar';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import 'pages/home/LeftSide/Leftside.css';

export default function Layout() {
  const { currentDate, todaysDate } = useCalendarContext();
  const [date] = useState(currentDate);
  const fourWeeksTime = 27 * 24 * 60 * 60 * 1000;
  const underline1Dates = [
    new Date(2025, 1, 10),
    new Date(2025, 1, 11),
    new Date(2025, 1, 13),
  ];
  const underline2Dates = [new Date(2025, 1, 11), new Date(2025, 1, 13)];

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
          const isUnderline1 = underline1Dates.some(
            (d) => d.getTime() === date.getTime()
          );
          const isUnderline2 = underline2Dates.some(
            (d) => d.getTime() === date.getTime()
          );

          if (isUnderline1 && isUnderline2) return 'underlineBoth';
          if (isUnderline1) return 'underline1';
          if (isUnderline2) return 'underline2';
          return '';
        }}
      />
    </div>
  );
}
