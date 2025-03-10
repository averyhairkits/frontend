import { useEffect, useRef, useState } from 'react';

export const useNumVolunteers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [numVolunteers, setNumVolunteers] = useState(1);
  const optionsPopUpRef = useRef(null);

  const handleNumVolunteersButton = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionsPopUp = (option) => {
    setIsOpen(false);
    setNumVolunteers(option);
  };

  useEffect(() => {
    const handleSelectOutside = (event) => {
      if (
        optionsPopUpRef.current &&
        !optionsPopUpRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    isOpen ? console.log('popup opens') : console.log('popup closes');
    console.log(`number of volunteers: ${numVolunteers}`);

    if (isOpen) {
      document.addEventListener('mousedown', handleSelectOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleSelectOutside);
    };
  }, [isOpen]);

  return {
    numVolunteers,
    isOpen,
    handleNumVolunteersButton,
    handleOptionsPopUp,
    optionsPopUpRef,
  };
};
