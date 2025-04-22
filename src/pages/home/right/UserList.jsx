import React from 'react';

import { Icon } from 'assets/icons/icons';

import 'pages/home/Home.css';
import NavButtons from 'pages/home/NavButtons';
import LeftSide from 'pages/home/left/LeftSide';

import './UserList.css';

const Rows = () => {
  const table = Array.from({ length: 18 }, () => Array(3).fill('Lorem Ipsum'));

  return (
    <tbody>
      {table.map((row, r) => {
        return (
          <tr
            key={r}
            style={{
              backgroundColor:
                r % 2 === 0 ? 'var(--white)' : 'var(--lightest-gray)',
            }}
          >
            {row.map((val, c) => {
              return (
                <td key={c}>
                  <h3 className={c === 0 ? 'name' : c === 1 ? 'email' : ''}>
                    {val}
                  </h3>
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

const UserList = () => {
  return (
    <main>
      <NavButtons isAdmin={true} />
      <LeftSide isAdmin={true} />
      <div className='rightside'>
        <h6>Registered Volunteers</h6>
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>
                  <div className='headData'>
                    <h3>Name</h3>
                    <div>
                      <Icon.SortUp />
                      <Icon.SortDown />
                    </div>
                  </div>
                </th>
                <th>
                  <div className='headData'>
                    <h3>Email</h3>
                    <div>
                      <Icon.SortUp />
                      <Icon.SortDown />
                    </div>
                  </div>
                </th>
                <th>
                  <div className='headData'>
                    <h3>Registered On</h3>
                    <div>
                      <Icon.SortUp />
                      <Icon.SortDown />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <Rows />
          </table>
        </div>
      </div>
    </main>
  );
};

export default UserList;
