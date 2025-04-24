import { useEffect, useMemo, useState } from 'react';

const allUsers = [
  {
    id: 1,
    name: 'Another Person',
    email: 'alongemailcuzwhynot@gmail.com',
    dateRegistered: new Date('2025-02-04'),
  },
  {
    id: 2,
    name: 'John Day',
    email: 'johnday@yahoo.com',
    dateRegistered: new Date('2025-02-01'),
  },
  {
    id: 3,
    name: 'Some Person',
    email: 'example@ymail.com',
    dateRegistered: new Date('2025-10-25'),
  },
  {
    id: 4,
    name: 'Melissa Met',
    email: 'melissaaddress@mail.com',
    dateRegistered: new Date('2025-08-14'),
  },
];

export const useUserList = () => {
  const [sortType, setSortType] = useState('nameAsc');

  const sortedAllUsers = useMemo(() => {
    const sortedUsers = [...allUsers];
    switch (sortType) {
      case 'nameAsc':
        return sortedUsers.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
      case 'nameDsc':
        return sortedUsers.sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
        );
      case 'emailAsc':
        return sortedUsers.sort((a, b) =>
          a.email.localeCompare(b.email, undefined, { sensitivity: 'base' })
        );
      case 'emailDsc':
        return sortedUsers.sort((a, b) =>
          b.email.localeCompare(a.email, undefined, { sensitivity: 'base' })
        );
      case 'dateRegisteredAsc':
        return sortedUsers.sort((a, b) => a.dateRegistered - b.dateRegistered);
      case 'dateRegisteredDsc':
        return sortedUsers.sort((a, b) => b.dateRegistered - a.dateRegistered);
      default:
        return sortedUsers;
    }
  }, [allUsers, sortType]);

  useEffect(() => {
    console.log('sort: ', sortType);
  }, [sortType]);

  const handleNameAsc = () => {
    setSortType('nameAsc');
  };
  const handleNameDsc = () => {
    setSortType('nameDsc');
  };
  const handleEmailAsc = () => {
    setSortType('emailAsc');
  };
  const handleEmailDsc = () => {
    setSortType('emailDsc');
  };
  const handleDateRegisteredAsc = () => {
    setSortType('dateRegisteredAsc');
  };
  const handleDateRegisteredDsc = () => {
    setSortType('dateRegisteredDsc');
  };

  return {
    sortedAllUsers,
    handleNameAsc,
    handleNameDsc,
    handleEmailAsc,
    handleEmailDsc,
    handleDateRegisteredAsc,
    handleDateRegisteredDsc,
  };
};

export default useUserList;
