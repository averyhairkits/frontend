import React from 'react';

import './App.css';
import './VolunteerHome.css';

const CalendarNav = () => {
  return (
    <nav className='calendarNav'>
      <button className='calendarNavButton'>&lt;</button>
      <h6>February 10 - 16</h6>
      <button className='calendarNavButton'>&gt;</button>
    </nav>
  );
};

const Times = () => {
  const AllTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '',
  ];

  return (
    <div className='timeList'>
      {AllTimes.map((time) => (
        <div className='boldedSymbol' key={time}>
          {time}
        </div>
      ))}
    </div>
  );
};

const HeaderGrid = () => {
  return (
    <div className='headerGrid'>
      <h4 className='headerGridItem'>MON</h4>
      <h4 className='headerGridItem'>TUE</h4>
      <h4 className='headerGridItem'>WED</h4>
      <h4 className='headerGridItem'>THU</h4>
      <h4 className='headerGridItem'>FRI</h4>
      <h4 className='headerGridItem'>SAT</h4>
      <h4 className='headerGridItem'>SUN</h4>
      <h5 className='headerGridItem'>10</h5>
      <h5 className='headerGridItem'>11</h5>
      <h5 className='headerGridItem'>12</h5>
      <h5 className='headerGridItem'>13</h5>
      <h5 className='headerGridItem'>14</h5>
      <h5 className='headerGridItem'>15</h5>
      <h5 className='headerGridItem'>16</h5>
    </div>
  );
};

const CalendarGrid = () => {
  const gridItems = Array.from({ length: 140 });

  return (
    <div className='calendarGrid'>
      {gridItems.map((_, i) => {
        const row = Math.floor(i / 7);
        const itemType =
          row % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom';
        return <div key={i} className={itemType}></div>;
      })}
    </div>
  );
};

const VolunteerHome = () => {
  return (
    <main>
      <button className='navIcon'>logout</button>
      <div className='leftSection'></div>
      <div className='rightSection'>
        <CalendarNav />
        <div className='rightMainSection'>
          <div className='timeContainer'>
            <div className='numVolunteersContainer'>
              <button className='numVolunteersButton'>#People</button>
            </div>
            <Times />
          </div>
          <div className='gridContainer'>
            <HeaderGrid />
            <CalendarGrid />
          </div>
        </div>
        <button className='saveButton'>Save</button>
      </div>
    </main>
  );
};

export default VolunteerHome;
