import React from 'react';

import { Icon } from 'assets/icons/icons';
import PropTypes from 'prop-types';

import useUserList from 'common/contexts/useUserList';
import 'pages/home/Home.css';
import NavButtons from 'pages/home/NavButtons';
import LeftSide from 'pages/home/left/LeftSide';

import './UserList.css';

const Header = ({ sortHandlers }) => {
  const headings = ['Name', 'Email', 'Created At', 'Admin'];

  return (
    <thead>
      <tr>
        {headings.map((heading) => (
          <th
            key={heading}
            className={
              heading === 'Email'
                ? 'emailColumn'
                : heading === 'Admin'
                  ? 'adminColumn'
                  : ''
            }
          >
            <div className='headData '>
              <h3>{heading}</h3>
              {heading !== 'Admin' && (
                <div>
                  <button
                    onClick={() => {
                      if (heading === 'Name') sortHandlers.handleNameAsc();
                      else if (heading === 'Email')
                        sortHandlers.handleEmailAsc();
                      else if (heading === 'Date Registered')
                        sortHandlers.handleDateRegisteredAsc();
                    }}
                  >
                    <Icon.SortUp />
                  </button>
                  <button
                    onClick={() => {
                      if (heading === 'Name') sortHandlers.handleNameDsc();
                      else if (heading === 'Email')
                        sortHandlers.handleEmailDsc();
                      else if (heading === 'Date Registered')
                        sortHandlers.handleDateRegisteredDsc();
                    }}
                  >
                    <Icon.SortDown />
                  </button>
                </div>
              )}
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

const Rows = ({ sortedAllUsers, handleGrant }) => {
  return (
    <tbody>
      {sortedAllUsers.map((user, i) => {
        console.log(`User ${i}:`, user);
        return (
          <tr
            key={i}
            style={{
              backgroundColor:
                i % 2 === 0 ? 'var(--white)' : 'var(--lightest-gray)',}}>
            <td>
              <h3 className='name'>{user.name}</h3>
            </td>
            <td>
              <h3 className='email'>{user.email}</h3>
            </td>
            <td>
              <h3>{new Date(user.dateRegistered).toLocaleDateString()}</h3>
            </td>
            <td className='admin'>
              <input
                type='checkbox'
                checked={user.role === 'admin'}
                onClick={() => handleGrant(user)}
              />
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

Rows.propTypes = {
  sortedAllUsers: PropTypes.array.isRequired,
  handleGrant: PropTypes.func.isRequired,
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
            <Rows sortedAllUsers={sortedAllUsers} handleGrant={sortHandlers.handleGrant} />
          </table>
        </div>
      </div>
    </main>
  );
};

export default UserList;
