import React from 'react';

import { Icon } from 'assets/icons/icons';
import PropTypes from 'prop-types';

import { useCalendarContext } from 'common/contexts/CalendarContext';
import { useAdminCalendarGrid } from 'common/contexts/useAdminCalendarGrid';

import './AdminHome.css';
import { Tooltip } from './Tooltip';

export const AdminCalendarGrid = () => {
  const { gridItemTimes } = useCalendarContext();
  const {
    handleMouseUp,
    canSave,
    dateToRowCol,
    handleMouseDown,
    handleMouseMove,
    eventData,
    getSelectionStyle,
    handleCancel,
    isEditing,
    getPopUpStyle,
    handleSave,
    filteredConfirmedTimes,
    getEventTime,
    getEventDate,
    handleChangeTitle,
    handleChangeDescription,
    handleSessionClick,
    confirmDelete,
    cancelDelete,
    selectedSessionToDelete,
    predictedVolunteers,
    loadingSessions,
  } = useAdminCalendarGrid();

  const [openTooltipIndex, setOpenTooltipIndex] = React.useState(null);

  if (loadingSessions) {
    return (
      <div className='page loading'>
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          Loading sessions...
        </p>
      </div>
    );
  }

  const renderEventPopup = (eventData) => {
    const minRow = Math.min(eventData.startRow, eventData.endRow);
    const maxRow = Math.max(eventData.startRow, eventData.endRow);

    return (
      <div className='popUp' style={getPopUpStyle(eventData)}>
        <div className='cancelSave'>
          <button className='cancel' onClick={handleCancel}>
            Cancel
          </button>
          <button className='save' onClick={handleSave}>
            Save
          </button>
        </div>
        <input
          className='titleInput'
          type='text'
          placeholder='Add Title...'
          value={eventData.title}
          onChange={handleChangeTitle}
        />
        <div className='item'>
          <Icon.Clock className='icon' />
          <p>{`${getEventDate(eventData, true)}, 
        ${getEventDate(eventData, false)}, 
        ${getEventTime(minRow, true)} -
        ${getEventTime(maxRow, false)}`}</p>
        </div>
        <div className='item'>
          <Icon.Map className='icon' />
          <p>2020 Greenwood Avenue, Evanston, IL 60201</p>
        </div>
        <div className='item'>
          <Icon.Pen className='icon' />
          <p>Description (Optional)</p>
        </div>
        <textarea
          className='description'
          placeholder='Add description...'
          value={eventData.description}
          onChange={handleChangeDescription}
        />
      </div>
    );
  };

  return (
    <div
      className='calendarGrid'
      style={{ pointerEvents: canSave ? 'none' : 'auto' }}
    >
      <div className='calendarGridMask'>
        {gridItemTimes.map((_, i) => (
          <div
            key={i}
            className={`${i % 2 === 0 ? 'calendarGridItemTop' : 'calendarGridItemBottom'}`}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseMove(i)}
            onMouseUp={handleMouseUp}
            style={{
              backgroundColor: `var(--sign-up-fill-${gridItemTimes[i].size})`,
            }}
          />
        ))}
      </div>

      {/* Previously confirmed events */}
      {filteredConfirmedTimes.map((session, i) => {
        const aSelection = dateToRowCol(session);
        const minRow = Math.min(aSelection.startRow, aSelection.endRow);
        const maxRow = Math.max(aSelection.startRow, aSelection.endRow);

        return (
          <div
            key={i}
            className={`event ${session.status === 'cancelled' ? 'cancelled' : ''}`}
            style={getSelectionStyle(aSelection)}
            onClick={() => handleSessionClick(session)}
          >
            <div className='content'>
              <div className='contentInner'>
                <h1>{session.title || 'New Event'}</h1>
                <h2>
                  {getEventTime(minRow, true)} - {getEventTime(maxRow, false)}
                </h2>
                <h3>{session.description}</h3>
              </div>
              <div className='numVolunteersContainer'>
                <div
                  className='volunteerTooltip'
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenTooltipIndex(openTooltipIndex === i ? null : i);
                  }}
                >
                  <Icon.User width='24px' />
                  <h4>{session.current_size ?? '0'}</h4>

                  <Tooltip
                    isOpen={openTooltipIndex === i}
                    content={
                      session.volunteers?.length ? (
                        <>
                          <strong>Contacts:</strong>
                          <ul>
                            {session.volunteers.map((v) => (
                              <li key={v.id}>
                                {v.firstname} {v.lastname} – {v.email}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <span>No volunteers</span>
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* New event or editing existing event */}
      {(eventData.startRow !== null || canSave) && (
        <div
          className='event'
          style={{ ...getSelectionStyle(eventData), pointerEvents: 'none' }}
        >
          <div className='content' style={{ pointerEvents: 'none' }}>
            <h1>{eventData.title || '(New Event)'}</h1>
            <h2>
              {getEventTime(
                Math.min(eventData.startRow, eventData.endRow),
                true
              )}
              -
              {getEventTime(
                Math.max(eventData.startRow, eventData.endRow),
                false
              )}
            </h2>
            <div className='numVolunteersContainer'>
              <Icon.User width='24px' />
              <h4>{predictedVolunteers?.current_size ?? 0}</h4>
            </div>
          </div>
          {isEditing && renderEventPopup(eventData)}
        </div>
      )}

      {selectedSessionToDelete && (
        <div className='deletePopup'>
          <div className='popupBox'>
            <p>Are you sure you want to cancel this session?</p>
            <div className='popupActions'>
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AdminCalendarGrid.propTypes = {
  gridItemTimes: PropTypes.array.isRequired,
};
