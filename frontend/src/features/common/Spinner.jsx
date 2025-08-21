import React from 'react';

const Spinner = ({ size = 6 }) => (
  <div className={`animate-spin rounded-full border-2 border-t-2 border-gray-200 border-t-teal-500`} style={{ width: `${size}rem`, height: `${size}rem` }} />
);

export default Spinner;
