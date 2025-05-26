import { useEffect, useMemo, useState } from 'react';

import { useUser } from 'common/contexts/UserContext';

export const useUserList = () => {
  const [sortType, setSortType] = useState('nameAsc');
  const { allUsers, setAllUsers, fetchAllUsers } = useUser();

  useEffect(() => {
    fetchAllUsers();
  }, []);
const handleGrant = async (user) => {
  const newRole = user.role === 'admin' ? 'volunteer' : 'admin';

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/auth/update_role`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ usertoupdate: user }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Server responded with error:', result);
      throw new Error(result.error || 'Failed to update role');
    }

    setAllUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, role: newRole } : u
      )
    );

    console.log(`Role changed to ${newRole} for`, user.firstname);
  } catch (error) {
    console.error('Error updating role:', error);
    alert(`Error: ${error.message}`);
  }
};



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
    handleGrant,
  };
};

export default useUserList;
