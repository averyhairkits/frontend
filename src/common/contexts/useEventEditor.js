import { useState } from 'react';

export const useEventEditor = (initialEvent = null) => {
  const [eventData, setEventData] = useState(
    initialEvent || {
      title: '',
      description: '',
      startRow: null,
      endRow: null,
      col: null,
      volunteers: [],
    }
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleChangeTitle = (e) => {
    setEventData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleChangeDescription = (e) => {
    setEventData((prev) => ({ ...prev, description: e.target.value }));
  };

  const setSelection = (selection) => {
    setEventData((prev) => ({ ...prev, ...selection }));
  };

  const resetEvent = () => {
    setEventData({
      title: '',
      description: '',
      startRow: null,
      endRow: null,
      col: null,
      volunteers: [],
    });
    setIsEditing(false);
  };

  return {
    eventData,
    setEventData,
    isEditing,
    setIsEditing,
    handleChangeTitle,
    handleChangeDescription,
    setSelection,
    resetEvent,
  };
};
