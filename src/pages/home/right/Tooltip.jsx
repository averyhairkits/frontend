import React from 'react';
import './Tooltip.css';

export const Tooltip = ({ isOpen, content }) => {
  if (!isOpen) return null;

  return (
    <div className="tooltipText" onClick={(e) => e.stopPropagation()}>
      {content}
    </div>
  );
};
