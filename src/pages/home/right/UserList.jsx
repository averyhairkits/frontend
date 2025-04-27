import React from 'react';

import { Icon } from 'assets/icons/icons';
import PropTypes from 'prop-types';

import 'pages/home/Home.css';
import NavButtons from 'pages/home/NavButtons';
import LeftSide from 'pages/home/left/LeftSide';
import useUserList from 'pages/home/right/useUserList';

import './UserList.css';

const Header = ({ sortHandlers }) => {
  const headings = ['Name', 'Email', 'Date Registered'];

  return (
    <thead>
      <tr>
        {headings.map((heading) => (
          <th
            key={heading}
            className={heading === 'Email' ? 'emailColumn' : ''}
          >
            <div className='headData '>
              <h3>{heading}</h3>
              <div>
                <button
                  onClick={() => {
                    if (heading === 'Name') sortHandlers.handleNameAsc();
                    else if (heading === 'Email') sortHandlers.handleEmailAsc();
                    else if (heading === 'Date Registered')
                      sortHandlers.handleDateRegisteredAsc();
                  }}
                >
                  <Icon.SortUp />
                </button>
                <button
                  onClick={() => {
                    if (heading === 'Name') sortHandlers.handleNameDsc();
                    else if (heading === 'Email') sortHandlers.handleEmailDsc();
                    else if (heading === 'Date Registered')
                      sortHandlers.handleDateRegisteredDsc();
                  }}
                >
                  <Icon.SortDown />
                </button>
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

Header.propTypes = {
  sortHandlers: PropTypes.shape({
    handleNameAsc: PropTypes.func.isRequired,
    handleNameDsc: PropTypes.func.isRequired,
    handleEmailAsc: PropTypes.func.isRequired,
    handleEmailDsc: PropTypes.func.isRequired,
    handleDateRegisteredAsc: PropTypes.func.isRequired,
    handleDateRegisteredDsc: PropTypes.func.isRequired,
  }).isRequired,
};

const Rows = ({ sortedAllUsers }) => {
  console.log('sortedAllusers: ', sortedAllUsers);
  return (
    <tbody>
      {sortedAllUsers.map((user, i) => {
        return (
          <tr
            key={i}
            style={{
              backgroundColor:
                i % 2 === 0 ? 'var(--white)' : 'var(--lightest-gray)',
            }}
          >
            <td>
              <h3 className='name'>{user.name}</h3>
            </td>
            <td>
              <h3 className='email'>{user.email}</h3>
            </td>
            <td>
              <h3>{user.dateRegistered.toLocaleDateString()}</h3>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

Rows.propTypes = {
  sortedAllUsers: PropTypes.array.isRequired,
};

const UserList = () => {
  const { sortedAllUsers, ...sortHandlers } = useUserList();
  console.log('sortedAllusers: ', sortedAllUsers);

  return (
    <main>
      <NavButtons isAdmin={true} />
      <LeftSide isAdmin={true} />
      <div className='rightside'>
        <h6>Registered Volunteers</h6>
        <div className='tableContainer'>
          <table>
            <Header sortHandlers={sortHandlers} />
            <Rows sortedAllUsers={sortedAllUsers} />
          </table>
        </div>
      </div>
    </main>
  );
};

export default UserList;
