import { useEffect, useRef, useState } from 'react';

export const useAvailability = () => {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const isDragging = useRef(false);
  const [canSave, setCanSave] = useState(false);
  const [prevSelectedCells, setPrevSelectedCells] = useState(
    new Set(selectedCells)
  );

  const selectedCellsChanged = () => {
    if (selectedCells.size !== prevSelectedCells.size) return true;
    for (const val of prevSelectedCells) {
      if (!selectedCells.has(val)) return true;
    }
    return false;
  };

  const toggleSelection = (index) => {
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleMouseDown = (index) => {
    isDragging.current = true;
    toggleSelection(index);
  };

  const handleMouseEnter = (index) => {
    if (isDragging.current) {
      toggleSelection(index);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    selectedCellsChanged() ? setCanSave(true) : setCanSave(false);
  }, [selectedCells]);

  const handleSave = () => {
    console.log('Saved');
    setCanSave(false);
    setPrevSelectedCells(new Set(selectedCells));
  };

  useEffect(() => {
    console.log("Can press 'save': ", canSave);
  }, [canSave]);

  return {
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleSave,
    canSave,
    selectedCells,
  };
};
