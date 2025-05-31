import React from 'react';

import PropTypes from 'prop-types';

import './Tooltip.css';

export const Tooltip = ({ isOpen, content }) => {
  if (!isOpen) return null;

  return (
    <div className='tooltipText' onClick={(e) => e.stopPropagation()}>
      {content}
    </div>
  );
};

Tooltip.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  content: PropTypes.node.isRequired,
};
