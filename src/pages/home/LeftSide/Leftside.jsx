import React, { useState } from 'react';

import { Icon } from 'assets/icons/icons.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import 'pages/home/LeftSide/Leftside.css';

export default function Layout() {
  const [date, setDate] = useState(new Date());

  return (
    <div className='layout'>
      {/* Sidebar */}
      <div className='sidebar'>
        <div className='sidebar-content'>
          <h2 className='title'>
            <span className='logo-container'>
              <img src='/logo.jpeg' alt="Avery's Hair Kit Logo" />
            </span>
            Averys <br /> Helpful Hair <br /> Kits
          </h2>

          <div className='white-bg'>
            <h3 className='how-to-title'>
              <Icon.HowTo className='how-to-icon' /> How-To
            </h3>
            <div className='log-entry'>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse in scelerisque ipsum. Morbi a vulputate purus Duis
                vestibulum cursus erat vel suscipit. Nullam facilisis magna et
                libero egestas, eu fermentum.
              </p>
              <h3 className='Faq-title'>
                <Icon.Faq className='Faq-icon' /> FAQS
              </h3>
              <p>Lorem ipsum dolor sit amet?</p>
              <ul>
                <li>consectetur adipiscing elie</li>
              </ul>
              <p>Suspendisse in scelerisque ipsum?</p>
              <ul>
                <li>Morbi a vulputate purus</li>
              </ul>
            </div>
          </div>
          <div className='sidebar-calendar'>
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={({ date }) => {
                const highlightedDates = [
                  '2025-02-10',
                  '2025-02-11',
                  '2025-02-13',
                ];
                return highlightedDates.includes(
                  date.toISOString().split('T')[0]
                )
                  ? 'highlight'
                  : null;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
